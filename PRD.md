# MORI PRD

## 1. Product Summary

MORI is a student-first opportunity reminder service. It turns scattered school notices, external contests, and youth policy programs into actionable cards that show deadline, eligibility, required documents, and next action.

The first MVP focuses on the student mobile experience. Department analytics and operator dashboards are intentionally moved to MVP2.

## 2. Problem

Students miss opportunities because school notices are fragmented across scholarship, extracurricular, career, and department boards. Even when students find a notice, they still need to understand whether they are eligible, what documents are required, when the deadline is, and whether they should add it to a calendar.

Schools and public institutions already publish useful opportunities, but the burden of discovery and interpretation is on students. MORI reduces that burden by collecting notices, converting them into structured cards, and recommending related opportunities that students would not have searched for directly.

## 3. Target Users

### Student

- Mobile-first user.
- Wants scholarships, extracurricular programs, internships, contests, and youth policy benefits.
- Does not check multiple boards every day.
- Needs calm, practical guidance rather than pressure.

### Department Operator, MVP2

- Desktop-first user.
- Needs anonymized engagement data after the student product proves usage.
- Must never receive student-level identifiable data.

## 4. MVP Strategy

### MVP1: Student Mobile

MVP1 must answer four questions for a student:

1. What opportunities are available to me now?
2. Am I likely eligible?
3. What do I need to do before the deadline?
4. What similar opportunities should I also consider?

### MVP2: Department Dashboard

MVP2 adds anonymous reporting for school departments:

- notice reach,
- card views,
- calendar saves,
- application intent,
- completion signals,
- aggregate segment insights with small-count masking.

## 5. Core Feature Set

### F1. School Notice Ingestion

MORI collects public school notices from configured sources.

Initial source categories:

- scholarship,
- extracurricular,
- career and internship,
- department career support,
- academic notices.

Required behavior:

- crawl public pages only,
- preserve original URL,
- extract title, source, category, posted date, deadline, body, attachments, and target audience,
- detect duplicate notices,
- keep crawl status as success, partial, or failed,
- mark low-confidence extracted fields as confirmation needed.

### F2. Action Card Conversion

Each notice becomes a student-facing action card.

The card must show:

- D-day,
- category,
- source,
- short summary,
- eligibility status,
- required documents,
- benefit or reward,
- primary action,
- original notice link.

Eligibility states:

- fit: likely eligible,
- gap: eligible after filling missing requirement,
- unknown: more profile information needed,
- unfit: likely not eligible.

The UI must avoid harsh rejection language. Unknown must not be treated as unfit.

### F3. Calendar Save

Students can save an opportunity deadline to their calendar.

MVP1 behavior:

- generate `.ics`,
- expose Google Calendar add URL where possible,
- store local application intent state in UI,
- show saved state on the card and detail page.

### F4. Similar Contest Recommendation

MORI recommends related contests and external programs based on the notice category, keywords, eligibility, and deadline window.

Examples:

- school startup program -> external startup contest,
- career mentoring notice -> internship or employment bootcamp,
- extracurricular certificate program -> related public contest.

MVP1 may use curated/mock recommendation pools if live external crawling is not ready. The product contract must still separate recommendation source, reason, deadline, and confidence.

### F5. Youth Policy Recommendation

MORI recommends youth policies that match student profile and opportunity context.

Examples:

- scholarship notice -> living expense or education support policy,
- internship notice -> youth employment support policy,
- startup notice -> youth founder support program.

MVP1 may start with curated policy data, but the card model must support future public-policy ingestion.

### F6. Category Subscription

Students choose interest categories so the feed is not a generic notice dump.

Initial categories:

- scholarship,
- extracurricular,
- career,
- contest,
- youth policy.

### F7. Student Profile and Eligibility Fit

MORI uses a lightweight student profile to judge fit.

MVP1 profile fields:

- school,
- enrollment status,
- grade,
- department or major,
- interest categories.

Optional progressive fields:

- GPA range,
- income bracket,
- completed credits,
- language score,
- certificate,
- prior activity.

MORI should ask for optional fields only when a specific opportunity needs them.

### F8. Gap Explanation

When a student is not fully eligible, MORI explains the gap as a next action, not as failure.

Examples:

- "현재 학년 정보가 필요해요."
- "어학 점수 조건을 확인해야 해요."
- "이 공지는 3학년 이상 대상일 가능성이 높아요."

### F9. Opportunity Loss Reflection

MORI records why an opportunity was missed when possible:

- eligible but not saved,
- saved but not applied,
- unknown eligibility,
- unfit at the time,
- deadline passed before discovery.

This is not MVP1 UI-heavy. It is a data contract for later reminders and MVP2 analytics.

### F10. Department Analytics, MVP2

MVP2 provides anonymized department analytics:

- funnel: published -> reached -> viewed -> saved -> intent -> completed,
- category performance,
- deadline drop-off,
- aggregate segment insights,
- `<5` masking for small groups,
- no student-level export.

## 6. MVP1 User Flow

1. Student opens MORI on mobile.
2. Student selects interest categories and minimal profile fields.
3. MORI shows a deadline-first opportunity feed.
4. Student opens a card detail page.
5. MORI shows summary, deadline, documents, eligibility fit, and gaps.
6. Student saves the deadline to calendar or marks it as interested.
7. MORI shows related contests and youth policies below the detail.
8. Student can open original notice for final verification.

## 7. Screens

### MVP1 Screens

- Student onboarding.
- Student home feed.
- Opportunity detail.
- Calendar save confirmation.
- Progressive profile prompt.
- Recommendation section for contests and youth policies.
- Empty, loading, error, and low-confidence states.

### MVP2 Screens

- Department dashboard.
- Notice performance detail.
- Segment insight view.
- Crawl/source health view.

## 8. Data Model

- `Notice`: crawled source notice.
- `Opportunity`: normalized student-facing opportunity.
- `ActionCard`: mobile UI card projection.
- `StudentProfile`: profile fields used for matching.
- `EligibilityRequirement`: structured requirement item.
- `MatchResult`: fit, gap, unknown, unfit, reasons, confidence.
- `CalendarEvent`: deadline event and export data.
- `Recommendation`: related contest or youth policy.
- `ApplicationIntent`: saved, interested, applied, dismissed.
- `CrawlRun`: source status and extraction quality.
- `DepartmentMetric`: MVP2 anonymous aggregate metric.

## 9. Success Metrics

### MVP1

- card view to detail open rate,
- detail open to calendar save rate,
- saved opportunity revisit rate,
- recommendation click rate,
- low-confidence field correction rate,
- progressive profile completion rate.

### MVP2

- department dashboard weekly active use,
- notice funnel coverage,
- masked aggregate compliance,
- source crawl success rate.

## 10. Scope Out

MVP1 excludes:

- payment,
- mobile native app,
- push notification,
- student identity verification,
- school SSO,
- full department dashboard,
- dark mode,
- student-level department export.

## 11. Product Principles

- Deadline is the visual anchor.
- Eligibility is guidance, not judgment.
- Calendar save is the primary action.
- Original notice must remain accessible.
- Recommendations must explain why they appear.
- Red is not used for pressure or failure.
- Department-facing data is aggregate only.
