// 매칭 엔진 — 15쌍 (fit 5 / gap 5 / unfit 2 / unknown 3).
import { matchActionCard } from "../engine";
import { topGapReasons } from "../gap-analyzer";
import type { ActionCard, EligibilityRequirement, StudentProfile } from "../../types";

let pass = 0;
let fail = 0;

function check(label: string, cond: boolean, detail?: string): void {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.error(`  ✗ ${label}${detail ? "\n    " + detail : ""}`); }
}

function req(
  type: EligibilityRequirement["type"],
  operator: EligibilityRequirement["operator"],
  value: EligibilityRequirement["value"],
  raw?: string,
): EligibilityRequirement {
  return { type, operator, value, raw: raw ?? `${type} ${operator} ${value}` };
}

function card(elig: EligibilityRequirement[]): ActionCard {
  return {
    id: "c", noticeId: "n", title: "T", category: "scholarship",
    deadline: "2026-12-31",
    benefit: { type: "money", amount: 1000000, description: "" },
    eligibility: elig, documents: [], applyUrl: "https://x",
    confidence: { deadline: 1, eligibility: 0.9 },
  };
}

const baseStudent: StudentProfile = {
  userId: "u",
  status: "enrolled",
  year: 3,
  gpa: 3.6,
  totalCredits: 70,
  incomeBracket: 7,
  major: "소프트웨어",
  language: { TOEIC: 880 },
  certificates: ["정보처리기사"],
  currentSemester: "2026-1",
};

console.log("== fit (5) ==");
{
  const r = matchActionCard(baseStudent, card([req("gpa", "gte", 3.5)]));
  check("fit-1 gpa 3.5+", r.status === "fit");
  check("fit-1 satisfied 1", r.satisfied.length === 1);
}
{
  const r = matchActionCard(baseStudent, card([req("year", "gte", 2)]));
  check("fit-2 year 2+", r.status === "fit");
}
{
  const r = matchActionCard(baseStudent, card([req("income_bracket", "lte", 8)]));
  check("fit-3 income 8 이하", r.status === "fit");
}
{
  const r = matchActionCard(baseStudent, card([
    req("gpa", "gte", 3.0),
    req("year", "gte", 2),
    req("language", "gte", 800, "TOEIC 800 이상"),
  ]));
  check("fit-4 복합 충족", r.status === "fit", `status=${r.status}`);
}
{
  const r = matchActionCard(baseStudent, card([])); // 무자격 = fit
  check("fit-5 자격조항 없음", r.status === "fit");
}

console.log("== gap (5) — 일부 충족 + 일부 부족 ==");
{
  const r = matchActionCard(baseStudent, card([
    req("gpa", "gte", 3.5),
    req("language", "gte", 950, "TOEIC 950 이상"),
  ]));
  check("gap-1 gpa OK + TOEIC 부족", r.status === "gap");
  check("gap-1 missing 1", r.missing.length === 1);
  check("gap-1 recommendation", r.recommendation !== null);
}
{
  const r = matchActionCard(baseStudent, card([
    req("year", "gte", 2),
    req("certificate", "in", ["변호사"], "변호사 자격증 보유"),
  ]));
  check("gap-2 year OK + cert 부족", r.status === "gap");
}
{
  const r = matchActionCard(baseStudent, card([
    req("income_bracket", "lte", 8),
    req("gpa", "gte", 4.0),
  ]));
  check("gap-3 소득 OK + gpa 부족", r.status === "gap");
  const g = r.missing[0];
  check("gap-3 gap 문구", g.gap.includes("3.6") && g.gap.includes("4"));
}
{
  const r = matchActionCard(baseStudent, card([
    req("gpa", "gte", 3.5),
    req("grade", "gte", 100),
  ]));
  check("gap-4 학점 부족 (70 < 100)", r.status === "gap");
}
{
  const r = matchActionCard(baseStudent, card([
    req("year", "gte", 2),
    req("major", "contains", "기계공학", "기계공학 전공"),
  ]));
  check("gap-5 전공 미일치", r.status === "gap");
}

console.log("== unfit (2) — 모든 요건 미충족 ==");
{
  const r = matchActionCard(baseStudent, card([
    req("gpa", "gte", 4.4),
    req("language", "gte", 990, "TOEIC 990 이상"),
  ]));
  check("unfit-1", r.status === "unfit");
}
{
  const r = matchActionCard(baseStudent, card([
    req("year", "lte", 1),
    req("income_bracket", "lte", 1),
  ]));
  check("unfit-2", r.status === "unfit");
}

console.log("== unknown (3) — 학생 정보 미입력 ==");
{
  const noInfo: StudentProfile = { userId: "u" };
  const r = matchActionCard(noInfo, card([req("gpa", "gte", 3.0)]));
  check("unknown-1 gpa 미입력", r.status === "unknown");
  check("unknown-1 절대 unfit 아님", r.status !== "unfit");
}
{
  const partial: StudentProfile = { userId: "u", year: 3 };
  const r = matchActionCard(partial, card([
    req("year", "gte", 2),
    req("gpa", "gte", 3.0),
  ]));
  check("unknown-2 year fit + gpa 미입력 → unknown", r.status === "unknown",
    `status=${r.status}, satisfied=${r.satisfied.length}, unknown=${r.unknown.length}`);
}
{
  const r = matchActionCard({ userId: "u" }, card([req("custom", "eq", "특수", "특수 요건")]));
  check("unknown-3 custom 자동판정 불가", r.status === "unknown");
}

console.log("== 부가: Trace + Gap 집계 ==");
{
  const r = matchActionCard(baseStudent, card([
    req("gpa", "gte", 3.5),
    req("language", "gte", 950, "TOEIC 950 이상"),
  ]));
  check("trace 길이 = elig 수", r.trace.length === 2);
  check("trace decision 포함", r.trace.every((t) => ["satisfied", "missing", "unknown"].includes(t.decision)));
}
{
  const results = [
    matchActionCard(baseStudent, card([req("gpa", "gte", 4.0)])),
    matchActionCard(baseStudent, card([req("gpa", "gte", 4.0), req("language", "gte", 990, "TOEIC 990")])),
    matchActionCard(baseStudent, card([req("language", "gte", 990, "TOEIC 990")])),
  ];
  const top = topGapReasons(results, 3);
  check("Top gap reasons gpa 2회", top.find((x) => x.type === "gpa")?.count === 2);
  check("Top gap reasons language 2회", top.find((x) => x.type === "language")?.count === 2);
}

console.log(`\n결과: ${pass} pass / ${fail} fail`);
if (fail > 0) process.exit(1);
