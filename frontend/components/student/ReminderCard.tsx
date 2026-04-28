"use client";

// ReminderCard — Claude Design handoff 디자인 그대로 구현.
//
// 계층:
//   1) 카테고리 eyebrow + D-day 대형 숫자 (Inter 52px tabular-nums) | 우측: 캘린더 추가 원형 버튼
//   2) 제목 (2줄 clamp — 카드 높이 일관성)
//   3) 타깃 + EligibilityBadge (compact, 한 줄, 줄바꿈 금지)
//   4) 금액 (점선 구분선 위, Inter, 인라인)
//   5) 하단 단일 primary CTA (mt-auto 로 카드 하단에 고정)
//
// 빨강 절대 금지. D-day 색상: D-3 이하 amber, D-7 이하 brand-indigo, 그 외 fg-1.
// 마감 지난 카드는 PastReminderCard 로 대체.

import { Calendar, Check, CheckCircle2, Clock3, Plus } from "lucide-react";
import type { ActionCard, MatchResult } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/categories";
import EligibilityBadge, { statusToState } from "./EligibilityBadge";
import { cn } from "@/lib/utils";

type Status = "planning" | "completed" | null;

type Props = {
  card: ActionCard;
  match: MatchResult;
  status?: Status;
  target?: string;
  onApply: () => void;
  onAddCalendar?: () => void;
};

function dDay(deadline: string): { diff: number; label: string } {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(deadline); end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000);
  const label = diff === 0 ? "D-day" : diff > 0 ? `D-${diff}` : `D+${-diff}`;
  return { diff, label };
}

export default function ReminderCard({
  card,
  match,
  status = null,
  target = "재학생",
  onApply,
  onAddCalendar = () => {},
}: Props) {
  const dd = dDay(card.deadline);
  if (dd.diff < 0) return <PastReminderCard card={card} diff={dd.diff} />;

  const ddayColor =
    dd.diff <= 3 ? "text-due-soon-fg"
    : dd.diff <= 7 ? "text-brand"
    : "text-ink-800";

  const isCompleted = status === "completed";
  const isPlanning = status === "planning";
  const elig = statusToState(match.status);
  const amountValue =
    card.benefit.type === "money" && card.benefit.amount
      ? (card.benefit.amount / 10000).toLocaleString()
      : null;
  const amountUnit = card.benefit.type === "money" ? "만 원" : null;
  const amountLabel = card.benefit.description ||
    (card.benefit.type === "money" ? "지원 금액" :
     card.benefit.type === "credit" ? "학점" : "");

  return (
    <article
      className={cn(
        "flex flex-col gap-3.5 rounded-[16px] border border-line-1 bg-paper-0 p-[22px]",
        "shadow-flat transition-shadow transition-colors duration-[180ms] ease-out",
        "hover:shadow-lift-1 hover:border-line-strong",
      )}
    >
      {/* 1. eyebrow + D-day | 캘린더 버튼 */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="text-eyebrow text-fg-3 mb-1.5">
            {CATEGORY_LABEL[card.category]}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn("text-dday", ddayColor)} style={{ fontSize: 52 }}>
              {dd.label}
            </span>
            {dd.diff <= 3 && (
              <span className="text-eyebrow text-due-soon-fg ml-1">
                마감 임박
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onAddCalendar}
          aria-label="캘린더에 추가"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-1 bg-paper-0 text-fg-2 hover:bg-ink-100 transition-colors"
        >
          <Calendar size={16} strokeWidth={1.75} aria-hidden />
        </button>
      </header>

      {/* 2. 제목 — 2줄 clamp */}
      <h3
        className="font-semibold text-ink-800 m-0 -tracking-[0.01em]"
        style={{
          fontSize: 17,
          lineHeight: 1.4,
          minHeight: "calc(17px * 1.4 * 2)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {card.title}
      </h3>

      {/* 3. 타깃 + 자격 라벨 (한 줄) */}
      <div className="flex items-center gap-2.5 text-[13px] text-fg-3 whitespace-nowrap overflow-hidden">
        <span className="inline-flex items-center gap-1.5 min-w-0 overflow-hidden text-ellipsis">
          {target}
        </span>
        <span className="h-[3px] w-[3px] rounded-full bg-line-strong shrink-0" />
        <span className="shrink-0">
          <EligibilityBadge state={elig} compact />
        </span>
      </div>

      {/* 4. 금액 — 점선 구분선 위, 인라인 */}
      <div
        className="flex items-baseline justify-between gap-2.5 pt-3.5 border-t border-dashed border-line-2"
        style={{ minHeight: 32 }}
      >
        <span className="text-[13px] text-fg-3">{amountLabel}</span>
        {amountValue && (
          <span className="inline-flex items-baseline gap-0.5">
            <span className="text-amount text-ink-800" style={{ fontSize: 24 }}>
              {amountValue}
            </span>
            {amountUnit && (
              <span className="text-sm font-semibold text-fg-2 ml-0.5">{amountUnit}</span>
            )}
          </span>
        )}
      </div>

      {/* 5. Primary CTA */}
      <button
        onClick={onApply}
        className={cn(
          "mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-3 text-sm font-semibold transition-colors",
          isCompleted
            ? "bg-eligible-bg text-eligible-fg border-transparent"
            : isPlanning
            ? "bg-paper-50 text-ink-800 border-line-1"
            : "bg-brand-deep text-white border-transparent hover:bg-ink-950",
        )}
      >
        {isCompleted
          ? <><CheckCircle2 size={15} strokeWidth={2} aria-hidden /> 신청 완료됨</>
          : isPlanning
          ? <><Check size={15} strokeWidth={2} aria-hidden /> 신청 예정 — 완료로 표시</>
          : <><Plus size={15} strokeWidth={2} aria-hidden /> 신청 예정으로 표시</>}
      </button>
    </article>
  );
}

// 지나간 기회 — 점선 테두리, 시계 아이콘, 작게.
function PastReminderCard({ card, diff }: { card: ActionCard; diff: number }) {
  return (
    <article className="flex items-center gap-3.5 rounded-[16px] border border-dashed border-line-1 bg-transparent px-4.5 py-3.5 opacity-85">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-50 text-fg-3">
        <Clock3 size={18} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-eyebrow text-fg-4 mb-0.5">
          {CATEGORY_LABEL[card.category]} · {-diff}일 지남
        </div>
        <h3 className="m-0 text-sm font-semibold text-fg-2 leading-snug truncate">
          {card.title}
        </h3>
      </div>
      <span className="text-xs text-fg-3 whitespace-nowrap">다음 학기 다시 알림</span>
    </article>
  );
}
