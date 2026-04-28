"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function ClickBars({ data }: { data: { title: string; clicks: number }[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">카드 열람률 Top 5</h3>
      <div className="h-52 mt-3">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="title" width={140} tick={{ fontSize: 11, fill: "#64748b" }} />
            <Tooltip />
            <Bar dataKey="clicks" fill="#D97706" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
