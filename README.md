# 모리 (MORI) — 데모 v1

대학 공지(장학·비교과·취업)를 액션카드로 변환하고, 학교 부서에는 공지 운영 데이터를 돌려주는 웹 SaaS의 1주짜리 데모.

## 구성

```
mori/
├── frontend/         Next.js 14 + Tailwind + shadcn 풍 컴포넌트
├── backend/          Python 크롤러 (BeautifulSoup) + Claude LLM 변환
├── supabase/         DB 마이그레이션 SQL
└── .github/workflows 1일 1회 cron
```

## 빠른 시작

### 1) Supabase 준비
1. supabase.com에서 프로젝트 생성
2. SQL Editor → `supabase/migrations/0001_init.sql` 붙여넣고 실행
3. 프로젝트 URL과 service_role 키, anon 키 확보

### 2) Frontend
```bash
cd frontend
cp .env.local.example .env.local   # 값 채우기
npm install
npm run dev
# → http://localhost:3000
```

> **Supabase 환경변수가 비어 있어도 동작합니다.** API 라우트가 `frontend/lib/mock/notices.ts`의 데모 데이터로 fallback합니다.

### 3) Backend (크롤러 + LLM 변환)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # 값 채우기

python crawl.py      # 게시판에서 공지 수집 → notices INSERT
python process.py    # llm_processed=false 인 row → Claude로 6필드 추출
```

> `crawlers/*.py` 의 `LIST_URLS`는 추정값입니다. 실제 게시판 URL 확인 후 교체하면 [BaseCrawler](backend/crawlers/base.py)의 일반 패턴 매칭으로 대부분의 한국 대학 게시판이 그대로 동작합니다 (`?bbsId=...&nttId=...`, `/view/{id}` 등).

### 4) Vercel 배포
- 루트 디렉토리: `frontend/`
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### 5) GitHub Actions cron
Repo Settings → Secrets에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` 등록.
`.github/workflows/crawl.yml` 이 매일 06:00 KST에 자동 실행됩니다.

## 화면

- `/` — 랜딩 (사전 등록 폼)
- `/demo/student` — 학생용 (카테고리 탭, 액션카드, .ics 다운로드, 신청 토글, 회고 모달)
- `/demo/department` — 부서용 어드민 (도달률·열람·캘린더 연동률·퍼널)

## 정확도

**현재 마감일 추출 정확도: 100% (정규식만으로 50/50)**
- 표본: N=50 ([backend/eval/samples.json](backend/eval/samples.json))
- 측정일: 2026-04-27
- 방법: `cd backend && python eval/measure_accuracy.py`
- 비고: LLM fallback은 정규식 실패 시에만 호출 (비용 절감). 현재 표본은 텍스트만 평가하며, 실제 HTML 본문에서의 정확도는 크롤러 셀렉터 안정화 이후 재측정 필요.

## API

| Method | Path | 설명 |
| --- | --- | --- |
| GET | `/api/notices` | 전체 공지 (Supabase 비었으면 mock) |
| GET | `/api/notices/[id]/ics` | iCal 파일 다운로드 |
| GET / POST | `/api/status` | 데모 학생의 신청 상태 |
| GET / POST | `/api/subscribe` | 사전 등록 |

## 데모용 단일 학생

`/demo/student`은 인증 없이 단일 가짜 사용자(`DEMO_USER_ID`)의 상태를 읽고 씁니다. 실제 인증은 추후 매직 링크로 추가.
