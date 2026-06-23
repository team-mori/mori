"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CalendarPlus,
  ListFilter,
  Search,
  UserRound,
} from "lucide-react";
import type { AppStatus, Notice } from "@/lib/types";
import { MOCK_NOTICES } from "@/lib/mock/notices";
import { buildICS } from "@/lib/ics";
import { cn } from "@/lib/utils";
import {
  CAT_META,
  dDay,
  matchStatus,
  type CatFilter,
  type StatusFilter,
  type ViewMode,
} from "./shared";
import MvpAgendaRow from "./MvpCard";
import CalendarMonth from "./CalendarMonth";

const CATS: CatFilter[] = ["all", "scholarship", "extracurricular", "career"];
const CAT_LABEL: Record<CatFilter, string> = {
  all: "전체",
  scholarship: "장학",
  extracurricular: "비교과",
  career: "취업",
};
const STATUSES: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "soon", label: "마감 임박" },
  { key: "open", label: "진행중" },
  { key: "closed", label: "지난 공고" },
];
const BOTTOM_NAV = [
  ["홈", Bell],
  ["공고", Search],
  ["일정", CalendarPlus],
  ["내 정보", UserRound],
] as const;

type StatusResponse = {
  statuses?: { notice_id: string; status: AppStatus }[];
};

function downloadICS(n: Notice) {
  const blob = new Blob([buildICS(n)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${n.title}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function localDayLabel(date: string | null): string {
  if (!date) return "미정";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "미정";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function MvpPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, AppStatus>>({});
  const [cat, setCat] = useState<CatFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [view, setView] = useState<ViewMode>("list");
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/notices")
      .then((r) => r.json() as Promise<{ notices?: Notice[] }>)
      .then((d) => {
        if (alive) setNotices(d.notices?.length ? d.notices : MOCK_NOTICES);
      })
      .catch(() => {
        if (alive) setNotices(MOCK_NOTICES);
      });

    fetch("/api/status")
      .then((r) => r.json() as Promise<StatusResponse>)
      .then((d) => {
        if (!alive) return;
        const next: Record<string, AppStatus> = {};
        for (const item of d.statuses ?? []) next[item.notice_id] = item.status;
        setStatusMap(next);
      })
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return notices
      .filter((n) => cat === "all" || n.category === cat)
      .filter((n) => matchStatus(n, status))
      .filter((n) => !ql || n.title.toLowerCase().includes(ql) || (n.summary ?? "").toLowerCase().includes(ql))
      .sort((a, b) => {
        const pa = dDay(a.end_date).diff < 0;
        const pb = dDay(b.end_date).diff < 0;
        if (pa !== pb) return pa ? 1 : -1;
        return (a.end_date ?? "9999").localeCompare(b.end_date ?? "9999");
      });
  }, [notices, cat, status, q]);

  const counts = useMemo(() => {
    let soon = 0;
    let open = 0;
    let closed = 0;
    let fit = 0;
    let planning = 0;
    let completed = 0;
    for (const n of notices) {
      const { diff } = dDay(n.end_date);
      if (Number.isNaN(diff) || diff >= 0) {
        open += 1;
        if (!Number.isNaN(diff) && diff <= 3) soon += 1;
      } else {
        closed += 1;
      }
      if (n.llm_processed) fit += 1;
      if (statusMap[n.id] === "planning") planning += 1;
      if (statusMap[n.id] === "completed") completed += 1;
    }
    return { total: notices.length, soon, open, closed, fit, planning, completed };
  }, [notices, statusMap]);

  const weekItems = useMemo(() => {
    return notices
      .filter((n) => dDay(n.end_date).diff >= 0)
      .sort((a, b) => (a.end_date ?? "9999").localeCompare(b.end_date ?? "9999"))
      .slice(0, 6);
  }, [notices]);

  async function setNoticeStatus(noticeId: string, next: AppStatus | null) {
    setStatusMap((prev) => {
      const copy = { ...prev };
      if (next) copy[noticeId] = next;
      else delete copy[noticeId];
      return copy;
    });
    await fetch("/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notice_id: noticeId, status: next }),
    }).catch(() => undefined);
  }

  return (
    <main className="min-h-screen bg-page pb-7 text-fg-1 sm:pb-0">
      <header className="sticky top-0 z-20 border-b border-line-2 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-4 font-[var(--font-weight-bold)] tracking-normal text-brand-text">
            모리
          </Link>
          <nav className="hidden items-center gap-2 text-2 text-fg-3 sm:flex">
            <Link href="/wireframe" className="rounded-3 px-3 py-2 hover:bg-sunken hover:text-fg-1">
              와이어프레임
            </Link>
            <Link href="/demo/department" className="rounded-3 px-3 py-2 hover:bg-sunken hover:text-fg-1">
              부서 화면
            </Link>
          </nav>
          <div className="grid h-7 w-7 place-items-center rounded-pill bg-brand-tint text-2 font-[var(--font-weight-bold)] text-brand-text">
            학
          </div>
        </div>
      </header>

      <section className="border-b border-line-2 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_calc(var(--space-9)*5)] lg:items-end">
            <div className="min-w-0">
              <p className="text-1 font-[var(--font-weight-bold)] uppercase text-brand-text">오늘의 모리</p>
              <h1 className="mt-2 max-w-3xl text-8 font-[var(--font-weight-bold)] tracking-normal text-fg-1">
                놓치기 쉬운 공고를 마감 순서로 정리했어요.
              </h1>
              <p className="mt-3 max-w-2xl text-3 text-fg-2">
                자격, 혜택, 제출일을 한 줄 흐름으로 보고 바로 일정에 넣을 수 있어요.
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-line-2 border-y border-line-1">
              <MetricLine label="진행중" value={counts.open} />
              <MetricLine label="임박" value={counts.soon} tone="due" />
              <MetricLine label="내 예정" value={counts.planning} tone="brand" />
            </div>
          </div>

          <div className="mt-5 border-t border-line-2 pt-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2 font-[var(--font-weight-bold)] text-fg-1">이번 주 마감</h2>
              <button
                onClick={() => setView("calendar")}
                className="inline-flex items-center gap-1 text-1 font-[var(--font-weight-medium)] text-brand-text"
              >
                <CalendarDays size={13} strokeWidth={1.75} aria-hidden />
                월간 보기
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {weekItems.map((notice) => (
                <button
                  key={notice.id}
                  onClick={() => {
                    setQ(notice.title);
                    setView("list");
                  }}
                  className="min-w-9 border-b-2 border-line-2 px-2 py-2 text-left hover:border-brand"
                >
                  <p className="text-1 text-fg-3">{localDayLabel(notice.end_date)}</p>
                  <p className="mt-1 text-3 font-[var(--font-weight-bold)] text-brand-text">
                    {dDay(notice.end_date).label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 lg:grid-cols-[calc(var(--space-9)*2.25)_minmax(0,1fr)]">
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-9 border-y border-line-2 py-3">
            <p className="px-1 text-1 font-[var(--font-weight-bold)] uppercase text-fg-3">필터</p>
            <div className="mt-3 divide-y divide-line-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    "flex w-full items-center justify-between px-1 py-3 text-left text-2 font-[var(--font-weight-medium)]",
                    cat === c ? "text-brand-text" : "text-fg-2 hover:text-fg-1",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {c !== "all" && <span className={cn("h-2 w-2 rounded-pill", CAT_META[c].dot)} aria-hidden />}
                    {CAT_LABEL[c]}
                  </span>
                  {cat === c && <span className="h-2 w-2 rounded-pill bg-brand" aria-hidden />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-line-2 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-1 font-[var(--font-weight-bold)] uppercase text-brand-text">국민대 공지</p>
                <h2 className="mt-1 text-6 font-[var(--font-weight-bold)] tracking-normal text-fg-1">
                  {filtered.length}개를 마감 가까운 순서로 보여줘요.
                </h2>
                <p className="mt-1 text-2 text-fg-3">
                  신청 가능성 높은 공고 {counts.fit}개, 지난 공고 {counts.closed}개
                </p>
              </div>

              <div className="flex border-b border-line-2">
                {(["list", "calendar"] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    aria-pressed={view === mode}
                    className={cn(
                      "inline-flex items-center gap-2 border-b-2 px-3 py-2 text-2 font-[var(--font-weight-medium)]",
                      view === mode ? "border-brand text-brand-text" : "border-transparent text-fg-3 hover:text-fg-1",
                    )}
                  >
                    {mode === "list" ? (
                      <ListFilter size={14} strokeWidth={1.75} aria-hidden />
                    ) : (
                      <CalendarDays size={14} strokeWidth={1.75} aria-hidden />
                    )}
                    {mode === "list" ? "일정표" : "캘린더"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <label className="flex items-center gap-2 border-b border-line-1 py-2 text-2 text-fg-3">
                <Search size={14} strokeWidth={1.75} aria-hidden />
                <input
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                  placeholder="장학, 비교과, 취업 공지 검색"
                  className="min-w-0 flex-1 bg-transparent text-fg-1 outline-none placeholder:text-fg-4"
                />
              </label>

              <div className="flex flex-wrap gap-1 lg:hidden">
                {CATS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cn(
                      "border-b-2 px-2 py-2 text-2 font-[var(--font-weight-medium)]",
                      cat === c ? "border-brand text-brand-text" : "border-transparent text-fg-3",
                    )}
                  >
                    {CAT_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatus(s.key)}
                  className={cn(
                    "border-b-2 px-2 py-2 text-2 font-[var(--font-weight-medium)]",
                    status === s.key ? "border-brand text-fg-1" : "border-transparent text-fg-3 hover:text-fg-1",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            {view === "list" ? (
              filtered.length > 0 ? (
                <div className="border-y border-line-1 bg-surface">
                  <div className="divide-y divide-line-2">
                    {filtered.map((notice) => (
                      <MvpAgendaRow
                        key={notice.id}
                        notice={notice}
                        status={statusMap[notice.id] ?? null}
                        onAddCalendar={() => downloadICS(notice)}
                        onSetStatus={(next) => setNoticeStatus(notice.id, next)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-y border-dashed border-line-1 bg-surface px-4 py-8 text-center text-2 text-fg-3">
                  조건에 맞는 공고가 없어요. 필터를 조금 넓혀볼까요?
                </div>
              )
            ) : (
              <CalendarMonth
                notices={filtered}
                onSelect={(notice) => window.open(notice.source_url, "_blank", "noopener,noreferrer")}
              />
            )}
          </div>
        </section>
      </div>

      <nav className="sticky bottom-0 z-20 border-t border-line-2 bg-surface px-4 py-2 sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {BOTTOM_NAV.map(([label, Icon], index) => (
            <button
              key={label}
              className={cn(
                "border-t-2 px-2 py-2 text-center text-1",
                index === 0 ? "border-brand text-brand-text" : "border-transparent text-fg-3",
              )}
            >
              <Icon className="mx-auto" size={15} strokeWidth={1.75} aria-hidden />
              <span className="mt-1 block">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

function MetricLine({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "brand" | "due";
}) {
  const toneClass =
    tone === "brand" ? "text-brand-text" : tone === "due" ? "text-due-soon-fg" : "text-fg-1";
  return (
    <div className="px-4 py-3">
      <p className="text-1 text-fg-3">{label}</p>
      <p className={cn("mt-1 text-7 font-[var(--font-weight-bold)] tracking-normal", toneClass)}>{value}</p>
    </div>
  );
}
