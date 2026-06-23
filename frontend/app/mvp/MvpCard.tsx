"use client";

import {
  AlertCircle,
  CalendarPlus,
  CheckCircle2,
  ExternalLink,
  FileText,
  ShieldCheck,
} from "lucide-react";
import type { AppStatus, Notice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CAT_META, dDay } from "./shared";

type Props = {
  notice: Notice;
  status: AppStatus | null;
  onAddCalendar: () => void;
  onSetStatus: (next: AppStatus | null) => void;
};

function benefitLabel(notice: Notice): string {
  const text = `${notice.title} ${notice.summary ?? ""}`;
  const money = text.match(/(\d+\s*만\s*원|\d+\s*만원|\d+\s*원|상금\s*\d+\s*만\s*원)/);
  if (money) return money[0].replace(/\s+/g, " ");
  if (notice.category === "scholarship") return "장학 혜택";
  if (notice.category === "extracurricular") return "비교과 기회";
  return "커리어 기회";
}

function fitCopy(notice: Notice): string {
  if (!notice.llm_processed) return "정보 1개만 더 확인하면 정확도가 올라가요.";
  if (notice.category === "career") return "학년과 관심 직무 기준으로 확인했어요.";
  if (notice.category === "extracurricular") return "관심 카테고리와 신청 대상이 맞아요.";
  return "내 정보와 주요 조건이 맞아요.";
}

function dateLabel(date: string | null): string {
  if (!date) return "마감일 미정";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "마감일 미정";
  return `${d.getMonth() + 1}/${d.getDate()} 마감`;
}

function statusTone(notice: Notice): {
  label: string;
  className: string;
  Icon: typeof CheckCircle2;
} {
  if (!notice.llm_processed) {
    return {
      label: "확인 필요",
      className: "border-due-soon-line bg-due-soon-bg text-due-soon-fg",
      Icon: AlertCircle,
    };
  }
  if (notice.category === "career") {
    return {
      label: "조건 확인",
      className: "border-brand-line bg-brand-tint text-brand-text",
      Icon: ShieldCheck,
    };
  }
  return {
    label: "자격 충족",
    className: "border-eligible-line bg-eligible-bg text-eligible-fg",
    Icon: CheckCircle2,
  };
}

export default function MvpAgendaRow({ notice, status, onAddCalendar, onSetStatus }: Props) {
  const dd = dDay(notice.end_date);
  const past = dd.urgency === "past";
  const tone = statusTone(notice);
  const StatusIcon = tone.Icon;

  return (
    <article
      className={cn(
        "grid min-w-0 grid-cols-[var(--space-8)_minmax(0,1fr)] gap-x-4 gap-y-3 px-4 py-4 transition-colors hover:bg-sunken md:grid-cols-[calc(var(--space-9)*1.25)_minmax(0,1fr)_calc(var(--space-9)*2.5)] md:items-start md:py-5",
        past && "opacity-60",
      )}
    >
      <div className="row-span-2 flex flex-col items-start gap-2 border-r border-line-2 pr-3 md:row-span-1 md:block md:pr-4">
        <div>
          <p
            className={cn(
              "font-num text-5 font-[var(--font-weight-bold)] tracking-normal md:text-6",
              dd.urgency === "soon"
                ? "text-due-soon-fg"
                : dd.urgency === "past"
                  ? "text-fg-4"
                  : "text-brand-text",
            )}
          >
            {dd.label}
          </p>
          <p className="mt-1 text-1 text-fg-3">{dateLabel(notice.end_date)}</p>
        </div>
        <span className={cn("h-2 w-2 rounded-pill md:mt-4 md:block", CAT_META[notice.category].dot)} aria-hidden />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-1 font-[var(--font-weight-bold)] uppercase text-fg-3">
            {CAT_META[notice.category].label}
          </span>
          <span className={cn("inline-flex items-center gap-1 rounded-pill border px-2 py-1 text-1 font-[var(--font-weight-medium)]", tone.className)}>
            <StatusIcon size={12} strokeWidth={1.75} aria-hidden />
            {tone.label}
          </span>
          {status && (
            <span className="rounded-pill bg-sunken px-2 py-1 text-1 font-[var(--font-weight-medium)] text-fg-2">
              {status === "planning" ? "예정 저장" : "신청 완료"}
            </span>
          )}
        </div>

        <p className="mt-2 text-6 font-[var(--font-weight-bold)] tracking-normal text-fg-1">
          {benefitLabel(notice)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-3 font-[var(--font-weight-medium)] tracking-normal text-fg-1">
          {notice.title}
        </h3>
        <p className="mt-2 text-2 text-fg-2">{fitCopy(notice)}</p>

        {(notice.target || notice.source_board) && (
          <p className="mt-2 truncate text-2 text-fg-3">
            {notice.target}
            {notice.target && notice.source_board ? " · " : ""}
            {notice.source_board}
          </p>
        )}

        {notice.documents.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {notice.documents.slice(0, 3).map((doc) => (
              <span key={doc} className="inline-flex items-center gap-1 text-1 text-fg-3">
                <FileText size={11} strokeWidth={1.75} aria-hidden />
                {doc}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="col-start-2 flex flex-wrap items-center gap-2 md:col-start-auto md:justify-end">
        <button
          onClick={onAddCalendar}
          disabled={past}
          className="inline-flex items-center justify-center gap-1 rounded-3 border border-line-1 bg-surface px-3 py-2 text-2 font-[var(--font-weight-medium)] text-fg-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarPlus size={14} strokeWidth={1.75} aria-hidden />
          캘린더
        </button>
        <button
          onClick={() => onSetStatus(status === "planning" ? null : "planning")}
          disabled={past}
          className={cn(
            "inline-flex items-center justify-center gap-1 rounded-3 px-3 py-2 text-2 font-[var(--font-weight-bold)] disabled:cursor-not-allowed disabled:opacity-50",
            status === "planning"
              ? "border border-brand-line bg-brand-tint text-brand-text"
              : "bg-brand text-fg-on-brand",
          )}
        >
          <CheckCircle2 size={14} strokeWidth={1.75} aria-hidden />
          {status === "planning" ? "예정됨" : "예정"}
        </button>
        <button
          onClick={() => onSetStatus(status === "completed" ? null : "completed")}
          className="inline-flex items-center justify-center rounded-3 px-2 py-2 text-1 font-[var(--font-weight-medium)] text-fg-3 hover:text-fg-1"
        >
          {status === "completed" ? "완료됨" : "완료"}
        </button>
        <a
          href={notice.source_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-3 px-2 py-2 text-1 font-[var(--font-weight-medium)] text-brand-text hover:underline"
        >
          원문
          <ExternalLink size={12} strokeWidth={1.75} aria-hidden />
        </a>
      </div>
    </article>
  );
}
