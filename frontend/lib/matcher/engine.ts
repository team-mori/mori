// 자격 매칭 엔진 — 모리의 핵심 차별점.
//
// 설계 원칙:
//   1) 정확도 > 속도. False Negative(자격 미달로 잘못 분류)가 최악.
//   2) 학생 미입력 = unknown (절대 unfit 아님).
//   3) 모든 결정은 trace 로 추적 가능 → "왜 미달이지?" 즉답 가능.
//   4) 점진적 정보 수집 친화 — 입력된 만큼만으로도 부분 매칭.

import type {
  ActionCard,
  EligibilityRequirement,
  GapItem,
  MatchResult,
  MatchTrace,
  StudentProfile,
} from "../types";

export function matchActionCard(
  profile: StudentProfile,
  card: ActionCard,
): MatchResult {
  const satisfied: EligibilityRequirement[] = [];
  const missing: GapItem[] = [];
  const unknown: EligibilityRequirement[] = [];
  const trace: MatchTrace[] = [];

  for (const req of card.eligibility) {
    const ev = evaluate(req, profile);
    trace.push({ requirement: req, decision: ev.decision, rationale: ev.rationale });
    if (ev.decision === "satisfied") {
      satisfied.push(req);
    } else if (ev.decision === "unknown") {
      unknown.push(req);
    } else {
      missing.push({
        requirement: req,
        studentValue: ev.studentValue,
        gap: ev.gap ?? "",
        suggestedActions: ev.suggestedActions ?? [],
      });
    }
  }

  const status: MatchResult["status"] =
    card.eligibility.length === 0
      ? "fit"
      : missing.length > 0
      ? card.eligibility.length === missing.length
        ? "unfit"
        : "gap"
      : unknown.length > 0
      ? "unknown"
      : "fit";

  // 신뢰도 = 카드 자체의 eligibility confidence × 학생 정보 충실도
  const profileCompleteness = unknown.length === 0
    ? 1.0
    : Math.max(0, 1 - unknown.length / Math.max(1, card.eligibility.length));
  const confidence = Math.min(1, card.confidence.eligibility * profileCompleteness);

  return {
    status,
    confidence,
    satisfied,
    missing,
    unknown,
    recommendation: status === "gap" ? buildRecommendation(missing) : null,
    trace,
  };
}

function buildRecommendation(missing: GapItem[]): string {
  const top = missing.slice(0, 2).map((g) => g.gap).filter(Boolean);
  if (top.length === 0) return "부족 요건을 보완하면 신청 가능해요.";
  return `${top.join(", ")} — 보완 후 재도전 가능해요.`;
}

// -----------------------------------------------------------------------------
// 요건별 평가 — 학생 정보 미입력 시 무조건 unknown.
// -----------------------------------------------------------------------------

type Evaluation = {
  decision: MatchTrace["decision"];
  rationale: string;
  studentValue: GapItem["studentValue"];
  gap?: string;
  suggestedActions?: string[];
};

function evaluate(req: EligibilityRequirement, p: StudentProfile): Evaluation {
  switch (req.type) {
    case "gpa":
      return evalNumeric(p.gpa ?? null, req, "GPA", ["이번 학기 추가 학습으로 평점 끌어올리기"]);
    case "year":
      return evalNumeric(p.year ?? null, req, "학년", ["다음 학기에 자동 충족"]);
    case "income_bracket":
      return evalNumeric(p.incomeBracket ?? null, req, "소득분위", [
        "국가장학금 신청 시 소득분위 재산정 가능",
      ]);
    case "grade":
      // 누적 이수 학점
      return evalNumeric(p.totalCredits ?? null, req, "이수학점", ["이번 학기 추가 수강"]);
    case "major":
      return evalCategorical(p.major ?? null, req, "전공", []);
    case "language":
      return evalLanguage(p.language ?? {}, req);
    case "certificate":
      return evalCertificate(p.certificates ?? null, req);
    case "custom":
    default:
      return {
        decision: "unknown",
        rationale: `custom 요건 — 자동 판정 불가, "확인 필요" 라벨`,
        studentValue: null,
      };
  }
}

function evalNumeric(
  studentValue: number | null,
  req: EligibilityRequirement,
  label: string,
  defaultActions: string[],
): Evaluation {
  if (studentValue == null) {
    return {
      decision: "unknown",
      rationale: `${label} 정보 미입력`,
      studentValue: null,
    };
  }
  const target = Number(req.value);
  if (Number.isNaN(target)) {
    return {
      decision: "unknown",
      rationale: `요건 값을 숫자로 해석 불가: ${String(req.value)}`,
      studentValue,
    };
  }
  const op = req.operator;
  const ok =
    op === "gte" ? studentValue >= target
    : op === "lte" ? studentValue <= target
    : op === "eq" ? studentValue === target
    : false;
  if (ok) {
    return {
      decision: "satisfied",
      rationale: `${label} ${studentValue} ${op} ${target}`,
      studentValue,
    };
  }
  const diff = Math.abs(studentValue - target);
  return {
    decision: "missing",
    rationale: `${label} ${studentValue} 가 요건 ${op} ${target} 미달`,
    studentValue,
    gap: `${label} ${studentValue} → ${target} (${diff.toFixed(diff < 1 ? 2 : 0)} 부족)`,
    suggestedActions: defaultActions,
  };
}

function evalCategorical(
  studentValue: string | null,
  req: EligibilityRequirement,
  label: string,
  defaultActions: string[],
): Evaluation {
  if (studentValue == null) {
    return { decision: "unknown", rationale: `${label} 정보 미입력`, studentValue: null };
  }
  const op = req.operator;
  let ok = false;
  if (op === "in" && Array.isArray(req.value)) {
    ok = (req.value as string[]).some((v) => studentValue.includes(v));
  } else if (op === "contains") {
    ok = studentValue.includes(String(req.value));
  } else if (op === "eq") {
    ok = studentValue === String(req.value);
  }
  return ok
    ? { decision: "satisfied", rationale: `${label} ${studentValue} 일치`, studentValue }
    : {
        decision: "missing",
        rationale: `${label} ${studentValue} 요건 ${String(req.value)} 미일치`,
        studentValue,
        gap: `${label}: ${studentValue} (요건: ${Array.isArray(req.value) ? req.value.join("/") : req.value})`,
        suggestedActions: defaultActions,
      };
}

function evalLanguage(
  studentLang: Record<string, number | string>,
  req: EligibilityRequirement,
): Evaluation {
  // raw 에서 자격증 종류 추정 (TOEIC/OPIC/JLPT 등)
  const raw = req.raw;
  const known = ["TOEIC", "OPIC", "TEPS", "TOEFL", "JLPT", "HSK", "DELE"];
  const detected = known.find((k) => raw.toUpperCase().includes(k));
  if (!detected) {
    return {
      decision: "unknown",
      rationale: `어학 종류 미식별: ${raw}`,
      studentValue: null,
    };
  }
  const sv = studentLang[detected] ?? studentLang[detected.toLowerCase()];
  if (sv == null) {
    return {
      decision: "unknown",
      rationale: `${detected} 점수 미입력`,
      studentValue: null,
    };
  }
  // 숫자 비교만 우선 지원 (OPIC 등 등급은 contains)
  if (typeof sv === "number" && typeof req.value === "number") {
    const ok = req.operator === "gte" ? sv >= req.value : req.operator === "lte" ? sv <= req.value : sv === req.value;
    return ok
      ? { decision: "satisfied", rationale: `${detected} ${sv} ${req.operator} ${req.value}`, studentValue: sv }
      : {
          decision: "missing",
          rationale: `${detected} ${sv} 미달`,
          studentValue: sv,
          gap: `${detected} ${sv} → ${req.value}`,
          suggestedActions: [`${detected} 재시험 응시`],
        };
  }
  return {
    decision: "unknown",
    rationale: `${detected} 등급 비교 미지원`,
    studentValue: sv,
  };
}

function evalCertificate(
  studentCerts: string[] | null,
  req: EligibilityRequirement,
): Evaluation {
  if (studentCerts == null) {
    return { decision: "unknown", rationale: "자격증 정보 미입력", studentValue: null };
  }
  const want = Array.isArray(req.value) ? (req.value as string[]) : [String(req.value)];
  const has = want.some((w) => studentCerts.some((c) => c.includes(w)));
  return has
    ? { decision: "satisfied", rationale: `자격증 보유: ${want.join("/")}`, studentValue: studentCerts }
    : {
        decision: "missing",
        rationale: `자격증 미보유: ${want.join("/")}`,
        studentValue: studentCerts,
        gap: `필요 자격증: ${want.join(" 또는 ")}`,
        suggestedActions: ["관련 자격증 시험 일정 확인"],
      };
}
