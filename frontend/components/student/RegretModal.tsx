"use client";

// RegretModal — Claude Design 가이드: 빨강 절대 금지, "지나간 기회"는 차분한 grey + clock.
// 카피: "놓쳤어요" → "지나갔어요" / 다음 학기 다시 열려요.

import { Clock3, X } from "lucide-react";
import type { Notice } from "@/lib/types";

function extractAmount(text: string): number {
  const m1 = text.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*만\s*원/);
  if (m1) return parseInt(m1[1].replaceAll(",", ""), 10) * 10000;
  const m2 = text.match(/(\d{1,3}(?:,\d{3})+)\s*원/);
  if (m2) return parseInt(m2[1].replaceAll(",", ""), 10);
  return 0;
}

export default function RegretModal({
  notices,
  onClose,
}: {
  notices: Notice[];
  onClose: () => void;
}) {
  let totalAmount = 0;
  notices.forEach((n) => {
    if (n.category === "scholarship") {
      totalAmount += extractAmount((n.title ?? "") + " " + (n.summary ?? ""));
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15, 23, 42, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-paper-0 rounded-[16px] shadow-pop max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line-2">
          <h2 className="font-bold text-lg text-ink-800">지나간 기회 {notices.length}건</h2>
          <button onClick={onClose} className="text-fg-4 hover:text-ink-800" aria-label="닫기">
            <X size={20}/>
          </button>
        </div>

        {/* 합계 — 빨강 대신 ineligible-bg + ineligible-fg, clock 아이콘 */}
        <div className="px-5 py-4 bg-ineligible-bg border-b border-line-2 flex items-center gap-3">
          <Clock3 size={20} strokeWidth={1.75} className="text-ineligible-fg" aria-hidden />
          <div>
            <p className="text-sm text-ineligible-fg">지나간 장학금 합계</p>
            <p className="text-2xl font-bold text-ink-800 mt-0.5 text-amount">
              약 {totalAmount > 0 ? `${(totalAmount / 10000).toLocaleString()}만 원` : "금액 정보 없음"}
            </p>
          </div>
        </div>

        <div className="overflow-auto flex-1 divide-y divide-line-2">
          {notices.map((n) => (
            <div key={n.id} className="px-5 py-4">
              <p className="text-eyebrow text-fg-4">
                마감 {n.end_date} · {n.source_board}
              </p>
              <p className="font-semibold text-ink-800 mt-1.5">{n.summary || n.title}</p>
              <a href={n.source_url} target="_blank" rel="noopener" className="text-xs text-brand underline mt-1.5 inline-block">
                원문 보기
              </a>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="p-8 text-center text-fg-4 text-sm">지나간 기회가 없어요.</div>
          )}
        </div>

        <p className="px-5 py-3 text-xs text-fg-3 border-t border-line-2 bg-paper-50">
          이번에는 지나갔어요. 비슷한 공지가 다음 학기에 다시 열리면 알려드릴게요.
        </p>
      </div>
    </div>
  );
}
