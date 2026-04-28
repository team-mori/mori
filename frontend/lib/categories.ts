import type { Category } from "./types";

export const CATEGORY_LABEL: Record<Category, string> = {
  scholarship: "장학",
  extracurricular: "비교과",
  career: "취업",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  scholarship: "bg-blue-500 text-white",
  extracurricular: "bg-green-500 text-white",
  career: "bg-orange-500 text-white",
};

export function dDay(endDate: string | null): { label: string; color: string } {
  if (!endDate) return { label: "마감일 미정", color: "bg-slate-400 text-white" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000);
  const label = diff === 0 ? "D-day" : diff > 0 ? `D-${diff}` : `D+${-diff}`;
  let color = "bg-slate-400 text-white";
  if (diff < 0) color = "bg-slate-300 text-slate-600";
  else if (diff <= 3) color = "bg-red-500 text-white";
  else if (diff <= 7) color = "bg-amber-500 text-white";
  return { label, color };
}
