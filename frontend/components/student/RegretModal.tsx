"use client";

import { X } from "lucide-react";
import type { Notice } from "@/lib/types";

function extractAmount(text: string): number {
  // 본문에서 "30만 원", "500만원", "1,000,000원" 같은 패턴 1차 시도
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-bold text-lg">놓친 기회 {notices.length}건</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
        </div>
        <div className="px-5 py-4 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-700">놓친 장학금 합계</p>
          <p className="text-2xl font-bold text-red-600">
            약 {totalAmount > 0 ? `${(totalAmount / 10000).toLocaleString()}만 원` : "금액 정보 없음"}
          </p>
        </div>
        <div className="overflow-auto flex-1 divide-y">
          {notices.map((n) => (
            <div key={n.id} className="px-5 py-4">
              <p className="text-xs text-slate-400">마감 {n.end_date} · {n.source_board}</p>
              <p className="font-semibold text-slate-800 mt-1">{n.summary || n.title}</p>
              <a href={n.source_url} target="_blank" className="text-xs text-emerald-700 underline mt-1 inline-block">
                원문 보기
              </a>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">놓친 기회가 없어요.</div>
          )}
        </div>
      </div>
    </div>
  );
}
