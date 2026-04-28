"use client";

import type { DeptData } from "@/lib/mock/department";

const STAGES = [
  { key: "reach", label: "도달", color: "bg-sky-500" },
  { key: "open", label: "열람", color: "bg-sky-600" },
  { key: "calendar", label: "캘린더", color: "bg-violet-500" },
  { key: "planning", label: "신청 예정", color: "bg-orange-400" },
  { key: "completed", label: "신청 완료", color: "bg-emerald-600" },
] as const;

export default function FunnelTable({ funnel }: { funnel: DeptData["funnel"] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 mb-4">공지별 퍼널 (도달 → 열람 → 캘린더 → 신청 예정 → 신청 완료)</h3>
      <div className="space-y-5">
        {funnel.map((row) => (
          <div key={row.title}>
            <p className="text-sm font-semibold text-slate-700 mb-2">{row.title}</p>
            <div className="flex gap-1.5">
              {STAGES.map((s) => {
                const v = row[s.key as keyof typeof row] as number;
                return (
                  <div key={s.key} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-8 rounded-md bg-slate-100 overflow-hidden">
                      <div className={`h-full ${s.color}`} style={{ width: `${v}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">{s.label}</p>
                    <p className="text-xs font-bold text-slate-700">{v}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
