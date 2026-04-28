// 부서 어드민 v2 대시보드 — 데스크톱 우선, 1280px 기준.
// 익명 집계, 5명 미만 마스킹, 공식 안내문 상단 명시.

import KpiCard from "./components/KpiCard";
import FunnelChart, { type FunnelRow } from "./components/FunnelChart";
import GapInsight from "./components/GapInsight";
import TrendLine, { type TrendPoint } from "./components/TrendLine";
import type { GapAggregation } from "@/lib/matcher";

// -----------------------------------------------------------------------------
// Mock fixture — 실제 API 연결 전 개발용. /admin/dashboard?range=14d 응답을 모사.
// -----------------------------------------------------------------------------

const KPI = {
  weeklyNotices: 12,
  reachRate: 73,
  calendarRate: 41,
  planningRate: 28,
  reachSample: 248, // 마스킹 판정용 표본 크기
};

const FUNNEL_ROWS: FunnelRow[] = [
  { noticeTitle: "국가장학금 2차 신청", reach: 412, open: 287, calendar: 156, planning: 132, completed: 89 },
  { noticeTitle: "삼성전자 신입공채", reach: 380, open: 251, calendar: 102, planning: 98, completed: 41 },
  { noticeTitle: "한중일 외교캠프", reach: 295, open: 168, calendar: 72, planning: 51, completed: 22 },
  { noticeTitle: "[석사 한정] 연구장학금", reach: 88, open: 33, calendar: 12, planning: 7, completed: 3 },
];

const GAP_TOP: GapAggregation[] = [
  { type: "gpa", count: 47, examples: ["GPA 3.2 → 3.5"] },
  { type: "language", count: 31, examples: ["TOEIC 820 → 900"] },
  { type: "year", count: 18, examples: ["학년 2 → 3"] },
];

const TREND: TrendPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    reach: 180 + Math.round(Math.sin(i / 2) * 40 + i * 4),
    open: 110 + Math.round(Math.cos(i / 2) * 30 + i * 2.5),
    planning: 35 + Math.round(Math.sin(i / 3) * 12 + i * 0.8),
  };
});

// -----------------------------------------------------------------------------

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">모리 어드민 — 장학복지팀</h1>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              익명 집계 데이터입니다 · 개인 식별 정보 일체 비공개 · 5명 미만 결과는 마스킹
            </p>
          </div>
          <select
            defaultValue="14d"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
          >
            <option value="7d">최근 7일</option>
            <option value="14d">최근 14일</option>
            <option value="30d">최근 30일</option>
          </select>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 hidden md:block">
        {/* 4 KPI */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="이번 주 발행 공지" value={KPI.weeklyNotices} hint="신규 + 갱신" />
          <KpiCard
            label="평균 도달률"
            value={`${KPI.reachRate}%`}
            rawCount={KPI.reachSample}
            hint="열람 학생 수 / 구독 학생 수"
          />
          <KpiCard
            label="평균 캘린더 연동률"
            value={`${KPI.calendarRate}%`}
            rawCount={KPI.reachSample}
            hint="연동 / 열람"
          />
          <KpiCard
            label="신청 예정 체크율"
            value={`${KPI.planningRate}%`}
            rawCount={KPI.reachSample}
            hint="체크 / 열람"
          />
        </section>

        {/* 본문 2-column */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900">공지별 퍼널</h2>
            <FunnelChart rows={FUNNEL_ROWS} />
            <TrendLine data={TREND} />
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900">자격 매칭 인사이트</h2>
            <GapInsight
              totalApplicants={186}
              unfitApplicants={43}
              topReasons={GAP_TOP}
            />
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              자격 매칭 결과는 학생이 입력한 프로필을 모리 매칭 엔진이 판정한 결과입니다.
              부서가 자격 요건 설계를 개선하는 참고 지표로 활용하세요.
            </p>
          </div>
        </section>
      </main>

      {/* 모바일 안내 */}
      <main className="mx-auto max-w-md p-6 md:hidden">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
          <p className="text-sm font-medium text-zinc-900">데스크톱에서 이용해주세요</p>
          <p className="mt-2 text-xs text-zinc-500">
            데이터 밀도가 높아 PC 화면에 최적화되어 있어요.
          </p>
        </div>
      </main>
    </div>
  );
}
