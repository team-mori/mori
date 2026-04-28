"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export type TrendPoint = { date: string; reach: number; open: number; planning: number };

export default function TrendLine({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 h-72">
      <h3 className="text-sm font-semibold text-zinc-900 mb-3">최근 14일 추이</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} />
          <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
          <Tooltip />
          <Line type="monotone" dataKey="reach" stroke="#0ea5e9" strokeWidth={2} dot={false} name="도달" />
          <Line type="monotone" dataKey="open" stroke="#a855f7" strokeWidth={2} dot={false} name="열람" />
          <Line type="monotone" dataKey="planning" stroke="#f97316" strokeWidth={2} dot={false} name="신청예정" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
