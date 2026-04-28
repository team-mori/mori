// LLM 기반 추출 — 자연어 자격 요건 같은 룰베이스 한계 영역만 호출.
// 공지당 1회, JSON 모드 강제, 토큰·비용 추적 로그.

import type {
  ActionCard,
  Benefit,
  EligibilityRequirement,
} from "../types";

export type LlmInput = {
  noticeId: string;
  category: ActionCard["category"];
  title: string;
  body: string;
  /** 룰베이스에서 이미 뽑힌 마감일 — LLM에 컨텍스트로 전달해 일관성 확보 */
  ruleHints?: {
    deadline?: string;
    amount?: number;
  };
};

export type LlmOutput = {
  summary: string;
  target: string;
  startDate: string | null;
  endDate: string | null;
  documents: string[];
  benefit: Benefit;
  eligibility: EligibilityRequirement[];
  /** LLM 자체 신뢰도 0~1 */
  confidence: number;
  /** 토큰 사용량 — 비용 추적 */
  usage: { input: number; output: number };
};

export type LlmCaller = (prompt: string) => Promise<{ json: string; usage: { input: number; output: number } }>;

// -----------------------------------------------------------------------------
// 프롬프트 (한국어, JSON only 강제)
// -----------------------------------------------------------------------------

export function buildPrompt(input: LlmInput): string {
  const hint = input.ruleHints
    ? `\n룰베이스로 이미 추출된 정보:\n- 마감일: ${input.ruleHints.deadline ?? "없음"}\n- 금액: ${
        input.ruleHints.amount ? input.ruleHints.amount.toLocaleString() + "원" : "없음"
      }\n이 정보와 모순되지 않게 답하라.\n`
    : "";

  return `다음은 한국 대학교의 [${input.category}] 공지 원문이다. 아래 항목을 JSON으로 추출하라.

제목: ${input.title}

본문:
${input.body.slice(0, 6000)}
${hint}
출력 형식 (JSON only, 다른 텍스트 금지):
{
  "summary": "25자 이내 한 줄 요약",
  "target": "지원대상 (예: 재학생 / 소득분위 8분위 이하)",
  "start_date": "YYYY-MM-DD or null",
  "end_date": "YYYY-MM-DD or null",
  "documents": ["서류1", "서류2", "서류3"],
  "benefit": {
    "type": "money | credit | opportunity",
    "amount": 1000000,
    "description": "혜택 설명"
  },
  "eligibility": [
    {
      "type": "gpa | grade | income_bracket | language | certificate | major | year | custom",
      "operator": "gte | lte | eq | in | contains",
      "value": "값 (숫자 또는 문자열 또는 배열)",
      "raw": "원문에서 인용한 자격 문구"
    }
  ],
  "confidence": 0.9
}`;
}

// -----------------------------------------------------------------------------
// 호출 + 파싱
// -----------------------------------------------------------------------------

const TOTAL_TOKENS = { input: 0, output: 0, calls: 0 };

export function getTotalUsage(): { input: number; output: number; calls: number } {
  return { ...TOTAL_TOKENS };
}

export async function extractWithLlm(input: LlmInput, caller: LlmCaller): Promise<LlmOutput> {
  const prompt = buildPrompt(input);
  const { json, usage } = await caller(prompt);
  TOTAL_TOKENS.input += usage.input;
  TOTAL_TOKENS.output += usage.output;
  TOTAL_TOKENS.calls += 1;

  const parsed = safeParseJson(json);
  return normalize(parsed, usage);
}

function safeParseJson(s: string): Record<string, unknown> {
  // ```json ... ``` 블록 또는 첫 { ... } 추출
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const cand = fence ? fence[1] : s;
  const brace = cand.match(/\{[\s\S]*\}/);
  if (!brace) throw new Error(`LLM output is not JSON: ${s.slice(0, 200)}`);
  return JSON.parse(brace[0]) as Record<string, unknown>;
}

function normalize(p: Record<string, unknown>, usage: { input: number; output: number }): LlmOutput {
  const benefit = (p.benefit ?? { type: "opportunity", description: "" }) as Benefit;
  const elig = (p.eligibility ?? []) as EligibilityRequirement[];
  return {
    summary: String(p.summary ?? "").slice(0, 25),
    target: String(p.target ?? ""),
    startDate: (p.start_date as string | null) ?? null,
    endDate: (p.end_date as string | null) ?? null,
    documents: (p.documents as string[] | undefined) ?? [],
    benefit,
    eligibility: elig,
    confidence: typeof p.confidence === "number" ? p.confidence : 0.7,
    usage,
  };
}

// -----------------------------------------------------------------------------
// 실제 Anthropic SDK 콜러 — 환경변수 ANTHROPIC_API_KEY 필요.
// 테스트에서는 mock caller 주입하면 SDK 의존 없이 동작.
// -----------------------------------------------------------------------------

export function createAnthropicCaller(apiKey: string, model = "claude-sonnet-4-6"): LlmCaller {
  return async (prompt) => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) throw new Error(`Anthropic API ${r.status}: ${await r.text()}`);
    const body = (await r.json()) as {
      content: { text: string }[];
      usage: { input_tokens: number; output_tokens: number };
    };
    return {
      json: body.content[0]?.text ?? "",
      usage: { input: body.usage.input_tokens, output: body.usage.output_tokens },
    };
  };
}
