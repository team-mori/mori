// .ics 생성 RFC 5545 valid 검증.
import { generateIcs, generateIcsBatch, validateIcs } from "../ics";
import type { ActionCard } from "../../types";

let pass = 0, fail = 0;
function check(label: string, cond: boolean, detail?: string): void {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.error(`  ✗ ${label}${detail ? "\n    " + detail : ""}`); }
}

const card: ActionCard = {
  id: "c-test",
  noticeId: "n-test",
  title: "테스트 장학, 쉼표·줄바꿈\n포함",
  category: "scholarship",
  deadline: "2026-06-15",
  benefit: { type: "money", amount: 1000000, description: "100만원" },
  eligibility: [
    { type: "gpa", operator: "gte", value: 3.5, raw: "평점 3.5 이상" },
  ],
  documents: [],
  applyUrl: "https://example.com/apply?id=1",
  confidence: { deadline: 0.95, eligibility: 0.85 },
};

const single = generateIcs(card);
const v1 = validateIcs(single);
check("single VCALENDAR valid", v1.valid, v1.errors.join(", "));
check("single VEVENT 1개", (single.match(/BEGIN:VEVENT/g) ?? []).length === 1);
check("VALARM 4단계", (single.match(/BEGIN:VALARM/g) ?? []).length === 4);
check("쉼표 escape", single.includes("\\,"));
check("줄바꿈 escape", single.includes("\\n"));
check("Asia/Seoul 명시", single.includes("Asia/Seoul"));
check("URL 보존", single.includes("https://example.com/apply?id=1"));

const batch = generateIcsBatch([card, { ...card, id: "c-test-2" }]);
const v2 = validateIcs(batch);
check("batch VCALENDAR valid", v2.valid, v2.errors.join(", "));
check("batch VEVENT 2개", (batch.match(/BEGIN:VEVENT/g) ?? []).length === 2);

console.log(`\n결과: ${pass} pass / ${fail} fail`);
if (fail > 0) process.exit(1);
