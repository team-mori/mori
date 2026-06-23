// MVP 화면 공용 헬퍼 — 파싱 공지(Notice) → D-day·필터 로직.
import type { Category, Notice } from "@/lib/types";

export type CatFilter = "all" | Category;
export type StatusFilter = "all" | "soon" | "open" | "closed";
export type ViewMode = "list" | "calendar";

export const CAT_META: Record<Category, { label: string; dot: string }> = {
  // 카테고리 색: 장학=브랜드 인디고 / 비교과=그린 / 취업=앰버 (빨강 금지)
  scholarship: { label: "장학", dot: "bg-brand" },
  extracurricular: { label: "비교과", dot: "bg-eligible-fg" },
  career: { label: "취업", dot: "bg-due-soon-fg" },
};

export type Urgency = "soon" | "near" | "far" | "past" | "none";

export type DdayInfo = { diff: number; label: string; urgency: Urgency };

// 마감일 → D-day. end_date 는 "YYYY-MM-DD" (로컬 자정 기준으로 정규화해 비교).
export function dDay(end: string | null): DdayInfo {
  if (!end) return { diff: NaN, label: "미정", urgency: "none" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(end);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  const label = diff === 0 ? "D-day" : diff > 0 ? `D-${diff}` : `D+${-diff}`;
  const urgency: Urgency = diff < 0 ? "past" : diff <= 3 ? "soon" : diff <= 7 ? "near" : "far";
  return { diff, label, urgency };
}

export function matchStatus(n: Notice, f: StatusFilter): boolean {
  if (f === "all") return true;
  const { diff } = dDay(n.end_date);
  if (Number.isNaN(diff)) return f === "open"; // 마감일 미정은 진행중으로 취급
  if (f === "soon") return diff >= 0 && diff <= 3;
  if (f === "open") return diff >= 0;
  return diff < 0; // closed
}

// 로컬 날짜 → "YYYY-MM-DD" (캘린더 셀 키. end_date 문자열과 직접 매칭)
export function localKey(y: number, m0: number, d: number): string {
  return `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
