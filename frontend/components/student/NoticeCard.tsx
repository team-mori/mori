"use client";

import { Calendar, Check, ExternalLink, CircleDashed } from "lucide-react";
import type { Notice, AppStatus } from "@/lib/types";
import { CATEGORY_COLOR, CATEGORY_LABEL, dDay } from "@/lib/categories";

type Props = {
  notice: Notice;
  status: AppStatus | null;
  onToggleStatus: (next: AppStatus | null) => void;
  onToast: (msg: string) => void;
};

export default function NoticeCard({ notice, status, onToggleStatus, onToast }: Props) {
  if (!notice.llm_processed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 animate-pulse">
        <div className="flex justify-between mb-3">
          <span className="h-5 w-14 rounded-full bg-slate-200" />
          <span className="h-5 w-12 rounded-full bg-slate-200" />
        </div>
        <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <p className="mt-4 text-xs text-slate-500">AI 변환 대기 중…</p>
      </div>
    );
  }

  const dd = dDay(notice.end_date);
  const period =
    notice.start_date && notice.end_date
      ? `${notice.start_date} ~ ${notice.end_date}`
      : notice.end_date ?? "기간 미정";

  function nextStatus(): AppStatus | null {
    if (status === null) return "planning";
    if (status === "planning") return "completed";
    return null;
  }

  function downloadICS() {
    window.location.href = `/api/notices/${notice.id}/ics`;
    onToast("캘린더 파일이 다운로드되었습니다. Google·Apple·Samsung 캘린더에서 열기 가능");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLOR[notice.category]}`}>
          {CATEGORY_LABEL[notice.category]}
        </span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${dd.color}`}>{dd.label}</span>
      </div>

      <h3 className="text-base font-bold text-slate-900 leading-snug">
        {notice.summary || notice.title}
      </h3>

      <dl className="mt-3 space-y-1 text-sm text-slate-600">
        <div className="flex"><dt className="w-20 shrink-0 text-slate-400">지원대상</dt><dd>{notice.target ?? "-"}</dd></div>
        <div className="flex"><dt className="w-20 shrink-0 text-slate-400">신청기간</dt><dd>{period}</dd></div>
        <div className="flex">
          <dt className="w-20 shrink-0 text-slate-400">제출서류</dt>
          <dd>
            {notice.documents.length === 0 ? "-" : (
              <ul className="list-disc pl-4">
                {notice.documents.slice(0, 3).map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            )}
          </dd>
        </div>
        <div className="flex">
          <dt className="w-20 shrink-0 text-slate-400">원문</dt>
          <dd><a href={notice.source_url} target="_blank" className="text-brand underline">바로가기</a></dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        <button onClick={downloadICS}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Calendar size={14} /> 캘린더 추가
        </button>
        <button onClick={() => onToggleStatus(nextStatus())}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold ${
            status === "completed" ? "bg-eligible-fg text-white" :
            status === "planning" ? "bg-brand-tint text-brand" :
            "border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}>
          {status === "completed" ? <><Check size={14}/> 완료</> :
           status === "planning" ? <><CircleDashed size={14}/> 예정</> :
           <><Check size={14}/> 신청 예정</>}
        </button>
        <a href={notice.source_url} target="_blank"
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <ExternalLink size={14}/> 원문
        </a>
      </div>
    </div>
  );
}
