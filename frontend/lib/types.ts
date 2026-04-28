// =============================================================================
// 기존 v1 데모 타입 — Supabase 스키마와 1:1 매핑. 유지.
// =============================================================================

export type Category = "scholarship" | "extracurricular" | "career";
export type AppStatus = "planning" | "completed";

export type Notice = {
  id: string;
  category: Category;
  title: string;
  summary: string | null;
  target: string | null;
  start_date: string | null;
  end_date: string | null;
  documents: string[];
  source_url: string;
  source_board: string | null;
  raw_html: string | null;
  llm_processed: boolean;
  created_at: string;
};

export type ApplicationStatusRow = {
  id: string;
  user_id: string;
  notice_id: string;
  status: AppStatus;
  updated_at: string;
};

// =============================================================================
// v2 타입 — 액션카드 + 자격 매칭 엔진. Phase 1~2에서 사용.
// 기존 Notice는 raw 데이터, ActionCard는 LLM·룰베이스 처리 후 산출물.
// =============================================================================

export type EligibilityType =
  | "gpa"
  | "grade"
  | "income_bracket"
  | "language"
  | "certificate"
  | "major"
  | "year"
  | "custom";

export type EligibilityOperator = "gte" | "lte" | "eq" | "in" | "contains";

export type EligibilityRequirement = {
  type: EligibilityType;
  operator: EligibilityOperator;
  value: number | string | string[];
  /** 원문 인용 — UI에서 "근거: …" 표시용 */
  raw: string;
};

export type BenefitType = "money" | "credit" | "opportunity";

export type Benefit = {
  type: BenefitType;
  /** money 일 때 KRW 단위, credit 일 때 학점 수 */
  amount?: number;
  description: string;
};

export type ActionCard = {
  id: string;
  noticeId: string;
  title: string;
  category: Category;
  /** ISO 8601 deadline (필수) */
  deadline: string;
  benefit: Benefit;
  eligibility: EligibilityRequirement[];
  /** 제출 서류 */
  documents: string[];
  applyUrl: string;
  /** 0~1 신뢰도 (UI에서 < 0.8 이면 "확인 필요" 라벨) */
  confidence: {
    deadline: number;
    eligibility: number;
  };
};

// -----------------------------------------------------------------------------
// 학생 프로필 — 모든 필드 optional. 입력된 것만으로 부분 매칭.
// -----------------------------------------------------------------------------

export type StudentProfile = {
  userId: string;
  /** 재학 / 휴학 / 졸업유예 등 */
  status?: "enrolled" | "leave" | "graduated_pending";
  /** 1~4 (대학원생 5+) */
  year?: number;
  /** 0.0~4.5 (학교별 다른 만점 정규화는 호출자 책임) */
  gpa?: number;
  /** 누적 이수 학점 */
  totalCredits?: number;
  /** 한국 국가장학금 소득분위 1~10 */
  incomeBracket?: number;
  major?: string;
  /** 어학 점수 — { TOEIC: 850, OPIC: "IH", ... } */
  language?: Record<string, number | string>;
  /** 보유 자격증 코드 또는 명칭 */
  certificates?: string[];
  /** 매칭 시점의 현재 학기 (예: "2026-1") — 시간 의존 요건 해석에 사용 */
  currentSemester?: string;
};

// -----------------------------------------------------------------------------
// 매칭 결과 — fit / gap / unfit / unknown 4상태.
// 학생이 정보 미입력한 요건은 절대 unfit이 아니라 unknown으로 분류 (False Negative 방지).
// -----------------------------------------------------------------------------

export type MatchStatus = "fit" | "gap" | "unfit" | "unknown";

export type GapItem = {
  requirement: EligibilityRequirement;
  /** 학생 현재 값 (없을 수 있음) */
  studentValue: number | string | string[] | null;
  /** 사람이 읽기 쉬운 갭 설명 — 예: "GPA 3.2 → 3.5 (0.3 부족)" */
  gap: string;
  /** 갭 채움 활동 — 예: ["이번 학기 추가 학습", "어학 시험 응시"] */
  suggestedActions: string[];
};

export type MatchTrace = {
  requirement: EligibilityRequirement;
  decision: "satisfied" | "missing" | "unknown";
  /** 매칭 로직 설명 — 디버깅 + UI "왜 이렇게 분류됐어요?" 답변용 */
  rationale: string;
};

export type MatchResult = {
  status: MatchStatus;
  /** 0~1 — 0.8 미만이면 호출자가 "확인 필요" 라벨 표시 */
  confidence: number;
  satisfied: EligibilityRequirement[];
  missing: GapItem[];
  /** 학생이 정보 미입력해 판정 불가 */
  unknown: EligibilityRequirement[];
  /** status === "gap" 일 때만 채워짐 */
  recommendation: string | null;
  /** 모든 요건별 판정 trace — 설명 가능성 보장 */
  trace: MatchTrace[];
};
