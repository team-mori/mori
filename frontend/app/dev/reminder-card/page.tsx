// ReminderCard 5상태 변형 데모 (Storybook 대용).
// http://localhost:3000/dev/reminder-card

"use client";

import ReminderCard from "@/components/student/ReminderCard";
import type { ActionCard, MatchResult } from "@/lib/types";

const TODAY = new Date();
function inDays(n: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const baseCard = (overrides: Partial<ActionCard> = {}): ActionCard => ({
  id: "c1",
  noticeId: "n1",
  title: "2026 우강장학재단 생활비 장학생 선발",
  category: "scholarship",
  deadline: inDays(10),
  benefit: { type: "money", amount: 2000000, description: "연 200만원" },
  eligibility: [],
  documents: ["가구원동의서", "소득증빙"],
  applyUrl: "https://example.com",
  confidence: { deadline: 0.95, eligibility: 0.85 },
  ...overrides,
});

const variants: Array<{ label: string; card: ActionCard; match: MatchResult }> = [
  {
    label: "1. fit (자격 충족) — D-10",
    card: baseCard(),
    match: { status: "fit", confidence: 0.92, satisfied: [], missing: [], unknown: [], recommendation: null, trace: [] },
  },
  {
    label: "2. fit + 임박 (D-3) — 좌측 amber 띠",
    card: baseCard({ deadline: inDays(3) }),
    match: { status: "fit", confidence: 0.92, satisfied: [], missing: [], unknown: [], recommendation: null, trace: [] },
  },
  {
    label: "3. gap (1개 부족)",
    card: baseCard({
      title: "[삼성전자] 2026 상반기 신입사원 채용",
      category: "career",
      benefit: { type: "opportunity", description: "신입공채" },
    }),
    match: {
      status: "gap",
      confidence: 0.81,
      satisfied: [],
      missing: [{
        requirement: { type: "language", operator: "gte", value: 950, raw: "TOEIC 950 이상" },
        studentValue: 880,
        gap: "TOEIC 880 → 950 (70점 부족)",
        suggestedActions: ["TOEIC 재시험 응시"],
      }],
      unknown: [],
      recommendation: "TOEIC 880 → 950 — 보완 후 재도전 가능해요.",
      trace: [],
    },
  },
  {
    label: "4. unknown (정보 입력 필요)",
    card: baseCard({ title: "국가장학금 2차 신청", deadline: inDays(20) }),
    match: { status: "unknown", confidence: 0.55, satisfied: [], missing: [], unknown: [
      { type: "income_bracket", operator: "lte", value: 8, raw: "소득 8분위 이하" },
    ], recommendation: null, trace: [] },
  },
  {
    label: "5. unfit (자격 미달) — dimmed",
    card: baseCard({ title: "[석사 한정] 연구장학금" }),
    match: {
      status: "unfit",
      confidence: 0.85,
      satisfied: [],
      missing: [{
        requirement: { type: "year", operator: "gte", value: 5, raw: "대학원 이상" },
        studentValue: 3,
        gap: "학년 3 → 5",
        suggestedActions: [],
      }],
      unknown: [],
      recommendation: null,
      trace: [],
    },
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-xl font-bold text-zinc-900">ReminderCard 변형 5종</h1>
      <p className="text-xs text-zinc-500">
        v2 디자인 가이드: 빨강 금지 · D-day 시각적 주인공 · 자격 라벨 우상단 · 모바일 우선
      </p>
      {variants.map((v) => (
        <section key={v.label} className="space-y-2">
          <h2 className="text-xs font-medium text-zinc-500">{v.label}</h2>
          <ReminderCard
            card={v.card}
            match={v.match}
            onApply={() => alert("Apply")}
            onSnooze={() => alert("Snooze")}
            onDismiss={() => alert("Dismiss")}
          />
        </section>
      ))}
    </main>
  );
}
