// 통합 인터페이스 — 호출자는 이 파일만 import.

export { generateIcs, generateIcsBatch, validateIcs } from "./ics";
export {
  addToGoogleCalendar,
  refreshAccessToken,
  TokenExpiredError,
  type GoogleAddResult,
} from "./google";

import type { ActionCard } from "../types";
import { addToGoogleCalendar, TokenExpiredError } from "./google";
import { generateIcs } from "./ics";

export type SyncResult =
  | { method: "google"; eventId: string }
  | { method: "ics"; ics: string };

/** Google 우선, 실패 시 .ics fallback. */
export async function syncToCalendar(
  card: ActionCard,
  accessToken: string | null,
): Promise<SyncResult> {
  if (!accessToken) {
    return { method: "ics", ics: generateIcs(card) };
  }
  try {
    const r = await addToGoogleCalendar(card, accessToken);
    return { method: "google", eventId: r.eventId };
  } catch (e) {
    if (e instanceof TokenExpiredError) throw e; // 호출자가 refresh 처리
    console.warn("[calendar] Google 실패, .ics fallback:", e);
    return { method: "ics", ics: generateIcs(card) };
  }
}
