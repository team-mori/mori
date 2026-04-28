import type { Notice } from "./types";

function fmtDate(d: string): string {
  return d.replaceAll("-", "");
}

function escape(s: string): string {
  return s.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
}

export function buildICS(n: Notice): string {
  const start = n.start_date ?? n.end_date ?? new Date().toISOString().slice(0, 10);
  const end = n.end_date ?? start;
  const endNext = new Date(end);
  endNext.setDate(endNext.getDate() + 1); // 종일 이벤트는 DTEND가 다음날
  const endStr = endNext.toISOString().slice(0, 10);
  const uid = `${n.id}@mori.app`;
  const dtstamp = new Date().toISOString().replaceAll(/[-:]/g, "").split(".")[0] + "Z";
  const desc = [n.summary, n.target ? `대상: ${n.target}` : "", n.source_url].filter(Boolean).join("\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//mori//demo//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${fmtDate(start)}`,
    `DTEND;VALUE=DATE:${fmtDate(endStr)}`,
    `SUMMARY:${escape(n.title)}`,
    `DESCRIPTION:${escape(desc)}`,
    `URL:${n.source_url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
