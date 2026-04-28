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
          {/* 디자인 가이드: 단일 neutral + semantic green/amber. */}
          <Line type="monotone" dataKey="reach" stroke="#94A3B8" strokeWidth={2} dot={false} name="도달" />
          <Line type="monotone" dataKey="open" stroke="#2B3A55" strokeWidth={2} dot={false} name="열람" />
          <Line type="monotone" dataKey="planning" stroke="#D97706" strokeWidth={2} dot={false} name="신청예정" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
