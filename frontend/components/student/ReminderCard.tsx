"use client";

// v2 ReminderCard — 모리의 핵심 UI.
//
// v1 NoticeCard 와 차이:
//   - D-day 가 시각적 주인공 (대형 숫자, 좌상단)
//   - 자격 라벨 (fit/gap/unknown/unfit) 우상단
//   - 빨강 금지 — 임박 = amber, 미달 = 회색
//   - confidence < 0.8 시 "확인 필요" 라벨
//   - shadcn/ui 톤 (border 1px, 그림자 거의 없음)
//   - 모바일 우선, 360px 최소 폭에서도 정상 동작

import { Bell, BellOff, ExternalLink } from "lucide-react";
import type { ActionCard, MatchResult } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/categories";
import { cn } from "@/lib/utils";

type Props = {
  card: ActionCard;
  match: MatchResult;
  onApply: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
};

function dDay(deadline: string): { n: number; label: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);
  const n = Math.ceil((end.getTime() - today.getTime()) / 86400000);
  const label = n === 0 ? "오늘" : n > 0 ? `D-${n}` : `마감`;
  return { n, label };
}

const FIT_BADGE: Record<MatchResult["status"], { label: string; cls: string; icon: string }> = {
  fit: { label: "자격 충족", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "✓" },
  gap: { label: "일부 부족", cls: "bg-amber-50 text-amber-800 border-amber-200", icon: "!" },
  unknown: { label: "정보 입력 필요", cls: "bg-slate-50 text-slate-600 border-slate-200", icon: "?" },
  unfit: { label: "자격 미달", cls: "bg-zinc-100 text-zinc-500 border-zinc-200", icon: "—" },
};

export default function ReminderCard({ card, match, onApply, onSnooze, onDismiss }: Props) {
  const dd = dDay(card.deadline);
  const fit = FIT_BADGE[match.status];
  const lowConfidence = match.confidence < 0.8;
  const dimmed = match.status === "unfit" || dd.n < 0;

  // 좌측 띠: D-day ≤ 3 = amber, fit = emerald, 그 외 = none
  const stripe =
    dd.n >= 0 && dd.n <= 3
      ? "border-l-4 border-l-amber-400"
      : match.status === "fit"
      ? "border-l-4 border-l-emerald-500"
      : "border-l-4 border-l-transparent";

  return (
    <article
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-5 transition",
        "hover:-translate-y-0.5 hover:border-zinc-300",
        stripe,
        dimmed && "opacity-60",
        "dark:bg-zinc-900 dark:border-zinc-800",
      )}
      aria-label={`${CATEGORY_LABEL[card.category]} · ${card.title} · ${fit.label}`}
    >
      <header className="flex items-start justify-between gap-3">
        {/* D-day 주인공 — 좌상단 큰 숫자 */}
        <div className="flex flex-col">
          <span className={cn(
            "text-3xl font-bold leading-none tabular-nums",
            dd.n < 0 ? "text-zinc-400" : dd.n <= 3 ? "text-amber-600" : "text-zinc-800 dark:text-zinc-100",
          )}>
            {dd.n < 0 ? "마감" : dd.n === 0 ? "오늘" : `D-${dd.n}`}
          </span>
          <span className="mt-1 text-xs text-zinc-500">{card.deadline}</span>
        </div>

        {/* 자격 라벨 + confidence */}
        <div className="flex flex-col items-end gap-1">
          <span className={cn("text-xs font-medium border rounded-full px-2 py-0.5", fit.cls)}>
            <span className="mr-1">{fit.icon}</span>
            {fit.label}
            {match.status === "gap" && match.missing.length > 0 && ` · ${match.missing.length}`}
          </span>
          {lowConfidence && (
            <span className="text-[10px] text-zinc-500" title="자동 판정 신뢰도가 낮아요">
              ⓘ 확인 필요
            </span>
          )}
        </div>
      </header>

      {/* 카테고리 + 제목 */}
      <div className="mt-4">
        <span className="text-[11px] font-medium text-zinc-500">
          {CATEGORY_LABEL[card.category]}
        </span>
        <h3 className="mt-1 text-base font-semibold text-zinc-900 leading-snug dark:text-zinc-100">
          {card.title}
        </h3>
      </div>

      {/* 핵심 혜택 */}
      <p className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {card.benefit.type === "money" && card.benefit.amount
          ? `${(card.benefit.amount / 10000).toLocaleString()}만원`
          : card.benefit.type === "credit" && card.benefit.amount
          ? `${card.benefit.amount}학점`
          : card.benefit.description || "혜택 정보"}
      </p>

      {/* gap 상태일 때 부족 요건 미리보기 */}
      {match.status === "gap" && match.missing.length > 0 && (
        <details className="mt-3">
          <summary className="text-xs text-amber-700 cursor-pointer">
            부족한 요건 보기 ({match.missing.length}개)
          </summary>
          <ul className="mt-2 space-y-1 text-xs text-zinc-600">
            {match.missing.slice(0, 2).map((m, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-500">·</span>
                <span>{m.gap}</span>
              </li>
            ))}
            {match.missing.length > 2 && (
              <li className="text-zinc-400">… 외 {match.missing.length - 2}개</li>
            )}
          </ul>
        </details>
      )}

      {/* 액션 버튼 */}
      <footer className="mt-4 flex items-center gap-2">
        <button
          onClick={onApply}
          disabled={dimmed}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition",
            dimmed
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900",
          )}
        >
          <ExternalLink size={14} aria-hidden /> 신청하러 가기
        </button>
        <button
          onClick={onSnooze}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="3일 뒤 알림"
        >
          <Bell size={14} aria-hidden /> 3일 뒤
        </button>
        <button
          onClick={onDismiss}
          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          aria-label="숨기기"
        >
          <BellOff size={14} aria-hidden />
        </button>
      </footer>
    </article>
  );
}
