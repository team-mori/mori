// 룰베이스 추출 — 정규식만으로 신뢰도 높게 뽑을 수 있는 필드.
// 비용·지연·환각 위험이 LLM 대비 0이라 우선 시도, 실패한 필드만 LLM에 위임.

export type RuleResult<T> = { value: T; confidence: number; raw: string } | null;

// -----------------------------------------------------------------------------
// 마감일 — backend/lib/date_extract.py 와 동일한 패턴 (정확도 100%, N=50 검증).
// -----------------------------------------------------------------------------

const DEADLINE_KEYWORDS = ["마감", "신청기한", "신청 기간", "접수마감", "제출기한", "마감일", "신청 마감"];

const DATE_PATTERNS: RegExp[] = [
  /(\d{4})[-./](\d{1,2})[-./](\d{1,2})/g,
  /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/g,
  /(\d{1,2})월\s*(\d{1,2})일/g,
];

export function extractDeadline(text: string, currentYear?: number): RuleResult<string> {
  const year = currentYear ?? new Date().getFullYear();
  // 1) 마감 키워드 근처 60자 이내 날짜 우선
  for (const kw of DEADLINE_KEYWORDS) {
    const idx = text.indexOf(kw);
    if (idx === -1) continue;
    const window = text.slice(idx, idx + 60);
    const found = findDates(window, year);
    if (found.length > 0) {
      return { value: found[0].iso, confidence: 0.95, raw: found[0].raw };
    }
  }
  // 2) fallback: 본문 마지막 날짜
  const all = findDates(text, year);
  if (all.length === 0) return null;
  return { value: all[all.length - 1].iso, confidence: 0.6, raw: all[all.length - 1].raw };
}

function findDates(s: string, defaultYear: number): { iso: string; raw: string }[] {
  const out: { iso: string; raw: string }[] = [];
  for (const re of DATE_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
      const raw = m[0];
      let y: number, mo: number, d: number;
      if (m.length === 4) {
        y = parseInt(m[1], 10);
        mo = parseInt(m[2], 10);
        d = parseInt(m[3], 10);
      } else {
        y = defaultYear;
        mo = parseInt(m[1], 10);
        d = parseInt(m[2], 10);
      }
      if (mo < 1 || mo > 12 || d < 1 || d > 31) continue;
      const iso = `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      out.push({ iso, raw });
    }
  }
  return out;
}

// -----------------------------------------------------------------------------
// 금액 (장학금 만원/원 단위)
// -----------------------------------------------------------------------------

const MONEY_RE = /(\d{1,3}(?:,\d{3})*|\d+)\s*(만원|원)/g;

export function extractMoney(text: string): RuleResult<number> {
  MONEY_RE.lastIndex = 0;
  let max = 0;
  let raw = "";
  let m: RegExpExecArray | null;
  while ((m = MONEY_RE.exec(text)) !== null) {
    const num = parseInt(m[1].replace(/,/g, ""), 10);
    const unit = m[2];
    const krw = unit === "만원" ? num * 10000 : num;
    if (krw > max) {
      max = krw;
      raw = m[0];
    }
  }
  if (max === 0) return null;
  return { value: max, confidence: 0.9, raw };
}

// -----------------------------------------------------------------------------
// GPA 요건 (예: "직전학기 평점 3.5 이상")
// -----------------------------------------------------------------------------

const GPA_RE = /(?:평점|학점|GPA|성적)[^\n]{0,30}?(\d\.\d{1,2})\s*(?:이상|점\s*이상|초과)/g;

export function extractGpaRequirement(text: string): RuleResult<number> {
  GPA_RE.lastIndex = 0;
  const m = GPA_RE.exec(text);
  if (!m) return null;
  const v = parseFloat(m[1]);
  if (Number.isNaN(v) || v < 0 || v > 4.5) return null;
  return { value: v, confidence: 0.85, raw: m[0] };
}

// -----------------------------------------------------------------------------
// 학년 요건 (예: "재학생", "2학년 이상")
// -----------------------------------------------------------------------------

const YEAR_RE = /(\d)\s*학년\s*(이상|이하)?/;

export function extractYearRequirement(text: string): RuleResult<{ year: number; op: "gte" | "lte" | "eq" }> {
  const m = YEAR_RE.exec(text);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  if (year < 1 || year > 6) return null;
  const op = m[2] === "이상" ? "gte" : m[2] === "이하" ? "lte" : "eq";
  return { value: { year, op }, confidence: 0.8, raw: m[0] };
}

// -----------------------------------------------------------------------------
// 소득분위 (한국 국가장학금 N분위)
// -----------------------------------------------------------------------------

const INCOME_RE = /소득\s*(\d{1,2})\s*분위\s*(이하|이상)?/;

export function extractIncomeBracket(text: string): RuleResult<{ bracket: number; op: "gte" | "lte" | "eq" }> {
  const m = INCOME_RE.exec(text);
  if (!m) return null;
  const bracket = parseInt(m[1], 10);
  if (bracket < 1 || bracket > 10) return null;
  const op = m[2] === "이상" ? "gte" : m[2] === "이하" ? "lte" : "lte";
  return { value: { bracket, op }, confidence: 0.85, raw: m[0] };
}
