import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Bell,
  Bookmark,
  CalendarCheck,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  ExternalLink,
  EyeOff,
  FileCheck2,
  FileText,
  FileUp,
  Filter,
  History,
  Home,
  Info,
  Link2,
  ListChecks,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  School,
  Trophy,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

const filterChips = ["전체", "마감 임박", "장학", "비교과", "취업", "공모전", "청년정책", "저장됨"] as const;

const feedSummary = [
  ["공지", "12", "saved"],
  ["충족", "5", "eligible"],
  ["확인", "2", "unknown"],
] as const;

const opportunities = [
  {
    dday: "D-2",
    category: "장학",
    source: "학교 장학팀",
    title: "국가장학금 2차 신청 및 가구원 정보 제공 동의 안내",
    amount: "월 30만 원",
    state: "자격 충족",
    tone: "eligible",
    reason: "재학, 소득 구간, 이수 학점이 모두 맞아요.",
  },
  {
    dday: "D-3",
    category: "비교과",
    source: "비교과센터",
    title: "2026 하계 글로벌 챌린지 프로그램 참가자 모집",
    amount: "해외연수",
    state: "확인 필요",
    tone: "unknown",
    reason: "어학 점수와 여권 만료일을 입력하면 판단할 수 있어요.",
  },
  {
    dday: "D-5",
    category: "취업",
    source: "경력개발지원단",
    title: "반도체 직무 집중 캠프 사전 신청",
    amount: "사전등록",
    state: "자격 부족",
    tone: "insufficient",
    reason: "현재 3학년이라 4학년 우선 모집 조건이 부족해요.",
  },
  {
    dday: "오늘",
    category: "학과",
    source: "컴퓨터공학부",
    title: "컴퓨터공학부 졸업작품 중간 발표 자료 제출",
    amount: "서류 제출",
    state: "마감 임박",
    tone: "due",
    reason: "오늘 18:00까지 PDF와 발표 자료를 같이 제출해야 해요.",
  },
  {
    dday: "D-9",
    category: "청년정책",
    source: "서울청년포털",
    title: "청년 자격증 응시료 지원 2차 모집",
    amount: "최대 10만 원",
    state: "추천",
    tone: "saved",
    reason: "취업 준비 관심사와 자격증 키워드가 맞아요.",
  },
] as const;

const crawlSources = [
  ["장학팀", "성공", "24건", "오늘 09:12", "eligible"],
  ["비교과센터", "부분", "11건", "어학 조건 확인 필요", "unknown"],
  ["경력개발지원단", "성공", "18건", "오늘 09:06", "eligible"],
  ["학과 게시판", "실패", "0건", "원문 링크로 대체", "insufficient"],
] as const;

const pipelineSteps = [
  ["수집", "공개 게시판 원문과 첨부를 가져와요."],
  ["추출", "마감일, 대상, 서류, 혜택을 분리해요."],
  ["카드화", "학생이 바로 판단할 액션카드로 바꿔요."],
] as const;

const contestRecommendations = [
  ["K-Startup 예비창업패키지", "창업 관심 + 글로벌 챌린지 키워드", "D-18", "Trophy"],
  ["대학생 ESG 아이디어 공모전", "비교과 활동 이력과 주제가 가까워요", "D-12", "Sparkles"],
  ["반도체 직무 포트폴리오 챌린지", "취업 캠프와 직무 키워드가 겹쳐요", "D-21", "FileCheck2"],
] as const;

const policyRecommendations = [
  ["청년 자격증 응시료 지원", "취업 준비 카테고리와 연결", "최대 10만 원"],
  ["청년 월세 특별지원", "장학/생활비 공지와 함께 확인", "월 최대 20만 원"],
] as const;

const lowConfidenceItems = [
  ["마감일", "본문에는 6월 25일, 첨부에는 6월 26일로 보여요.", "원문 확인"],
  ["어학 점수", "자격 기준은 있지만 내 프로필 정보가 비어 있어요.", "점수 입력"],
  ["대상 학년", "학과별 세부 조건이 첨부 PDF 안에 있어요.", "첨부 보기"],
] as const;

const checklist = [
  ["자격 조건", "재학생 / 소득 8분위 이하", "done"],
  ["제출 서류", "재학증명서, 가구원 동의서", "todo"],
  ["신청 일정", "6월 25일 18:00 마감", "todo"],
] as const;

const reminderOptions = [
  ["오늘 저녁", "20:00"],
  ["마감 전날", "6월 24일 09:00"],
  ["서류 준비", "6월 23일 18:00"],
] as const;

const savedRows = [
  ["신청 예정", "국가장학금 2차 신청", "D-2", "planned"],
  ["캘린더 추가됨", "글로벌 챌린지 프로그램", "D-5", "calendar"],
  ["신청 완료", "진로 포트폴리오 캠프", "D+1", "applied"],
] as const;

const trustFacts = [
  ["출처", "한국장학재단 공지 / 학교 장학팀"],
  ["마지막 확인", "오늘 09:12, 원문 기준"],
  ["사용된 내 조건", "3학년, 재학, 소득 8분위, 12학점"],
] as const;

const detailVariants = [
  {
    title: "글로벌 챌린지 프로그램 참가자 모집",
    state: "확인 필요",
    tone: "unknown",
    dday: "D-3",
    cause: "어학 점수와 여권 만료일 정보가 없어요.",
    action: "부족한 조건 입력",
  },
  {
    title: "반도체 직무 집중 캠프 사전 신청",
    state: "자격 부족",
    tone: "insufficient",
    dday: "D-5",
    cause: "4학년 우선 모집이라 현재 학년 조건이 맞지 않아요.",
    action: "그래도 저장",
  },
  {
    title: "졸업작품 중간 발표 자료 제출",
    state: "마감 지남",
    tone: "ineligible",
    dday: "D+1",
    cause: "원문 기준 6월 22일 18:00에 접수가 끝났어요.",
    action: "비슷한 공지 찾기",
  },
] as const;

const postApplySteps = [
  ["저장됨", "신청 예정 목록에 추가", "done"],
  ["리마인더", "6월 24일 09:00 알림", "done"],
  ["서류", "재학증명서 업로드 필요", "todo"],
] as const;

const tokens = [
  ["Primitive", "Radix slate / ink primary / soft indigo / green / amber"],
  ["State", "eligible / insufficient / unknown / due / saved / planned"],
  ["Coverage", "P0 + P1 student mobile flows"],
  ["Mobile", "320px min, stable phone ratio, 36px chips"],
] as const;

const profileSettings = [
  ["학교", "한국대학교", "school"],
  ["학과", "컴퓨터공학부", "school"],
  ["학년", "3학년 재학", "user"],
  ["소득 구간", "8분위 이하", "wallet"],
  ["거주지", "서울시 관악구", "map"],
  ["관심 분야", "장학, 취업, 해외연수", "sparkles"],
] as const;

const filterGroups = [
  ["카테고리", ["장학", "비교과", "취업", "공모전", "청년정책"]],
  ["상태", ["자격 충족", "확인 필요", "저장됨", "숨김 제외"]],
  ["마감", ["오늘", "3일 이내", "7일 이내", "이번 달"]],
] as const;

const sourceEvents = [
  ["마감 변경", "6월 26일 18:00 → 6월 25일 18:00", "due"],
  ["첨부 추가", "가구원 동의서 PDF 1개 추가", "saved"],
  ["본문 유지", "제목과 대상 조건 변경 없음", "eligible"],
] as const;

const feedbackActions = [
  ["저장", "내 기회에 보관하고 알림 후보로 유지", "saved"],
  ["숨김", "피드에서 제거하되 원문 기록은 유지", "ineligible"],
  ["관심없음", "비슷한 추천을 줄이도록 반영", "insufficient"],
] as const;

const applicationStatusRows = [
  ["검토중", "원문과 조건을 확인하는 단계", "done"],
  ["준비중", "재학증명서 업로드 필요", "active"],
  ["신청완료", "학생 포털 제출 후 체크", "todo"],
  ["결과확인", "선발 공지 자동 확인", "todo"],
] as const;

const shareRows = [
  ["요약 링크", "제목, 마감, 자격, 원문 링크 포함"],
  ["친구에게 공유", "추천 이유와 체크리스트 제외"],
  ["팀 채팅 공유", "공모전/비교과 일정 중심"],
] as const;

type Tone = "eligible" | "insufficient" | "ineligible" | "unknown" | "due" | "saved" | "planned" | "applied" | "calendar";

const toneClass: Record<Tone, string> = {
  eligible: "border-state-eligible-line bg-state-eligible-bg text-state-eligible-fg",
  insufficient: "border-state-insufficient-line bg-state-insufficient-bg text-state-insufficient-fg",
  ineligible: "border-state-ineligible-line bg-state-ineligible-bg text-state-ineligible-fg",
  unknown: "border-state-unknown-line bg-state-unknown-bg text-state-unknown-fg",
  due: "border-state-due-line bg-state-due-bg text-state-due-fg",
  saved: "border-state-saved-line bg-state-saved-bg text-state-saved-fg",
  planned: "border-state-planned-line bg-state-planned-bg text-state-planned-fg",
  applied: "border-state-applied-line bg-state-applied-bg text-state-applied-fg",
  calendar: "border-state-calendar-line bg-state-calendar-bg text-state-calendar-fg",
};

export default function WireframePage() {
  return (
    <main className="min-h-screen bg-page text-fg-1">
      <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-8">
        <header className="flex flex-col gap-5 border-b border-line-2 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <MoriMark size={28} />
              <p className="text-1 font-[var(--font-weight-bold)] uppercase tracking-normal text-brand-text">
                MORI student mobile MVP
              </p>
            </div>
            <h1 className="mt-2 text-7 font-[var(--font-weight-bold)] tracking-normal md:text-8">
              PRD 기반 학생 모바일 와이어프레임
            </h1>
            <p className="mt-3 text-3 text-fg-2">
              학교 공지 수집, 액션카드, 캘린더 저장, 공모전/청년정책 추천, 정보 부족 보완, 검색/필터, 원문 변경 감지,
              신청 상태 관리까지 학생 MVP의 P0/P1 흐름을 화면으로 분리했습니다.
            </p>
          </div>
          <div className="grid min-w-[280px] gap-2 rounded-5 border border-line-1 bg-surface p-4 shadow-flat">
            {tokens.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[86px_minmax(0,1fr)] gap-3 text-2">
                <span className="font-[var(--font-weight-bold)] text-fg-1">{label}</span>
                <span className="text-fg-2">{value}</span>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(344px,414px))] items-start justify-start gap-5 overflow-x-auto pb-2">
          <PhoneFrame title="1. 조건 입력" note="Goodnotes + Halo Habits">
            <ProfileScreen />
          </PhoneFrame>
          <PhoneFrame title="2. 홈 피드" note="Matter + Acadex">
            <HomeScreen />
          </PhoneFrame>
          <PhoneFrame title="3. 수집 상태" note="source health + parser">
            <IngestionScreen />
          </PhoneFrame>
          <PhoneFrame title="4. 공지 상세" note="Asana + Coinbase">
            <DetailScreen />
          </PhoneFrame>
          <PhoneFrame title="5. 캘린더 저장" note="Partiful + Up Ahead">
            <ReminderScreen />
          </PhoneFrame>
          <PhoneFrame title="6. 추천 확장" note="contextual recommendations">
            <RecommendationScreen />
          </PhoneFrame>
          <PhoneFrame title="7. 정보 부족" note="low confidence fallback">
            <LowConfidenceScreen />
          </PhoneFrame>
          <PhoneFrame title="8. 내 기회" note="Going + status tabs">
            <SavedScreen />
          </PhoneFrame>
          <PhoneFrame title="9. 상태별 상세" note="Asana states + Acadex">
            <StateVariantsScreen />
          </PhoneFrame>
          <PhoneFrame title="10. 신청 후 피드백" note="Any.do + Asana calendar">
            <PostApplyScreen />
          </PhoneFrame>
          <PhoneFrame title="11. 프로필 관리" note="eligibility inputs">
            <ProfileSettingsScreen />
          </PhoneFrame>
          <PhoneFrame title="12. 검색/필터" note="saved search + sort">
            <SearchFilterScreen />
          </PhoneFrame>
          <PhoneFrame title="13. 원문/변경 확인" note="source + change detection">
            <SourceChangeScreen />
          </PhoneFrame>
          <PhoneFrame title="14. 추천 피드백" note="save / hide / not interested">
            <FeedbackScreen />
          </PhoneFrame>
          <PhoneFrame title="15. 신청 상태" note="status + documents">
            <ApplicationStatusScreen />
          </PhoneFrame>
          <PhoneFrame title="16. 공유 요약" note="shareable notice summary">
            <ShareSummaryScreen />
          </PhoneFrame>
        </section>
      </section>
    </main>
  );
}

function PhoneFrame({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <article className="min-w-[344px] rounded-5 border border-line-1 bg-surface p-3 shadow-flat">
      <div className="mb-3 px-1">
        <h2 className="text-3 font-[var(--font-weight-bold)] tracking-normal">{title}</h2>
        <p className="mt-1 text-1 text-fg-3">{note}</p>
      </div>
      <div className="mx-auto aspect-[390/844] min-w-[320px] max-w-[390px] overflow-hidden rounded-[20px] border border-line-1 bg-page shadow-lift-2">
        {children}
      </div>
    </article>
  );
}

function MoriMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="var(--brand)" />
      <path
        d="M7 14.5 L7 8.5 L10 12 L12 8.5 L14 12 L17 8.5 L17 14.5"
        stroke="var(--bg-page)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="6.5" r="1.6" fill="var(--state-eligible-fg)" />
    </svg>
  );
}

function MoriWordmark() {
  return (
    <div className="flex items-center gap-2">
      <MoriMark size={24} />
      <span className="text-4 font-[var(--font-weight-bold)] tracking-normal text-brand">모리</span>
      <span className="text-1 font-[var(--font-weight-bold)] uppercase tracking-normal text-fg-4">MORI</span>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex h-10 items-center justify-between px-5 pt-2 text-1 font-[var(--font-weight-bold)] text-fg-1">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-3 rounded-[2px] bg-fg-1" />
        <span className="h-2 w-4 rounded-[2px] bg-fg-1" />
      </span>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 px-[var(--screen-padding-x)] pb-5 pt-6">
        <MoriWordmark />
        <p className="mt-2 text-1 text-fg-4">모두의 리마인더</p>
        <h3 className="mt-6 text-6 font-[var(--font-weight-bold)] tracking-normal">
          내 조건을 알려주세요
        </h3>
        <p className="mt-2 text-2 text-fg-2">
          전공, 학년, 관심 분야를 기준으로 맞는 공지를 먼저 보여드릴게요.
        </p>

        <div className="mt-6 space-y-[var(--stack-gap)]">
          <SelectRow label="학년" value="3학년" icon={UserRound} />
          <SelectRow label="전공 계열" value="공학 / 소프트웨어" icon={Settings2} />
          <SelectRow label="관심 혜택" value="장학, 취업, 해외연수" icon={Sparkles} />
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">관심 카테고리</h4>
            <span className="text-1 text-brand-text">3개 선택됨</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["장학", "비교과", "취업", "공모전"].map((item, index) => (
              <span
                key={item}
                className={[
                  "inline-flex h-[var(--chip-height)] items-center rounded-pill border px-[var(--chip-padding-x)] text-2 font-[var(--font-weight-medium)]",
                  index < 3 ? "border-brand bg-brand text-fg-on-brand" : "border-line-1 bg-page text-fg-2",
                ].join(" ")}
              >
                {index < 3 && <Check size={14} strokeWidth={2} className="mr-1.5" aria-hidden />}
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
      <div className="border-t border-line-2 bg-surface px-[var(--screen-padding-x)] py-4">
        <button className="h-12 w-full rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">
          맞춤 기회 보기
        </button>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-center justify-between">
          <MoriWordmark />
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-pill border border-line-1 bg-surface text-fg-2">
              <Search size={17} strokeWidth={1.75} aria-label="검색" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-pill border border-line-1 bg-surface text-fg-2">
              <Bell size={17} strokeWidth={1.75} aria-label="알림" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-1 text-fg-3">마감 우선 피드</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">챙길 기회 8개</h3>
          </div>
          <span className="rounded-pill border border-line-1 bg-surface px-3 py-1 text-1 font-[var(--font-weight-bold)] text-fg-2">
            공지 53건 반영
          </span>
        </div>

        <div className="mt-4 flex h-10 items-center gap-2 rounded-4 border border-line-1 bg-surface px-3 text-2 text-fg-3">
          <Search size={15} strokeWidth={1.75} aria-hidden />
          장학, 비교과, 취업 공지 검색
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {feedSummary.map(([label, value, tone]) => (
            <div key={label} className={["rounded-4 border p-2.5", toneClass[tone as Tone]].join(" ")}>
              <p className="text-1">{label}</p>
              <p className="text-4 font-[var(--font-weight-bold)] leading-[24px]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filterChips.slice(0, 5).map((chip, index) => (
            <span
              key={chip}
              className={[
                "inline-flex h-8 shrink-0 items-center rounded-pill border px-3 text-1 font-[var(--font-weight-bold)]",
                index === 0 ? "border-brand-line bg-brand-tint text-brand-text" : "border-line-1 bg-surface text-fg-2",
              ].join(" ")}
            >
              {chip}
            </span>
          ))}
        </div>

        <section className="mt-4 border-y border-brand-line bg-brand-tint py-3">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-4 bg-surface text-brand-text">
              <ShieldCheck size={18} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-1 font-[var(--font-weight-bold)] text-brand-text">내 조건으로 먼저 골랐어요</p>
              <p className="mt-1 text-2 text-fg-2">자격 충족 5개, 확인 필요 1개가 있어요.</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1 border-t border-brand-line pt-3 text-1 text-fg-2">
            <Clock3 size={14} strokeWidth={1.75} className="mt-0.5 text-brand-text" aria-hidden />
            <span>정렬 기준: 마감 임박, 조건 일치, 최근 업데이트</span>
            <Info size={14} strokeWidth={1.75} className="mt-0.5 text-brand-text" aria-hidden />
            <span>오늘 09:12에 원문을 다시 확인했어요.</span>
          </div>
        </section>

        <div className="mt-4 space-y-2">
          <OpportunityCard item={opportunities[0]} />
          {opportunities.slice(1, 3).map((item) => (
            <CompactOpportunityRow key={item.title} item={item} />
          ))}
        </div>
      </div>
      <BottomNav active="홈" />
    </div>
  );
}

function IngestionScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-1 text-fg-3">수집 상태</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">공지 53건 반영</h3>
            <p className="mt-1 text-1 text-fg-3">마지막 크롤링 오늘 09:12</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-4 bg-brand-tint text-brand-text">
            <RefreshCw size={17} strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">카드 변환 파이프라인</h4>
            <span className="text-1 text-brand-text">P0</span>
          </div>
          <div className="mt-4 grid gap-3">
            {pipelineSteps.map(([label, value], index) => (
              <div key={label} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-pill border border-brand-line bg-brand-tint text-1 font-[var(--font-weight-bold)] text-brand-text">
                  {index + 1}
                </span>
                <span className="min-w-0 border-b border-line-2 pb-3 last:border-b-0 last:pb-0">
                  <span className="block text-2 font-[var(--font-weight-bold)] text-fg-1">{label}</span>
                  <span className="mt-0.5 block text-1 leading-[16px] text-fg-3">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">출처별 상태</h4>
            <span className="text-1 text-fg-3">원문 보존</span>
          </div>
          <div className="space-y-2">
            {crawlSources.map(([name, state, count, updated, tone]) => (
              <div key={name} className="rounded-4 border border-line-1 bg-surface px-3 py-2.5 shadow-flat">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-2 font-[var(--font-weight-bold)] text-fg-1">{name}</p>
                    <p className="line-clamp-1 text-1 text-fg-3">{updated}</p>
                  </div>
                  <span className={["shrink-0 rounded-pill border px-2 py-1 text-1 font-[var(--font-weight-bold)]", toneClass[tone as Tone]].join(" ")}>
                    {state}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-line-2 pt-2 text-1">
                  <span className="text-fg-3">반영된 카드</span>
                  <span className="font-[var(--font-weight-bold)] text-fg-1">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomNav active="탐색" />
    </div>
  );
}

function DetailScreen() {
  return (
    <div className="flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-center justify-between">
          <button className="grid h-[40px] w-[40px] place-items-center rounded-pill border border-line-1 bg-surface text-fg-2">
            <ChevronRight size={17} strokeWidth={1.75} className="rotate-180" aria-label="뒤로" />
          </button>
          <span className="rounded-pill border border-state-saved-line bg-state-saved-bg px-3 py-1 text-1 font-[var(--font-weight-bold)] text-state-saved-fg">
            저장됨
          </span>
        </div>

        <section className="mt-4 border-b border-line-2 pb-4">
          <p className="text-1 font-[var(--font-weight-bold)] uppercase tracking-normal text-fg-3">장학 · 학교 장학팀</p>
          <div className="mt-2 flex items-baseline gap-3">
            <p className="text-dday text-[48px] leading-none text-state-due-fg">D-2</p>
            <div>
              <p className="text-1 font-[var(--font-weight-bold)] text-state-due-fg">마감 임박</p>
              <p className="text-1 text-fg-3">6월 25일 18:00</p>
            </div>
          </div>
          <h3 className="mt-2 break-keep text-4 font-[var(--font-weight-bold)] leading-[26px] tracking-normal">
            국가장학금 2차 신청
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-4 font-[var(--font-weight-bold)] tracking-normal text-fg-1">월 30만 원</p>
            <p className="text-1 text-fg-3">생활비 지원 가능</p>
          </div>
        </section>

        <section className="mt-3 rounded-4 bg-state-eligible-bg p-3 text-state-eligible-fg">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} strokeWidth={1.75} aria-hidden />
            <h4 className="text-3 font-[var(--font-weight-bold)]">자격 충족</h4>
          </div>
          <p className="mt-2 text-1 leading-[16px] text-fg-2">
            재학생, 소득 구간, 이수 학점이 입력하신 프로필과 일치해요.
          </p>
        </section>

        <section className="border-b border-line-2 py-3">
          <div className="mb-3 flex items-center gap-2">
            <Info size={16} strokeWidth={1.75} className="text-brand-text" aria-hidden />
            <h4 className="text-3 font-[var(--font-weight-bold)]">판단 기준</h4>
          </div>
          <div className="grid gap-2">
            {trustFacts.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[72px_minmax(0,1fr)] gap-2 text-1">
                <span className="text-fg-3">{label}</span>
                <span className="font-[var(--font-weight-medium)] text-fg-1">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-3">
          <div className="mb-3 flex items-baseline justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">지원 체크리스트</h4>
            <span className="text-1 text-fg-3">1/3 완료</span>
          </div>
          <div>
            {checklist.map(([title, desc, state]) => (
              <div key={title} className="grid min-h-[48px] grid-cols-[24px_minmax(0,1fr)] gap-3 border-t border-line-2 py-2 first:border-t-0">
                <span className={state === "done" ? "pt-0.5 text-state-eligible-fg" : "pt-0.5 text-fg-3"}>
                  {state === "done" ? <CheckCircle2 size={20} strokeWidth={1.75} /> : <FileText size={20} strokeWidth={1.75} />}
                </span>
                <span>
                  <span className="block text-2 font-[var(--font-weight-bold)]">{title}</span>
                  <span className="block text-1 text-fg-3">{desc}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line-2 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-2 font-[var(--font-weight-bold)]">이 공지와 연결된 추천</h4>
            <span className="text-1 text-brand-text">4개</span>
          </div>
          <div className="space-y-2">
            {[
              ["공모전", "대학생 ESG 아이디어 공모전"],
              ["청년정책", "청년 자격증 응시료 지원"],
            ].map(([label, title]) => (
              <div key={title} className="grid min-h-[40px] grid-cols-[68px_minmax(0,1fr)_16px] items-center gap-2 rounded-4 border border-line-1 bg-surface px-3">
                <span className="rounded-pill bg-brand-tint px-2 py-1 text-center text-1 font-[var(--font-weight-bold)] text-brand-text">
                  {label}
                </span>
                <span className="truncate text-1 font-[var(--font-weight-medium)] text-fg-1">{title}</span>
                <ChevronRight size={14} strokeWidth={1.75} className="text-fg-3" aria-hidden />
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="grid grid-cols-[1fr_1.2fr] gap-2 border-t border-line-2 bg-surface px-[var(--screen-padding-x)] py-4">
        <button className="h-11 rounded-4 border border-line-1 text-2 font-[var(--font-weight-bold)] text-fg-2">원문 보기</button>
        <button className="h-11 rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">캘린더 추가</button>
      </div>
    </div>
  );
}

function ReminderScreen() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-page">
      <StatusBar />
      <div className="px-[var(--screen-padding-x)] pb-4 pt-4 opacity-45">
        <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">국가장학금 2차 신청</h3>
        <div className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <OpportunityCard item={opportunities[0]} compact />
        </div>
        <div className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <h4 className="text-3 font-[var(--font-weight-bold)]">제출 서류</h4>
          <div className="mt-3 space-y-2">
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine short />
          </div>
        </div>
      </div>

      <section className="absolute inset-x-0 bottom-0 rounded-t-[var(--bottom-sheet-radius-top)] border border-line-1 bg-surface px-[var(--bottom-sheet-padding-x)] pb-6 pt-3 shadow-pop">
        <div className="mx-auto h-1.5 w-[var(--bottom-sheet-handle-width)] rounded-pill bg-line-1" />
        <div className="mt-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-4 bg-state-calendar-bg text-state-calendar-fg">
            <CalendarPlus size={18} strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h3 className="text-4 font-[var(--font-weight-bold)] tracking-normal">언제 알려드릴까요?</h3>
            <p className="text-1 text-fg-3">마감과 서류 준비 일정을 나눠 저장해요.</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {reminderOptions.map(([label, time], index) => (
            <button
              key={label}
              className={[
                "grid min-h-[56px] w-full grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 rounded-4 border px-3 text-left",
                index === 1 ? toneClass.calendar : "border-line-2 bg-page text-fg-2",
              ].join(" ")}
            >
              <Clock3 size={18} strokeWidth={1.75} aria-hidden />
              <span className="text-2 font-[var(--font-weight-bold)]">{label}</span>
              <span className="text-1">{time}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function RecommendationScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div>
          <p className="text-1 text-fg-3">국가장학금 상세 아래</p>
          <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">같이 볼 기회</h3>
          <p className="mt-1 text-1 text-fg-3">광고가 아니라 현재 공지와 이어지는 추천이에요.</p>
        </div>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-4 bg-brand-tint text-brand-text">
              <Trophy size={16} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <h4 className="text-3 font-[var(--font-weight-bold)]">비슷한 공모전</h4>
              <p className="text-1 text-fg-3">카테고리와 키워드가 겹쳐요.</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {contestRecommendations.slice(0, 2).map(([title, reason, dday], index) => (
              <div key={title} className="rounded-4 border border-line-2 bg-page p-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-2 font-[var(--font-weight-bold)] text-fg-1">{title}</p>
                    <p className="mt-1 line-clamp-2 text-1 leading-[16px] text-fg-3">{reason}</p>
                  </div>
                  <span className={["shrink-0 rounded-pill border px-2 py-1 text-1 font-[var(--font-weight-bold)]", index === 0 ? toneClass.due : toneClass.saved].join(" ")}>
                    {dday}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                  <button className="h-8 rounded-3 border border-line-1 bg-surface text-1 font-[var(--font-weight-bold)] text-fg-2">캘린더</button>
                  <button className="grid h-8 w-8 place-items-center rounded-3 bg-brand text-fg-on-brand">
                    <ExternalLink size={14} strokeWidth={1.75} aria-label="공모전 열기" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-3 rounded-5 border border-brand-line bg-brand-tint p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-4 bg-surface text-brand-text">
              <WalletCards size={16} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <h4 className="text-3 font-[var(--font-weight-bold)]">청년정책 추천</h4>
              <p className="text-1 text-fg-3">생활비와 취업 준비를 같이 봐요.</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {policyRecommendations.map(([title, reason, benefit]) => (
              <div key={title} className="rounded-4 bg-surface p-2.5 shadow-flat">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-2 font-[var(--font-weight-bold)] text-fg-1">{title}</p>
                    <p className="mt-1 line-clamp-1 text-1 text-fg-3">{reason}</p>
                  </div>
                  <span className="shrink-0 text-1 font-[var(--font-weight-bold)] text-brand-text">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomNav active="탐색" />
    </div>
  );
}

function LowConfidenceScreen() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-page">
      <StatusBar />
      <div className="px-[var(--screen-padding-x)] pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-1 text-fg-3">확인 필요</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">정보가 조금 더 필요해요</h3>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-4 bg-state-unknown-bg text-state-unknown-fg">
            <AlertCircle size={18} strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <section className="mt-4 rounded-5 border border-state-unknown-line bg-state-unknown-bg p-4 text-state-unknown-fg">
          <p className="text-1 font-[var(--font-weight-bold)]">저신뢰 추출</p>
          <h4 className="mt-1 text-4 font-[var(--font-weight-bold)] tracking-normal text-fg-1">
            글로벌 챌린지 프로그램
          </h4>
          <p className="mt-2 text-1 leading-[16px] text-fg-2">
            원문은 보존했지만 마감과 자격 일부는 확인이 필요해요. 불확실한 항목을 숨기지 않습니다.
          </p>
        </section>

        <div className="mt-4 space-y-2">
          {lowConfidenceItems.map(([label, value, action]) => (
            <div key={label} className="rounded-5 border border-line-1 bg-surface p-3 shadow-flat">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-2 font-[var(--font-weight-bold)] text-fg-1">{label}</p>
                  <p className="mt-1 line-clamp-2 text-1 leading-[16px] text-fg-3">{value}</p>
                </div>
                <button className="shrink-0 rounded-pill border border-line-1 px-2.5 py-1 text-1 font-[var(--font-weight-bold)] text-fg-2">
                  {action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="absolute inset-x-0 bottom-0 rounded-t-[var(--bottom-sheet-radius-top)] border border-line-1 bg-surface px-[var(--bottom-sheet-padding-x)] pb-6 pt-3 shadow-pop">
        <div className="mx-auto h-1.5 w-[var(--bottom-sheet-handle-width)] rounded-pill bg-line-1" />
        <div className="mt-5 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-4 bg-brand-tint text-brand-text">
            <UserRound size={18} strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h4 className="text-4 font-[var(--font-weight-bold)] tracking-normal">어학 점수만 입력할까요?</h4>
            <p className="mt-1 text-1 leading-[16px] text-fg-3">이 항목 하나만 있으면 자격 상태를 다시 계산할 수 있어요.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_1.2fr] gap-2">
          <button className="h-11 rounded-4 border border-line-1 text-2 font-[var(--font-weight-bold)] text-fg-2">나중에</button>
          <button className="h-11 rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">입력하기</button>
        </div>
      </section>
    </div>
  );
}

function SavedScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-1 text-fg-3">내 기회</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">저장한 공지</h3>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-pill border border-line-1 bg-surface text-fg-2">
            <Filter size={17} strokeWidth={1.75} aria-label="필터" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-4 border border-line-1 bg-surface p-1">
          {["저장됨", "예정", "완료"].map((tab, index) => (
            <button
              key={tab}
              className={[
                "h-9 rounded-3 text-2 font-[var(--font-weight-bold)]",
                index === 1 ? "bg-brand text-fg-on-brand" : "text-fg-3",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">이번 주 일정</h4>
            <span className="text-1 text-brand-text">3개</span>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {["23", "24", "25", "26", "27"].map((date, index) => (
              <div
                key={date}
                className={[
                  "rounded-3 border p-2 text-center",
                  index === 2 ? toneClass.due : "border-line-2 bg-page text-fg-2",
                ].join(" ")}
              >
                <p className="text-1">6월</p>
                <p className="text-3 font-[var(--font-weight-bold)]">{date}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4 space-y-[var(--stack-gap)]">
          {savedRows.map(([state, title, dday, tone]) => (
            <div key={title} className="rounded-5 border border-line-1 bg-surface p-4 shadow-flat">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={["inline-flex rounded-pill border px-2.5 py-1 text-1 font-[var(--font-weight-bold)]", toneClass[tone as Tone]].join(" ")}>
                    {state}
                  </span>
                  <p className="mt-3 text-3 font-[var(--font-weight-bold)] tracking-normal">{title}</p>
                </div>
                <p className="text-dday text-[34px] text-fg-1">{dday}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="내 기회" />
    </div>
  );
}

function StateVariantsScreen() {
  return (
    <div className="flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-1 text-fg-3">상태 검증</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">상세 상태 3종</h3>
          </div>
          <span className="rounded-pill border border-line-1 bg-page px-3 py-1 text-1 text-fg-2">MVP 필수</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-4 border border-line-1 bg-page p-1">
          {["확인", "부족", "마감"].map((tab, index) => (
            <button
              key={tab}
              className={[
                "h-8 rounded-3 text-1 font-[var(--font-weight-bold)]",
                index === 0 ? "bg-surface text-brand-text shadow-flat" : "text-fg-3",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {detailVariants.map((variant) => (
            <section key={variant.title} className="border-b border-line-2 py-3 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={["inline-flex rounded-pill border px-2.5 py-1 text-1 font-[var(--font-weight-bold)]", toneClass[variant.tone as Tone]].join(" ")}>
                    {variant.state}
                  </span>
                  <h4 className="mt-2 line-clamp-2 text-2 font-[var(--font-weight-bold)] leading-[18px] tracking-normal">
                    {variant.title}
                  </h4>
                </div>
                <p className={["text-dday shrink-0 text-[26px] leading-none", variant.tone === "ineligible" ? "text-fg-3" : "text-state-due-fg"].join(" ")}>
                  {variant.dday}
                </p>
              </div>
              <p className="mt-2 line-clamp-2 text-1 leading-[16px] text-fg-2">{variant.cause}</p>
              <button
                className={[
                  "mt-2 h-8 w-full rounded-4 text-1 font-[var(--font-weight-bold)]",
                  variant.tone === "unknown" ? "bg-brand text-fg-on-brand" : "border border-line-1 text-fg-2",
                ].join(" ")}
              >
                {variant.action}
              </button>
            </section>
          ))}
        </div>
      </div>
      <BottomNav active="탐색" />
    </div>
  );
}

function PostApplyScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="rounded-5 border border-state-saved-line bg-state-saved-bg p-4 text-state-saved-fg">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-4 bg-surface">
              <CheckCircle2 size={18} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-1 font-[var(--font-weight-bold)]">신청 예정으로 저장됨</p>
              <h3 className="mt-1 text-4 font-[var(--font-weight-bold)] tracking-normal text-fg-1">
                국가장학금 2차 신청
              </h3>
              <p className="mt-1 text-1 text-fg-2">마감 전날과 서류 준비 알림이 같이 만들어졌어요.</p>
            </div>
          </div>
        </div>

        <section className="mt-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">다음 액션</h4>
            <span className="text-1 text-fg-3">2/3 완료</span>
          </div>
          <div>
            {postApplySteps.map(([label, value, state]) => (
              <div key={label} className="grid min-h-[58px] grid-cols-[24px_minmax(0,1fr)] gap-3 border-t border-line-2 py-3 first:border-t-0">
                <span className={state === "done" ? "pt-0.5 text-state-eligible-fg" : "pt-0.5 text-state-due-fg"}>
                  {state === "done" ? <CheckCircle2 size={19} strokeWidth={1.75} /> : <AlertCircle size={19} strokeWidth={1.75} />}
                </span>
                <span>
                  <span className="block text-2 font-[var(--font-weight-bold)]">{label}</span>
                  <span className="block text-1 text-fg-3">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-5 border border-line-1 bg-surface p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">이번 주 일정</h4>
            <span className="text-1 text-brand-text">6월 24일 알림</span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              ["6월 24일", "서류 준비 알림", "09:00"],
              ["6월 25일", "신청 마감", "18:00"],
            ].map(([date, label, time]) => (
              <div key={label} className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-4 bg-page px-3 py-3 text-1">
                <span className="font-[var(--font-weight-bold)] text-fg-1">{date}</span>
                <span className="min-w-0">
                  <span className="block truncate text-fg-2">{label}</span>
                  <span className="block text-state-due-fg">{time}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="h-11 rounded-4 border border-line-1 bg-surface text-2 font-[var(--font-weight-bold)] text-fg-2">내 기회 보기</button>
          <button className="h-11 rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">서류 체크</button>
        </div>
      </div>
      <BottomNav active="일정" />
    </div>
  );
}

function ProfileSettingsScreen() {
  const iconMap: Record<string, LucideIcon> = {
    school: School,
    user: UserRound,
    wallet: WalletCards,
    map: MapPin,
    sparkles: Sparkles,
  };

  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-1 text-fg-3">조건 관리</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">내 추천 기준</h3>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-pill border border-line-1 bg-surface text-fg-2">
            <Edit3 size={17} strokeWidth={1.75} aria-label="수정" />
          </button>
        </div>

        <section className="mt-4 border-y border-brand-line bg-brand-tint py-3">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-4 bg-surface text-brand-text">
              <ShieldCheck size={18} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-2 font-[var(--font-weight-bold)] text-brand-text">자격 판정에 쓰는 정보</p>
              <p className="mt-1 text-1 leading-[16px] text-fg-2">비어 있는 항목은 확인 필요 상태로 남겨요.</p>
            </div>
          </div>
        </section>

        <div className="mt-4 divide-y divide-line-2 rounded-5 border border-line-1 bg-surface">
          {profileSettings.map(([label, value, iconKey]) => {
            const Icon = iconMap[iconKey] ?? Info;
            return (
              <button key={label} className="grid min-h-[58px] w-full grid-cols-[32px_minmax(0,1fr)_18px] items-center gap-3 px-4 text-left">
                <span className="grid h-8 w-8 place-items-center rounded-3 bg-page text-brand-text">
                  <Icon size={16} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-1 text-fg-3">{label}</span>
                  <span className="block truncate text-2 font-[var(--font-weight-bold)] text-fg-1">{value}</span>
                </span>
                <ChevronRight size={15} strokeWidth={1.75} className="text-fg-3" aria-hidden />
              </button>
            );
          })}
        </div>

        <section className="mt-4 rounded-5 border border-state-unknown-line bg-state-unknown-bg p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-1 font-[var(--font-weight-bold)] text-state-unknown-fg">보완하면 좋아요</p>
              <h4 className="mt-1 text-3 font-[var(--font-weight-bold)] text-fg-1">어학 점수, 여권 만료일</h4>
              <p className="mt-1 text-1 leading-[16px] text-fg-2">해외연수 공지 2개가 확인 필요로 남아 있어요.</p>
            </div>
            <span className="rounded-pill border border-state-unknown-line bg-surface px-2 py-1 text-1 font-[var(--font-weight-bold)] text-state-unknown-fg">
              2개
            </span>
          </div>
        </section>
      </div>
      <div className="border-t border-line-2 bg-surface px-[var(--screen-padding-x)] py-4">
        <button className="h-11 w-full rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">
          조건 저장
        </button>
      </div>
    </div>
  );
}

function SearchFilterScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-1 text-fg-3">탐색</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">검색과 필터</h3>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-pill border border-line-1 bg-surface text-fg-2">
            <SlidersHorizontal size={17} strokeWidth={1.75} aria-label="필터" />
          </button>
        </div>

        <div className="mt-4 flex h-11 items-center gap-2 rounded-4 border border-line-1 bg-surface px-3 text-2 text-fg-3">
          <Search size={16} strokeWidth={1.75} aria-hidden />
          국가장학금, 인턴, 공모전 검색
        </div>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">정렬</h4>
            <span className="text-1 text-brand-text">마감순</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["마감순", "충족순", "최신순"].map((sort, index) => (
              <button
                key={sort}
                className={[
                  "h-9 rounded-3 border text-1 font-[var(--font-weight-bold)]",
                  index === 0 ? "border-brand bg-brand text-fg-on-brand" : "border-line-1 bg-page text-fg-2",
                ].join(" ")}
              >
                {sort}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 space-y-4">
          {filterGroups.map(([label, chips]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-2 font-[var(--font-weight-bold)]">{label}</h4>
                <span className="text-1 text-fg-3">다중 선택</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                  <span
                    key={chip}
                    className={[
                      "inline-flex h-8 items-center rounded-pill border px-3 text-1 font-[var(--font-weight-bold)]",
                      index < 2 ? "border-brand-line bg-brand-tint text-brand-text" : "border-line-1 bg-surface text-fg-2",
                    ].join(" ")}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-5 border border-state-calendar-line bg-state-calendar-bg p-4">
          <div className="flex items-start gap-3">
            <Bell size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-state-calendar-fg" aria-hidden />
            <div className="min-w-0">
              <p className="text-2 font-[var(--font-weight-bold)] text-fg-1">이 검색 저장</p>
              <p className="mt-1 text-1 leading-[16px] text-fg-2">장학 · 자격 충족 · 7일 이내 조건으로 새 공지가 뜨면 알려요.</p>
            </div>
          </div>
        </section>
      </div>
      <BottomNav active="탐색" />
    </div>
  );
}

function SourceChangeScreen() {
  return (
    <div className="flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-1 text-fg-3">원문과 변경 이력</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">신뢰 확인</h3>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-4 bg-brand-tint text-brand-text">
            <History size={18} strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <section className="mt-4 border-b border-line-2 pb-4">
          <p className="text-1 font-[var(--font-weight-bold)] uppercase tracking-normal text-fg-3">학교 장학팀 원문</p>
          <h4 className="mt-2 break-keep text-4 font-[var(--font-weight-bold)] leading-[26px]">
            국가장학금 2차 신청 및 가구원 정보 제공 동의 안내
          </h4>
          <div className="mt-3 grid grid-cols-[76px_minmax(0,1fr)] gap-y-2 text-1">
            <span className="text-fg-3">수집 시각</span>
            <span className="font-[var(--font-weight-bold)] text-fg-1">오늘 09:12</span>
            <span className="text-fg-3">추출 신뢰도</span>
            <span className="font-[var(--font-weight-bold)] text-state-eligible-fg">높음 · 92%</span>
            <span className="text-fg-3">첨부</span>
            <span className="font-[var(--font-weight-bold)] text-fg-1">PDF 2개, HWP 1개</span>
          </div>
        </section>

        <section className="border-b border-line-2 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">변경 감지</h4>
            <span className="rounded-pill border border-state-due-line bg-state-due-bg px-2 py-1 text-1 font-[var(--font-weight-bold)] text-state-due-fg">
              1건 중요
            </span>
          </div>
          <div className="space-y-2">
            {sourceEvents.map(([label, value, tone]) => (
              <div key={label} className="grid min-h-[52px] grid-cols-[76px_minmax(0,1fr)] items-center gap-3 rounded-4 bg-page px-3">
                <span className={["rounded-pill border px-2 py-1 text-center text-1 font-[var(--font-weight-bold)]", toneClass[tone as Tone]].join(" ")}>
                  {label}
                </span>
                <span className="line-clamp-2 text-1 leading-[16px] text-fg-2">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-4">
          <div className="flex items-center gap-2">
            <Link2 size={16} strokeWidth={1.75} className="text-brand-text" aria-hidden />
            <h4 className="text-3 font-[var(--font-weight-bold)]">원문 접근</h4>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="h-10 rounded-4 border border-line-1 bg-page text-1 font-[var(--font-weight-bold)] text-fg-2">공지 열기</button>
            <button className="h-10 rounded-4 border border-line-1 bg-page text-1 font-[var(--font-weight-bold)] text-fg-2">첨부 보기</button>
          </div>
        </section>
      </div>
      <div className="border-t border-line-2 bg-surface px-[var(--screen-padding-x)] py-4">
        <button className="h-11 w-full rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">
          변경된 마감으로 저장
        </button>
      </div>
    </div>
  );
}

function FeedbackScreen() {
  const iconMap: Record<string, LucideIcon> = {
    저장: Bookmark,
    숨김: EyeOff,
    관심없음: Trash2,
  };

  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div>
          <p className="text-1 text-fg-3">추천 품질</p>
          <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">피드백 반영</h3>
          <p className="mt-1 text-1 text-fg-3">저장, 숨김, 관심없음은 추천과 알림 후보에 반영돼요.</p>
        </div>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <OpportunityCard item={opportunities[4]} compact />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {feedbackActions.map(([label, desc, tone]) => {
              const Icon = iconMap[label] ?? Bookmark;
              return (
                <button key={label} className={["min-h-[84px] rounded-4 border p-2 text-left", toneClass[tone as Tone]].join(" ")}>
                  <Icon size={16} strokeWidth={1.75} aria-hidden />
                  <span className="mt-2 block text-1 font-[var(--font-weight-bold)]">{label}</span>
                  <span className="mt-1 block text-[10px] leading-[13px] text-fg-2">{desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 rounded-5 border border-brand-line bg-brand-tint p-4">
          <div className="flex items-start gap-3">
            <Sparkles size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-brand-text" aria-hidden />
            <div className="min-w-0">
              <p className="text-2 font-[var(--font-weight-bold)] text-brand-text">추천 이유</p>
              <p className="mt-1 text-1 leading-[16px] text-fg-2">취업 준비 관심사, 자격증 키워드, 최근 저장한 장학 공지와 연결돼요.</p>
            </div>
          </div>
        </section>

        <section className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">반영 후 피드</h4>
            <span className="text-1 text-brand-text">즉시 적용</span>
          </div>
          <div className="space-y-2">
            {[
              ["공모전 추천", "ESG, 포트폴리오 키워드는 유지"],
              ["청년정책 추천", "월세/생활비 정책은 낮은 우선순위"],
              ["마감 알림", "숨김 항목은 알림 후보에서 제외"],
            ].map(([label, value]) => (
              <div key={label} className="grid min-h-[44px] grid-cols-[84px_minmax(0,1fr)] items-center gap-3 border-b border-line-2 text-1 last:border-b-0">
                <span className="font-[var(--font-weight-bold)] text-fg-1">{label}</span>
                <span className="text-fg-3">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomNav active="홈" />
    </div>
  );
}

function ApplicationStatusScreen() {
  return (
    <div className="flex h-full flex-col bg-page">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-[var(--screen-padding-x)] pb-5 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-1 text-fg-3">신청 관리</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">국가장학금 준비중</h3>
          </div>
          <span className="rounded-pill border border-state-planned-line bg-state-planned-bg px-3 py-1 text-1 font-[var(--font-weight-bold)] text-state-planned-fg">
            D-2
          </span>
        </div>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">상태</h4>
            <span className="text-1 text-brand-text">2단계</span>
          </div>
          <div className="space-y-3">
            {applicationStatusRows.map(([label, value, state], index) => (
              <div key={label} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
                <span
                  className={[
                    "mt-0.5 grid h-6 w-6 place-items-center rounded-pill border text-[10px] font-[var(--font-weight-bold)]",
                    state === "done"
                      ? "border-state-eligible-line bg-state-eligible-bg text-state-eligible-fg"
                      : state === "active"
                        ? "border-brand bg-brand text-fg-on-brand"
                        : "border-line-1 bg-page text-fg-3",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 border-b border-line-2 pb-3 last:border-b-0">
                  <span className="block text-2 font-[var(--font-weight-bold)] text-fg-1">{label}</span>
                  <span className="block text-1 text-fg-3">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-3 font-[var(--font-weight-bold)]">서류</h4>
            <span className="text-1 text-fg-3">1/3 업로드</span>
          </div>
          <div className="space-y-2">
            {[
              ["재학증명서", "업로드 완료", "done"],
              ["성적증명서", "PDF 필요", "todo"],
              ["가구원 동의서", "원문 첨부에서 확인", "todo"],
            ].map(([label, value, state]) => (
              <div key={label} className="grid min-h-[46px] grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-4 bg-page px-3">
                {state === "done" ? (
                  <CheckCircle2 size={18} strokeWidth={1.75} className="text-state-eligible-fg" aria-hidden />
                ) : (
                  <FileUp size={18} strokeWidth={1.75} className="text-fg-3" aria-hidden />
                )}
                <span className="min-w-0">
                  <span className="block truncate text-2 font-[var(--font-weight-bold)] text-fg-1">{label}</span>
                  <span className="block text-1 text-fg-3">{value}</span>
                </span>
                <ChevronRight size={14} strokeWidth={1.75} className="text-fg-3" aria-hidden />
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="grid grid-cols-[1fr_1.2fr] gap-2 border-t border-line-2 bg-surface px-[var(--screen-padding-x)] py-4">
        <button className="h-11 rounded-4 border border-line-1 text-2 font-[var(--font-weight-bold)] text-fg-2">상태 변경</button>
        <button className="h-11 rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">서류 추가</button>
      </div>
    </div>
  );
}

function ShareSummaryScreen() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-page">
      <StatusBar />
      <div className="px-[var(--screen-padding-x)] pb-4 pt-3 opacity-85">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-1 text-fg-3">공유</p>
            <h3 className="text-5 font-[var(--font-weight-bold)] tracking-normal">요약 만들기</h3>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-4 bg-brand-tint text-brand-text">
            <Share2 size={18} strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <section className="mt-4 rounded-5 border border-line-1 bg-surface p-4 shadow-flat">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={["inline-flex rounded-pill border px-2.5 py-1 text-1 font-[var(--font-weight-bold)]", toneClass.eligible].join(" ")}>
                자격 충족
              </span>
              <h4 className="mt-3 break-keep text-4 font-[var(--font-weight-bold)] leading-[26px]">
                국가장학금 2차 신청
              </h4>
              <p className="mt-1 text-1 text-fg-3">마감 6월 25일 18:00 · 월 30만 원</p>
            </div>
            <p className="text-dday text-[34px] text-state-due-fg">D-2</p>
          </div>
          <div className="mt-4 rounded-4 bg-page p-3 text-1 leading-[16px] text-fg-2">
            재학생, 소득 구간, 이수 학점 조건이 맞습니다. 원문과 첨부 링크를 같이 확인하세요.
          </div>
        </section>
      </div>

      <section className="absolute inset-x-0 bottom-0 rounded-t-[var(--bottom-sheet-radius-top)] border border-line-1 bg-surface px-[var(--bottom-sheet-padding-x)] pb-6 pt-3 shadow-pop">
        <div className="mx-auto h-1.5 w-[var(--bottom-sheet-handle-width)] rounded-pill bg-line-1" />
        <div className="mt-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-4 bg-brand-tint text-brand-text">
            <MessageSquare size={18} strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h4 className="text-4 font-[var(--font-weight-bold)] tracking-normal">공유 범위</h4>
            <p className="text-1 text-fg-3">개인 조건은 공유하지 않아요.</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {shareRows.map(([label, value], index) => (
            <button
              key={label}
              className={[
                "grid min-h-[48px] w-full grid-cols-[24px_minmax(0,1fr)_18px] items-center gap-3 rounded-4 border px-3 text-left",
                index === 0 ? toneClass.calendar : "border-line-2 bg-page text-fg-2",
              ].join(" ")}
            >
              {index === 0 ? <Link2 size={17} strokeWidth={1.75} aria-hidden /> : <Share2 size={17} strokeWidth={1.75} aria-hidden />}
              <span className="min-w-0">
                <span className="block text-2 font-[var(--font-weight-bold)]">{label}</span>
                <span className="block truncate text-1 text-fg-3">{value}</span>
              </span>
              <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SelectRow({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <button className="grid min-h-[64px] w-full grid-cols-[36px_minmax(0,1fr)_20px] items-center gap-3 rounded-5 border border-line-1 bg-page px-4 text-left">
      <span className="grid h-9 w-9 place-items-center rounded-4 bg-surface text-brand-text">
        <Icon size={17} strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-1 text-fg-3">{label}</span>
        <span className="block truncate text-2 font-[var(--font-weight-bold)] text-fg-1">{value}</span>
      </span>
      <ChevronRight size={16} strokeWidth={1.75} className="text-fg-3" aria-hidden />
    </button>
  );
}

function OpportunityCard({ item, compact = false }: { item: (typeof opportunities)[number]; compact?: boolean }) {
  const tone = item.tone as Tone;
  return (
    <article
      className="rounded-[var(--notice-card-radius)] border border-line-1 bg-surface shadow-flat"
      style={{
        padding: compact ? "0" : "var(--notice-card-padding-y) var(--notice-card-padding-x)",
      }}
    >
      <div className={compact ? "p-0" : ""}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-pill border border-line-2 bg-page px-2 py-1 text-1 font-[var(--font-weight-bold)] text-fg-2">
                {item.category}
              </span>
              <span className="rounded-pill border border-line-2 bg-page px-2 py-1 text-1 text-fg-3">
                {item.source}
              </span>
              <span className={["rounded-pill border px-2 py-1 text-1 font-[var(--font-weight-bold)]", toneClass[tone]].join(" ")}>
                {item.state}
              </span>
            </div>
            <h4 className="mt-3 line-clamp-2 text-3 font-[var(--font-weight-bold)] tracking-normal">{item.title}</h4>
            <p className="mt-1 text-2 font-[var(--font-weight-bold)] text-fg-1">{item.amount}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-dday text-[var(--dday-size-card)] text-state-due-fg">{item.dday}</p>
          </div>
        </div>
        <p className="mt-3 text-1 text-fg-3">{item.reason}</p>
        {!compact && (
          <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-2">
            <button className="h-10 rounded-4 bg-brand text-2 font-[var(--font-weight-bold)] text-fg-on-brand">캘린더 추가</button>
            <button className="grid h-10 w-10 place-items-center rounded-4 border border-line-1 text-brand-text">
              <Bookmark size={16} strokeWidth={1.75} aria-label="저장" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function CompactOpportunityRow({ item }: { item: (typeof opportunities)[number] }) {
  const tone = item.tone as Tone;
  return (
    <button className="grid min-h-[64px] w-full grid-cols-[minmax(0,1fr)_52px] items-center gap-3 rounded-4 border border-line-1 bg-surface px-3 py-2 text-left shadow-flat">
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className={["rounded-pill border px-2 py-0.5 text-1 font-[var(--font-weight-bold)]", toneClass[tone]].join(" ")}>
            {item.state}
          </span>
          <span className="truncate text-1 text-fg-3">{item.category}</span>
        </span>
        <span className="mt-1 block truncate text-2 font-[var(--font-weight-bold)] text-fg-1">{item.title}</span>
      </span>
      <span className="text-right">
        <span className="block text-dday text-[22px] leading-none text-state-due-fg">{item.dday}</span>
        <span className="block truncate text-1 text-fg-3">{item.amount}</span>
      </span>
    </button>
  );
}

function MiniState({ Icon, label, value, tone }: { Icon: LucideIcon; label: string; value: string; tone: Tone }) {
  return (
    <div className={["rounded-4 border p-3", toneClass[tone]].join(" ")}>
      <Icon size={17} strokeWidth={1.75} aria-hidden />
      <p className="mt-2 text-1">{label}</p>
      <p className="text-3 font-[var(--font-weight-bold)]">{value}</p>
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const items: Array<[string, LucideIcon]> = [
    ["홈", Home],
    ["탐색", Search],
    ["일정", CalendarCheck],
    ["내 기회", FileCheck2],
  ];
  return (
    <nav className="grid h-[var(--bottom-nav-height)] grid-cols-4 border-t border-line-2 bg-surface px-2">
      {items.map(([label, Icon]) => {
        const isActive = active === label;
        return (
          <button
            key={label}
            className={["flex flex-col items-center justify-center gap-1 rounded-4 text-1 font-[var(--font-weight-bold)]", isActive ? "text-brand-text" : "text-fg-3"].join(" ")}
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

function SkeletonLine({ short = false }: { short?: boolean }) {
  return <div className={["h-3 rounded-pill bg-sunken", short ? "w-2/3" : "w-full"].join(" ")} />;
}

function _ReferenceAtoms() {
  return (
    <div className="hidden">
      <MiniState Icon={Info} label="확인" value="1" tone="unknown" />
      <MiniState Icon={AlertCircle} label="부족" value="1" tone="insufficient" />
      <MiniState Icon={ListChecks} label="예정" value="2" tone="planned" />
    </div>
  );
}
