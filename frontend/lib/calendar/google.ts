// Google Calendar API 통합 — OAuth 2.0.
//
// 운영에 필요한 사전 작업 (이 코드에서는 다루지 않음, 별도 문서):
//   1) Google Cloud Console 에서 OAuth 클라이언트 생성, scope:
//      https://www.googleapis.com/auth/calendar.events
//   2) NextAuth (또는 자체 OAuth 라우트) 로 학생 1회 동의 → refresh_token Supabase 저장
//   3) 서버에서 refresh_token 으로 access_token 갱신 후 이 모듈 호출
//
// API 호출 실패 시 호출자가 .ics fallback 으로 자동 전환할 것.

import type { ActionCard } from "../types";
import { CATEGORY_LABEL } from "../categories";

export type GoogleAddResult = { eventId: string };

export async function addToGoogleCalendar(
  card: ActionCard,
  accessToken: string,
): Promise<GoogleAddResult> {
  const startDt = new Date(card.deadline + "T00:00:00+09:00");
  startDt.setDate(startDt.getDate() - 1);
  const endDt = new Date(card.deadline + "T23:59:00+09:00");

  const event = {
    summary: `[모리] ${CATEGORY_LABEL[card.category]} · ${card.title}`,
    description: [
      card.benefit.description,
      `신청: ${card.applyUrl}`,
      card.eligibility.length > 0
        ? `자격: ${card.eligibility.slice(0, 3).map((e) => e.raw).join(" / ")}`
        : "",
    ].filter(Boolean).join("\n"),
    location: card.applyUrl,
    start: { dateTime: startDt.toISOString(), timeZone: "Asia/Seoul" },
    end: { dateTime: endDt.toISOString(), timeZone: "Asia/Seoul" },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 7 * 24 * 60 },
        { method: "popup", minutes: 3 * 24 * 60 },
        { method: "popup", minutes: 1 * 24 * 60 },
        { method: "popup", minutes: 0 },
      ],
    },
  };

  const r = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    },
  );
  if (r.status === 401) {
    throw new TokenExpiredError("access_token 만료 — 재갱신 필요");
  }
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`Google Calendar API ${r.status}: ${body}`);
  }
  const data = (await r.json()) as { id: string };
  return { eventId: data.id };
}

export class TokenExpiredError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "TokenExpiredError";
  }
}

/** refresh_token 으로 새 access_token 발급 — 호출자가 갱신 실패 시 재인증 유도. */
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET 환경변수 없음");
  }
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!r.ok) throw new Error(`refresh fail ${r.status}: ${await r.text()}`);
  const body = (await r.json()) as { access_token: string };
  return body.access_token;
}
