"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function CalendarLine({ data }: { data: { date: string; rate: number }[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">캘린더 연동률 (7일 추이)</h3>
      <div className="h-52 mt-3">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: -10, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
