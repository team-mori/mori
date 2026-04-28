// 공지별 5단계 퍼널: 도달 → 열람 → 연동 → 신청 예정 → 신청 완료.

export type FunnelRow = {
  noticeTitle: string;
  reach: number;
  open: number;
  calendar: number;
  planning: number;
  completed: number;
};

const STAGES = [
  { key: "reach" as const, label: "도달" },
  { key: "open" as const, label: "열람" },
  { key: "calendar" as const, label: "연동" },
  { key: "planning" as const, label: "예정" },
  { key: "completed" as const, label: "완료" },
];

export default function FunnelChart({ rows }: { rows: FunnelRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        아직 측정 가능한 데이터가 없어요. 공지 발행 후 24시간 뒤부터 표시됩니다.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="grid grid-cols-[1fr_repeat(5,minmax(0,1fr))] gap-3 border-b border-zinc-100 px-5 py-3 text-xs font-medium text-zinc-500">
        <span>공지</span>
        {STAGES.map((s) => <span key={s.key} className="text-right">{s.label}</span>)}
      </div>
      <ul className="divide-y divide-zinc-100">
        {rows.map((r, i) => {
          const reach = Math.max(1, r.reach);
          return (
            <li key={i} className="grid grid-cols-[1fr_repeat(5,minmax(0,1fr))] gap-3 px-5 py-3 text-sm">
              <span className="truncate text-zinc-800">{r.noticeTitle}</span>
              {STAGES.map((s) => {
                const v = r[s.key];
                const pct = Math.round((v / reach) * 100);
                const masked = v < 5;
                return (
                  <span key={s.key} className="text-right tabular-nums text-zinc-700">
                    {masked ? "*" : `${v} (${pct}%)`}
                  </span>
                );
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
