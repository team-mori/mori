// 하이브리드 파서 — mock LLM 주입으로 SDK 의존 없이 검증.
// 표본 10건 (장학 5 / 비교과 3 / 취업 2).

import { parseNoticeToActionCard } from "../index";
import type { LlmCaller } from "../llm";
import type { Notice } from "../../types";

let pass = 0;
let fail = 0;

function check(label: string, cond: boolean, detail?: string): void {
  if (cond) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.error(`  ✗ ${label}${detail ? "\n    " + detail : ""}`);
  }
}

const SAMPLES: Array<{ notice: Notice; expectedDeadline: string; mustHaveAmount?: number }> = [
  {
    notice: makeNotice("s1", "scholarship", "국가장학금 2차 신청 안내",
      "<p>신청 마감: 2026-05-15까지. 최대 200만원 지원. 소득 8분위 이하.</p>"),
    expectedDeadline: "2026-05-15",
    mustHaveAmount: 2000000,
  },
  {
    notice: makeNotice("s2", "scholarship", "재단법인 우강장학재단",
      "<p>마감일 2026년 6월 1일. 생활비 월 20만원 지급. 평점 3.5 이상.</p>"),
    expectedDeadline: "2026-06-01",
    mustHaveAmount: 200000,
  },
  {
    notice: makeNotice("s3", "scholarship", "은평구민 장학생 선발",
      "본문: 신청기한 2026.05.20 18:00. 50만원."),
    expectedDeadline: "2026-05-20",
    mustHaveAmount: 500000,
  },
  {
    notice: makeNotice("s4", "scholarship", "동양이엔피 이공계 장학",
      "<div>제출기한: 2026-04-30. 1,000,000원 지원. 3학년 이상.</div>"),
    expectedDeadline: "2026-04-30",
    mustHaveAmount: 1000000,
  },
  {
    notice: makeNotice("s5", "scholarship", "KICS 통신학회 장학",
      "<p>접수마감 5월 25일까지. 100만원.</p>"),
    expectedDeadline: `${new Date().getFullYear()}-05-25`,
    mustHaveAmount: 1000000,
  },
  {
    notice: makeNotice("e1", "extracurricular", "한중일 외교캠프",
      "<p>신청기간: 2026-05-01 ~ 2026-05-27. 모집인원 30명.</p>"),
    expectedDeadline: "2026-05-27",
  },
  {
    notice: makeNotice("e2", "extracurricular", "AI경진대회 참가자 모집",
      "<p>마감 2026년 5월 10일. 1,2학년 권장.</p>"),
    expectedDeadline: "2026-05-10",
  },
  {
    notice: makeNotice("e3", "extracurricular", "통일모의국무회의",
      "본문: 2026-06-10 마감. 재학생 누구나."),
    expectedDeadline: "2026-06-10",
  },
  {
    notice: makeNotice("c1", "career", "현대로템 신입사원 채용",
      "<p>지원 마감: 2026-05-03 17:00. 학사 이상.</p>"),
    expectedDeadline: "2026-05-03",
  },
  {
    notice: makeNotice("c2", "career", "어플라이드 머티어리얼즈 인턴",
      "<p>마감일 2026-05-06. 이공계 3학년 이상.</p>"),
    expectedDeadline: "2026-05-06",
  },
];

const mockLlm: LlmCaller = async () => ({
  json: JSON.stringify({
    summary: "테스트 요약",
    target: "재학생",
    start_date: null,
    end_date: null,
    documents: ["서류A"],
    benefit: { type: "opportunity", description: "혜택" },
    eligibility: [],
    confidence: 0.8,
  }),
  usage: { input: 100, output: 50 },
});

(async () => {
  console.log("== 룰베이스 only ==");
  for (const s of SAMPLES) {
    const card = await parseNoticeToActionCard(s.notice, {});
    check(`${s.notice.id} 마감일`, card.deadline === s.expectedDeadline, `want ${s.expectedDeadline}, got ${card.deadline}`);
    if (s.mustHaveAmount) {
      check(`${s.notice.id} 금액`, card.benefit.amount === s.mustHaveAmount,
        `want ${s.mustHaveAmount}, got ${card.benefit.amount}`);
    }
  }
  console.log("== LLM mock 주입 ==");
  const card = await parseNoticeToActionCard(SAMPLES[0].notice, { llmCaller: mockLlm });
  check("LLM 호출 시 documents 사용", card.documents.length > 0);
  check("LLM 호출 시 confidence.eligibility ≥ 0.7", card.confidence.eligibility >= 0.7);

  console.log(`\n결과: ${pass} pass / ${fail} fail`);
  if (fail > 0) process.exit(1);
})();

function makeNotice(id: string, category: Notice["category"], title: string, body: string): Notice {
  return {
    id,
    category,
    title,
    summary: null,
    target: null,
    start_date: null,
    end_date: null,
    documents: [],
    source_url: `https://example.com/${id}`,
    source_board: "test",
    raw_html: body,
    llm_processed: false,
    created_at: new Date().toISOString(),
  };
}
