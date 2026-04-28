"use client";

import { useState } from "react";
import Link from "next/link";
import ReachDonut from "@/components/department/ReachDonut";
import ClickBars from "@/components/department/ClickBars";
import CalendarLine from "@/components/department/CalendarLine";
import FunnelTable from "@/components/department/FunnelTable";
import { DEPT_OPTIONS, DEPT_MOCK, type DeptKey } from "@/lib/mock/department";

export default function DepartmentDemo() {
  const [dept, setDept] = useState<DeptKey>("scholarship");
  const data = DEPT_MOCK[dept];
  const label = DEPT_OPTIONS.find((d) => d.key === dept)!.label;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex">
        <aside className="w-60 min-h-screen bg-slate-900 text-slate-100 p-5 hidden md:block">
          <Link href="/" className="text-lg font-bold tracking-wide">MORI · 어드민</Link>
          <p className="text-xs text-slate-400 mt-1">부서용 데모</p>
          <div className="mt-8">
            <p className="text-xs uppercase text-slate-400 mb-2">부서 선택</p>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as DeptKey)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            >
              {DEPT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>
          <nav className="mt-8 space-y-1 text-sm">
            <a className="block px-3 py-2 rounded-md bg-slate-800">대시보드</a>
            <a className="block px-3 py-2 rounded-md text-slate-400">공지 관리</a>
            <a className="block px-3 py-2 rounded-md text-slate-400">학생 세그먼트</a>
            <a className="block px-3 py-2 rounded-md text-slate-400">설정</a>
          </nav>
        </aside>

        <div className="flex-1 p-6 md:p-8">
          <header className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-slate-500">대학 공지 운영 대시보드</p>
              <h1 className="text-2xl font-bold text-slate-700">{label}</h1>
            </div>
            <span className="text-[11px] bg-slate-200 text-slate-600 px-2 py-1 rounded">데모 데이터 (Mock Data)</span>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <ReachDonut rate={data.reachRate} reached={data.reachedStudents} total={data.totalSubscribers} />
            <ClickBars data={data.topClicks} />
            <CalendarLine data={data.calendarSync7d} />
          </section>

          <section className="mt-6">
            <FunnelTable funnel={data.funnel} />
          </section>

          <footer className="mt-10 text-xs text-slate-400">
            * 본 화면의 수치는 데모용 mock data 입니다. 실제 운영 시에는 익명 집계 기반 실데이터로 대체됩니다.
          </footer>
        </div>
      </div>
    </main>
  );
}
