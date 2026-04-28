# 모리 (MORI) — 프로젝트 컨텍스트

## 한 줄 정의
모리("모두의 리마인더")는 학생의 자격을 이해해 교내 공지부터 외부 공모전·청년정책까지 한 흐름으로 매칭·일정화하고, 학교 부서에는 그 행동 데이터를 처음으로 돌려주는 학생 기회 매칭 인프라.

## 핵심 사용자 (듀얼 페르소나)
1. 학생 (B2C, 모바일 우선): 자격이 되는지 몰라 미루다 마감을 놓치는 대학생.
2. 학교 부서 (B2B, 데스크톱): 장학팀·비교과센터·경력개발지원단. 공지 후 학생 행동을 처음으로 측정하는 운영자.

## 6대 핵심 기능
1. 카테고리 구독 (장학·비교과·취업)
2. 액션카드 변환 (요약 + 자격 + 서류 + 캘린더)
3. 마감일 자동 추출 + 캘린더 연동 (Google Calendar API + .ics)
4. **자격 핏(Fit)·갭(Gap) 진단 엔진** — 모리의 핵심 차별점
   - Fit: 학적·GPA·이수·소득분위·어학·자격증·이력 ↔ 공지 자격 요건 자동 매칭
   - Gap: 부족 요건 구체 표시 + 갭 채움 활동 추천
5. 기회 손실 회고 (자격 충족 미신청 / 자격 부족 미인지 분리)
6. 외부 기회 연결 (K-Startup·청년정책·외부 공모전 자동 추천)

## 기술 스택 (현재 단계 확정 / 미래 확장 분리)
- **Phase 1 (현재 / 12주 MVP)**
  - Frontend: Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui
  - Backend: Next.js API Routes (서버리스 자동) + Python 크롤러 (GitHub Actions 크론)
  - DB: Supabase PostgreSQL
  - LLM: Anthropic Claude API (액션카드 변환·자격 추출)
  - 인증: 이메일 매직링크
  - 배포: Vercel (FE+API), GitHub Actions (크롤러)
- **Phase 2 (트래픽 검증 후 이전)**
  - 백엔드 분리: FastAPI + AWS Lambda + Serverless Framework
  - 학교 SSO 도입
- **Phase 3**
  - 임베딩 기반 매칭 고도화, 외부 기회 풀(K-Startup·청년정책) 통합

## 디자인 원칙
- 톤: "조용히 신뢰감 있는 리마인더 도구". Linear · Toss · Notion 톤 참고.
- 색: 차분한 인디고/블루-그레이 베이스 + 의미 있는 강조색
  - 충족(fit) = 그린 / 임박(D-day≤3) = 앰버 / 미달(unfit) = 회색
  - **빨강 금지** (압박 효과보다 회피 효과가 더 큼)
- 한국어 UI 우선, Pretendard 폰트
- 핵심 컴포넌트: 리마인더 카드 (D-day 숫자가 시각적 주인공)
- 카피: 권유형·존댓말, 압박 금지, 자격 미달은 부드럽게

## 데이터 권한 원칙 (절대 위반 금지)
- robots.txt 준수, 공개 게시판 한정 수집
- 학교 SSO 기반 최소 수집, 민감 정보(GPA·소득분위)는 학생 자발 입력 + 암호화
- 부서 어드민에는 익명 집계만 노출, 개인 식별 정보 일체 미전달
- 5명 미만 집계 결과는 마스킹 (재식별 방지)
- 비공개 게시판은 부서 PoC·공식 협력 채널로만 접근

## 핵심 리스크 (코드 작성 시 항상 의식)
1. 게시판 구조 변경 → `backend/config/selectors.json` 외부화 + 매칭 실패율 모니터링
2. 자격 판정 오류(False Negative) → 신뢰도 점수 + "확인 필요" 라벨 + 학생이 결과 무시 가능
3. 온보딩 friction → 자격 정보 단계적 입력 (첫 사용 = 학적·전공·학년만, 매칭 막힐 때마다 1개씩 추가 유도)

## 코드 작성 규칙
- TypeScript strict 모드, `any` 금지
- 컴포넌트는 함수형 + Tailwind, shadcn/ui 우선 활용
- 한국어 주석 허용, **한국어 변수명 금지**
- 커밋 메시지: Conventional Commits (`feat:` / `fix:` / `refactor:` / `docs:`)
- 모든 PR 본문에 영향받는 페르소나(학생 / 부서) 명시

## 디렉터리 구조 (Phase 1 기준)
```
frontend/                 Next.js 14 (학생·부서 화면 + API)
  app/                    App Router 페이지 + API
  components/             ReminderCard 등 UI
  lib/types.ts            ActionCard / EligibilityRequirement / MatchResult / StudentProfile / GapItem
  lib/matcher/            자격 매칭 엔진 (Phase 2에서 추가)
  lib/parser/             액션카드 변환 룰베이스 부분
  lib/calendar/           Google API + .ics
backend/                  Python 크롤러
  config/selectors.json   게시판 셀렉터 (코드 변경 없이 수정 가능)
  crawlers/               게시판별 어댑터
  lib/                    LLM 호출, 마감일 정규식, Supabase 클라이언트
supabase/migrations/      DB 스키마
.github/workflows/        크롤러 + 액션카드 변환 크론
```

## "절대 만들지 말 것" (시간 낭비)
- 결제 / 유료 전환
- 다크모드 / 설정 페이지
- 본인 인증 / 학번 검증
- 푸시 알림 / 모바일 앱 (Phase 1 한정)

## 정확도 측정
- 마감일 추출: `backend/eval/measure_accuracy.py` (현재 N=50, 100%)
- 자격 매칭: Phase 2 추가 시 Fit/Gap/Unknown/Unfit 분류 정확도 측정 추가
