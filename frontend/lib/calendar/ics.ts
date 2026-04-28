// .ics 생성 — RFC 5545. ActionCard 기준.
// 시간대 Asia/Seoul 고정. 알림 4단계 (7d/3d/1d/당일).

import type { ActionCard } from "../types";
import { CATEGORY_LABEL } from "../categories";

const PRODID = "-//mori//action-card//KO";

function fmtDate(iso: string): string {
  return iso.replaceAll("-", "");
}

function fmtDateTimeUTC(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replaceAll(/[-:]/g, "").split(".")[0] + "Z";
}

function escape(s: string): string {
  return s
    .replaceAll("\\", "\\\\")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;")
    .replaceAll("\n", "\\n");
}

function fold(line: string): string {
  // RFC 5545: 75 octets 초과 시 CRLF + space 로 접기
  if (line.length <= 75) return line;
  const out: string[] = [];
  let rest = line;
  out.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    out.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  return out.join("\r\n");
}

function eventBlock(card: ActionCard): string[] {
  const deadline = card.deadline; // YYYY-MM-DD
  // 24시간 전 시작, 마감 시점 종료
  const startDt = new Date(deadline + "T00:00:00+09:00");
  startDt.setDate(startDt.getDate() - 1);
  const endDt = new Date(deadline + "T23:59:00+09:00");

  const summary = `[모리] ${CATEGORY_LABEL[card.category]} · ${card.title}`;
  const desc = [
    card.benefit.description || (card.benefit.amount ? `${card.benefit.amount.toLocaleString()}원` : ""),
    `신청: ${card.applyUrl}`,
    card.eligibility.length > 0
      ? `자격: ${card.eligibility.slice(0, 3).map((e) => e.raw).join(" / ")}`
      : "",
  ].filter(Boolean).join("\\n");

  const lines = [
    "BEGIN:VEVENT",
    `UID:${card.id}@mori.app`,
    `DTSTAMP:${fmtDateTimeUTC(new Date().toISOString())}`,
    `DTSTART:${fmtDateTimeUTC(startDt.toISOString())}`,
    `DTEND:${fmtDateTimeUTC(endDt.toISOString())}`,
    `SUMMARY:${escape(summary)}`,
    `DESCRIPTION:${escape(desc)}`,
    `LOCATION:${escape(card.applyUrl)}`,
    `URL:${card.applyUrl}`,
  ];
  // 알림 4단계
  for (const days of [7, 3, 1, 0]) {
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escape(card.title)}`,
      `TRIGGER:-PT${days * 24}H`,
      "END:VALARM",
    );
  }
  lines.push("END:VEVENT");
  return lines.map(fold);
}

export function generateIcs(card: ActionCard): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:Asia/Seoul",
    ...eventBlock(card),
    "END:VCALENDAR",
  ].join("\r\n");
}

export function generateIcsBatch(cards: ActionCard[]): string {
  const events = cards.flatMap(eventBlock);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:Asia/Seoul",
    "X-WR-CALNAME:모리 — 신청 예정",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

// RFC 5545 valid 검증 — 데모용 minimal sanity check.
export function validateIcs(ics: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!ics.startsWith("BEGIN:VCALENDAR")) errors.push("missing BEGIN:VCALENDAR");
  if (!ics.endsWith("END:VCALENDAR")) errors.push("missing END:VCALENDAR");
  if (!ics.includes("VERSION:2.0")) errors.push("missing VERSION:2.0");
  if (!ics.includes("PRODID:")) errors.push("missing PRODID");
  // VEVENT 균형
  const beginCount = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
  const endCount = (ics.match(/END:VEVENT/g) ?? []).length;
  if (beginCount !== endCount) errors.push(`VEVENT begin/end mismatch ${beginCount}/${endCount}`);
  if (beginCount === 0) errors.push("no VEVENT");
  return { valid: errors.length === 0, errors };
}
