// 하이브리드 파서 — 룰베이스 우선 → 공백 필드만 LLM 호출.
// 입력: raw 공지 (Notice). 출력: ActionCard.

import type { ActionCard, Category, Notice } from "../types";
import {
  extractDeadline,
  extractMoney,
} from "./rules";
import { extractWithLlm, type LlmCaller } from "./llm";

export type ParseOptions = {
  /** LLM caller. 미주입 시 룰베이스 결과만으로 ActionCard 구성 (LLM 필드는 빈값) */
  llmCaller?: LlmCaller;
};

export async function parseNoticeToActionCard(
  notice: Notice,
  opts: ParseOptions = {},
): Promise<ActionCard> {
  const text = stripHtml(notice.raw_html ?? "") + "\n" + (notice.title ?? "");

  // 1) 룰베이스 마감일·금액
  const deadlineRule = extractDeadline(text);
  const moneyRule = extractMoney(text);

  // 2) 자격 요건은 자연어 의존성이 높아 LLM 필요
  let llm: Awaited<ReturnType<typeof extractWithLlm>> | null = null;
  if (opts.llmCaller) {
    try {
      llm = await extractWithLlm(
        {
          noticeId: notice.id,
          category: notice.category,
          title: notice.title,
          body: text,
          ruleHints: {
            deadline: deadlineRule?.value,
            amount: moneyRule?.value,
          },
        },
        opts.llmCaller,
      );
    } catch (e) {
      console.warn(`[parser] LLM fail for ${notice.id}:`, e);
    }
  }

  const deadline =
    deadlineRule?.value ?? llm?.endDate ?? notice.end_date ?? new Date().toISOString().slice(0, 10);

  return {
    id: `card-${notice.id}`,
    noticeId: notice.id,
    title: notice.title,
    category: notice.category as Category,
    deadline,
    benefit: llm?.benefit ?? {
      type: notice.category === "scholarship" ? "money" : "opportunity",
      amount: moneyRule?.value,
      description: moneyRule?.raw ?? "",
    },
    eligibility: llm?.eligibility ?? [],
    documents: llm?.documents.length ? llm.documents : notice.documents,
    applyUrl: notice.source_url,
    confidence: {
      deadline: deadlineRule?.confidence ?? llm?.confidence ?? 0.5,
      eligibility: llm?.confidence ?? 0.5,
    },
  };
}

function stripHtml(s: string): string {
  return s.replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
