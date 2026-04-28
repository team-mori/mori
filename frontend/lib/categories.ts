// Claude Design 가이드: 빨강 절대 금지.
// D-day 색상 시스템:
//   D-3 이하   → due-soon (amber)        "마감 임박"
//   D-4~7      → brand    (midnight)
//   D-8 이상   → ink-800
//   지난 항목  → ineligible (grey)        "지나갔어요" / 절대 빨강 아님
import type { Category } from "./types";

export const CATEGORY_LABEL: Record<Category, string> = {
  scholarship: "장학",
  extracurricular: "비교과",
  career: "취업",
};

// 카테고리 배지 — 디자인 시스템상 단색 강조 대신 카테고리는 라벨로 처리하지만,
// v1 demo의 NoticeCard는 색 라벨을 쓰므로 brand-tint 톤으로 통일.
export const CATEGORY_COLOR: Record<Category, string> = {
  scholarship: "bg-state-new-bg text-state-new-fg",
  extracurricular: "bg-eligible-bg text-eligible-fg",
  career: "bg-due-soon-bg text-due-soon-fg",
};

export function dDay(endDate: string | null): { label: string; color: string } {
  if (!endDate) return { label: "마감일 미정", color: "bg-ineligible-bg text-ineligible-fg" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000);
  const label = diff === 0 ? "D-day" : diff > 0 ? `D-${diff}` : `지나감`;
  // 빨강 금지 — 임박은 amber, 지난 것은 grey.
  let color = "bg-ink-100 text-ink-800";
  if (diff < 0) color = "bg-ineligible-bg text-ineligible-fg";
  else if (diff <= 3) color = "bg-due-soon-bg text-due-soon-fg";
  else if (diff <= 7) color = "bg-brand-tint text-brand";
  return { label, color };
}
