// 4개 KPI 카드 — 익명 집계, 5명 미만 마스킹.

type Props = {
  label: string;
  value: string | number;
  /** 작은 숫자(N) — 5 미만이면 자동 "*" 마스킹 */
  rawCount?: number;
  hint?: string;
};

export default function KpiCard({ label, value, rawCount, hint }: Props) {
  const masked = rawCount !== undefined && rawCount < 5;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900 tabular-nums">
        {masked ? "*" : value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-zinc-400">{hint}</p>}
      {masked && (
        <p className="mt-1 text-[10px] text-zinc-400">표본 5명 미만 — 마스킹</p>
      )}
    </div>
  );
}
