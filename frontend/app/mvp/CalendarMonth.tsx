"use client";

// CalendarMonth — 공지를 마감일(end_date) 기준으로 월 달력에 배치.
// 카테고리 색 점 + 제목으로 표시. 오늘 강조, 지난 날짜 흐리게. 빨강 금지.

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Notice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CAT_META, localKey } from "./shared";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type Props = {
  notices: Notice[];
  onSelect: (n: Notice) => void;
};

export default function CalendarMonth({ notices, onSelect }: Props) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const byDate = useMemo(() => {
    const map = new Map<string, Notice[]>();
    for (const n of notices) {
      if (!n.end_date) continue;
      const arr = map.get(n.end_date) ?? [];
      arr.push(n);
      map.set(n.end_date, arr);
    }
    return map;
  }, [notices]);

  // 6주 × 7일 그리드 (해당 월 1일이 속한 주의 일요일부터)
  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const start = new Date(cursor.y, cursor.m, 1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const todayKey = localKey(today.getFullYear(), today.getMonth(), today.getDate());
  const monthLabel = `${cursor.y}년 ${cursor.m + 1}월`;
  const shift = (delta: number) => {
    const m = cursor.m + delta;
    setCursor({ y: cursor.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 });
  };

  return (
    <div className="rounded-2xl border border-line-1 bg-surface p-4 shadow-flat sm:p-5">
      {/* 월 네비 + 범례 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => shift(-1)}
            aria-label="이전 달"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line-1 text-fg-2 transition-colors hover:bg-sunken"
          >
            <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
          </button>
          <span className="min-w-[7.5rem] text-center text-[15px] font-medium text-fg-1">{monthLabel}</span>
          <button
            onClick={() => shift(1)}
            aria-label="다음 달"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line-1 text-fg-2 transition-colors hover:bg-sunken"
          >
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            onClick={() => setCursor({ y: today.getFullYear(), m: today.getMonth() })}
            className="ml-1 rounded-md border border-line-1 px-2.5 py-1 text-[12px] font-medium text-fg-2 transition-colors hover:bg-sunken"
          >
            오늘
          </button>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-fg-3">
          {(Object.keys(CAT_META) as (keyof typeof CAT_META)[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", CAT_META[k].dot)} aria-hidden />
              {CAT_META[k].label}
            </span>
          ))}
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-line-2 pb-2 text-center text-[12px] font-medium text-fg-3">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const key = localKey(d.getFullYear(), d.getMonth(), d.getDate());
          const inMonth = d.getMonth() === cursor.m;
          const isToday = key === todayKey;
          const isPast = d.getTime() < today.getTime();
          const items = byDate.get(key) ?? [];
          return (
            <div
              key={i}
              className={cn(
                "min-h-[84px] border-b border-r border-line-2 p-1.5 sm:min-h-[96px]",
                i % 7 === 0 && "border-l",
                i < 7 && "border-t",
                !inMonth && "bg-page",
              )}
            >
              <div
                className={cn(
                  "mb-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1 text-[12px] tabular-nums",
                  isToday ? "bg-brand font-semibold text-fg-on-brand" : "text-fg-2",
                  !inMonth && "text-fg-4",
                  isPast && !isToday && "text-fg-4",
                )}
              >
                {d.getDate()}
              </div>
              <div className="flex flex-col gap-0.5">
                {items.slice(0, 3).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onSelect(n)}
                    title={n.title}
                    className={cn(
                      "flex items-center gap-1 rounded px-1 py-0.5 text-left text-[11px] leading-tight transition-colors hover:bg-sunken",
                      isPast ? "text-fg-4" : "text-fg-2",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", CAT_META[n.category].dot)} aria-hidden />
                    <span className="truncate">{n.title}</span>
                  </button>
                ))}
                {items.length > 3 && (
                  <span className="px-1 text-[11px] text-fg-4">+{items.length - 3}건</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
