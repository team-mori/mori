// Plain Node 테스트 — `npx tsx frontend/lib/parser/__tests__/rules.test.ts` 로 실행.
// vitest 도입 전 가벼운 sanity 체크용. 실패 시 process.exit(1).

import {
  extractDeadline,
  extractGpaRequirement,
  extractIncomeBracket,
  extractMoney,
  extractYearRequirement,
} from "../rules";

let pass = 0;
let fail = 0;

function expect<T>(label: string, got: T, want: T): void {
  const eq = JSON.stringify(got) === JSON.stringify(want);
  if (eq) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.error(`  ✗ ${label}\n    want: ${JSON.stringify(want)}\n    got:  ${JSON.stringify(got)}`);
  }
}

console.log("== 마감일 ==");
expect("키워드+ISO", extractDeadline("신청 마감: 2026-05-15까지")?.value, "2026-05-15");
expect("키워드+한글", extractDeadline("접수마감 2026년 6월 1일 18시")?.value, "2026-06-01");
expect("키워드+월일", extractDeadline("마감일 5월 30일", 2026)?.value, "2026-05-30");
expect("일자만", extractDeadline("2026.07.04 본문")?.value, "2026-07-04");
expect("미스", extractDeadline("내용 없음"), null);

console.log("== 금액 ==");
expect("최대 만원", extractMoney("월 20만원 또는 연간 200만원 지원")?.value, 2000000);
expect("원 단위", extractMoney("1,000,000원 지원")?.value, 1000000);
expect("미스", extractMoney("혜택 다양"), null);

console.log("== GPA ==");
expect("이상", extractGpaRequirement("직전학기 평점 3.5 이상")?.value, 3.5);
expect("표현 변형", extractGpaRequirement("학점 3.0점 이상")?.value, 3.0);
expect("미스", extractGpaRequirement("성적 무관"), null);

console.log("== 학년 ==");
expect("이상", extractYearRequirement("3학년 이상")?.value, { year: 3, op: "gte" });
expect("정확", extractYearRequirement("2학년")?.value, { year: 2, op: "eq" });

console.log("== 소득분위 ==");
expect("이하", extractIncomeBracket("소득 8분위 이하")?.value, { bracket: 8, op: "lte" });
expect("기본", extractIncomeBracket("소득 6분위")?.value, { bracket: 6, op: "lte" });

console.log(`\n결과: ${pass} pass / ${fail} fail`);
if (fail > 0) process.exit(1);
