"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NoticeCard from "@/components/student/NoticeCard";
import RegretModal from "@/components/student/RegretModal";
import type { AppStatus, Category, Notice } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/categories";

const TABS: ({ key: "all" } | { key: Category })[] = [
  { key: "all" }, { key: "scholarship" }, { key: "extracurricular" }, { key: "career" },
];

function isPast(d: string | null) {
  if (!d) return false;
  const end = new Date(d);
  end.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return end.getTime() < today.getTime();
}

export default function StudentDemo() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, AppStatus>>({});
  const [tab, setTab] = useState<"all" | Category>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [showRegret, setShowRegret] = useState(false);

  useEffect(() => {
    fetch("/api/notices").then((r) => r.json()).then((d) => setNotices(d.notices ?? []));
    fetch("/api/status").then((r) => r.json()).then((d) => {
      const m: Record<string, AppStatus> = {};
      (d.statuses ?? []).forEach((s: any) => { m[s.notice_id] = s.status; });
      setStatusMap(m);
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => {
    let planning = 0, completed = 0, missed = 0;
    notices.forEach((n) => {
      const s = statusMap[n.id];
      if (s === "planning") planning++;
      if (s === "completed") completed++;
      if (isPast(n.end_date) && s !== "completed") missed++;
    });
    return { planning, completed, missed };
  }, [notices, statusMap]);

  const visible = useMemo(() => {
    const list = tab === "all" ? notices : notices.filter((n) => n.category === tab);
    return [...list].sort((a, b) => (a.end_date ?? "9999").localeCompare(b.end_date ?? "9999"));
  }, [notices, tab]);

  const missedNotices = useMemo(
    () => notices.filter((n) => isPast(n.end_date) && statusMap[n.id] !== "completed"),
    [notices, statusMap]
  );

  async function toggle(noticeId: string, next: AppStatus | null) {
    setStatusMap((prev) => {
      const copy = { ...prev };
      if (next === null) delete copy[noticeId];
      else copy[noticeId] = next;
      return copy;
    });
    await fetch("/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notice_id: noticeId, status: next }),
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand">모리</Link>
          <div className="h-9 w-9 rounded-full bg-brand-tint grid place-items-center text-brand font-bold">학</div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 mt-5">
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-xs text-slate-400">이번 학기 모리에서 챙긴 기회</p>
          <div className="mt-2 flex items-center gap-5 text-sm">
            <span><b className="text-brand text-xl text-amount">{counts.planning}</b> 신청 예정</span>
            <span><b className="text-eligible-fg text-xl text-amount">{counts.completed}</b> 신청 완료</span>
            <button onClick={() => setShowRegret(true)} className="text-left">
              <b className="text-ineligible-fg text-xl text-amount">{counts.missed}</b>
              <span className="text-ineligible-fg ml-1 underline">지나간 기회</span>
            </button>
          </div>
        </div>
      </section>

      <nav className="mx-auto max-w-3xl px-4 mt-5">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                tab === t.key
                  ? "bg-brand-deep text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}>
              {t.key === "all" ? "전체" : CATEGORY_LABEL[t.key as Category]}
            </button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-4 mt-4 mb-12 grid gap-4 sm:grid-cols-2">
        {visible.map((n) => (
          <NoticeCard
            key={n.id}
            notice={n}
            status={statusMap[n.id] ?? null}
            onToggleStatus={(s) => toggle(n.id, s)}
            onToast={(m) => setToast(m)}
          />
        ))}
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-[90%] text-center">
          {toast}
        </div>
      )}
      {showRegret && <RegretModal notices={missedNotices} onClose={() => setShowRegret(false)} />}
    </main>
  );
}
