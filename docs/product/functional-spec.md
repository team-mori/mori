# MORI Functional Spec

## 1. Scope

This document defines the product behavior required before drawing or revising the MVP wireframe.

Primary scope:

- MVP1 student mobile product.

Secondary scope:

- MVP2 department dashboard, documented only as downstream context.

## 2. Feature Matrix

| ID | Feature | Priority | Persona | Input | Processing | Output |
| --- | --- | --- | --- | --- | --- | --- |
| ING-01 | School notice source registry | P0 | system | source name, URL, category, selector config | validate source and crawl policy | enabled source list |
| ING-02 | Notice crawling | P0 | system | public school notice pages | fetch list/detail pages, preserve original URL | raw notice records |
| ING-03 | Notice extraction | P0 | system | raw notice body and attachments | extract title, deadline, audience, documents, category | normalized `Notice` |
| ING-04 | Crawl status | P0 | system/admin | crawl run result | classify success, partial, failed | source health state |
| ING-05 | Duplicate detection | P1 | system | normalized notice fields | compare URL, title, source, deadline | merged or flagged duplicate |
| CARD-01 | Action card conversion | P0 | student | normalized notice | summarize, select key fields, map status | `ActionCard` |
| CARD-02 | Deadline display | P0 | student | deadline and current date | calculate D-day and urgency | D-day label and ordering |
| CARD-03 | Required documents | P0 | student | notice body and attachments | extract document checklist | card/detail document list |
| CARD-04 | Original notice link | P0 | student | source URL | preserve canonical link | external verification action |
| FIT-01 | Minimal student profile | P0 | student | school, status, grade, major, interests | store profile locally or in account state | matchable profile |
| FIT-02 | Eligibility matching | P0 | student | profile and requirements | classify fit, gap, unknown, unfit | `MatchResult` |
| FIT-03 | Progressive profile prompt | P1 | student | unknown requirement field | ask only one needed field | updated profile field |
| FIT-04 | Gap explanation | P0 | student | failed or missing requirements | convert into calm next-action copy | gap list |
| CAL-01 | ICS export | P0 | student | opportunity deadline | generate `.ics` event | downloadable calendar file |
| CAL-02 | Google Calendar add | P0 | student | event title, date, URL | build calendar URL | external calendar action |
| CAL-03 | Saved state | P0 | student | calendar action or intent | persist saved/interested/applied state | card state badge |
| REC-01 | Similar contest recommendation | P0 | student | opportunity category, keywords, profile | match against curated or live contest pool | recommendation cards |
| REC-02 | Youth policy recommendation | P0 | student | profile and opportunity context | match against curated or live policy pool | policy cards |
| REC-03 | Recommendation reason | P0 | student | matched recommendation | generate reason and confidence | "why this appears" copy |
| SUB-01 | Category subscription | P0 | student | selected categories | filter and rank feed | personalized feed |
| LOSS-01 | Opportunity loss signal | P2 | student/system | dismissed, expired, saved, applied states | classify missed opportunity reason | future reflection data |
| DEPT-01 | Department dashboard | MVP2 | department | anonymous event aggregates | calculate funnel and trends | dashboard KPIs |
| DEPT-02 | Small-count masking | MVP2 | department | aggregate metrics | mask groups below 5 | privacy-safe metrics |
| DEPT-03 | Notice performance detail | MVP2 | department | notice-level aggregates | show drop-off and segments | performance detail |

## 3. Student MVP Behavior

### 3.1 Feed

The feed is deadline-first.

Required:

- category chips: all, scholarship, extracurricular, career, contest, youth policy,
- status chips: urgent, fit, needs info, saved,
- active opportunities sorted by deadline,
- expired opportunities visually de-emphasized and placed after active opportunities,
- original source always recoverable from detail.

### 3.2 Action Card

Each card must include:

- D-day,
- title,
- source,
- category,
- short summary,
- eligibility state,
- required documents summary,
- primary action.

Primary action order:

1. save to calendar,
2. mark as interested,
3. view original notice.

### 3.3 Detail

The detail page must include:

- deadline hero,
- benefit or opportunity value,
- summary,
- eligibility explanation,
- required documents,
- application URL or original notice URL,
- contest recommendations,
- youth policy recommendations.

The recommendation section should not look like unrelated ads. Each item needs a reason.

### 3.4 Calendar

Calendar actions must support:

- `.ics` generation,
- Google Calendar URL generation,
- saved state feedback,
- safe fallback when deadline confidence is low.

If deadline confidence is low, the UI must show "확인 필요" and keep the original notice link near the calendar action.

### 3.5 Eligibility

Eligibility copy rules:

- `fit`: "조건이 맞을 가능성이 높아요."
- `gap`: "이 항목만 확인하면 가능성이 있어요."
- `unknown`: "확인을 위해 정보가 조금 더 필요해요."
- `unfit`: "현재 입력 정보 기준으로는 대상이 아닐 수 있어요."

Never use red for unfit.

## 4. Recommendation Behavior

### 4.1 Similar Contest Recommendation

Inputs:

- category,
- title keywords,
- source type,
- profile interests,
- deadline window.

Outputs:

- title,
- provider,
- deadline,
- reason,
- confidence,
- original URL.

MVP1 can use static seed data, but the interface must not assume static data forever.

### 4.2 Youth Policy Recommendation

Inputs:

- age or student status when available,
- region when available,
- school or department context,
- current opportunity category.

Outputs:

- policy title,
- institution,
- benefit,
- deadline or always-on status,
- reason,
- original URL.

## 5. Ingestion Behavior

The crawler and parser must separate raw collection from student-facing rendering.

Pipeline:

1. Source config.
2. Crawl list page.
3. Crawl detail page.
4. Extract normalized fields.
5. Convert to opportunity.
6. Convert to action card.
7. Render in student feed.

Failure handling:

- If list crawl fails: source health is failed.
- If detail crawl partially succeeds: notice is partial.
- If deadline extraction is uncertain: action card is shown with confirmation needed.
- If original URL exists: the card can still be shown with a warning.

## 6. MVP2 Department Behavior

Department screens are not MVP1 wireframe blockers, but the data contract should be preserved.

MVP2 metrics:

- published,
- reached,
- viewed,
- calendar saved,
- interested,
- applied,
- expired without action.

Privacy:

- no student-level export,
- no personally identifiable detail,
- `<5` masking for small aggregates,
- sensitive fields never shown to departments.

## 7. States

### Loading

- feed skeleton,
- card skeleton,
- recommendation skeleton.

### Empty

- no subscribed category result,
- no matching recommendations,
- no active deadline.

### Error

- crawl failed,
- calendar export failed,
- original source unavailable,
- recommendation unavailable.

### Low Confidence

- deadline uncertain,
- eligibility uncertain,
- source partially parsed.

Low-confidence states must preserve user trust by showing source and reason.

## 8. Acceptance Criteria

MVP1 wireframe is ready only when it shows:

- a student feed with crawled school notice cards,
- card detail with eligibility and document checklist,
- calendar save action,
- similar contest recommendation,
- youth policy recommendation,
- progressive profile or "needs info" state,
- low-confidence/original-link fallback state.

MVP2 wireframe can be deferred until the student flow is accepted.
