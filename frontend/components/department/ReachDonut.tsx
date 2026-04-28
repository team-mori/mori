"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ReachDonut({ rate, reached, total }: { rate: number; reached: number; total: number }) {
  const data = [
    { name: "도달", value: rate },
    { name: "미도달", value: 100 - rate },
  ];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">도달률</h3>
      <div className="relative h-44 mt-3">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={50} outerRadius={70} startAngle={90} endAngle={-270}>
              <Cell fill="#2B3A55" />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-800">{rate}%</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400 text-center">
        공지 본 학생 {reached.toLocaleString()} / 전체 구독자 {total.toLocaleString()} (지난 7일)
      </p>
    </div>
  );
}
