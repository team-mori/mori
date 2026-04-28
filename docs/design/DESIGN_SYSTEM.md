# 모리 (MORI) — Design System

> **모리 (MORI) — "모두의 리마인더"**
> *MOdu's Reminder.* A student-opportunity matching infrastructure.
> One quiet assistant for students; an analytics back-channel for school departments.

---

## What MORI is

MORI is a Korean campus SaaS that does two things at once for two audiences using the same platform:

- **For students** (mobile-first): turns scattered school notices — scholarships (장학), extracurricular (비교과), career (취업) — into **action cards** with a clear D-day, eligibility verdict, key amount, and one primary action. Plus 학생 outside opportunities (공모전, 청년정책).
- **For school departments** (desktop-first): scholarship team (장학복지팀), extracurricular center (비교과센터), career office (경력개발지원단) — gives them a dashboard of reach → open → calendar-sync → planning → completion that they have **never had before**.

The promise hidden in the name: chasing one student's deadlines isn't enough. Chase **every** student's **every** opportunity, and feed the school's notice performance back too.

### Brand mood

Korean-first UI. The tone is **"조용히 신뢰감 있는 비서"** — a quiet, trustworthy assistant. We lift the heaviness out of administrative notice copy without going as casual as 캠퍼스픽 or 에브리타임. Because the name *is* "Reminder," the metaphors that anchor the brand are everyday memory tools: clocks, checks, calendars, bookmarks.

### Two surfaces, one system

| | Student | School Department |
|---|---|---|
| Device | Mobile-first | Desktop-first |
| Layout | Card grid, 3–5 per screen, generous whitespace | Tables, charts, funnels — high information density |
| Reference tone | Toss (numerics, friendly micro-copy) | Linear / Notion admin |
| Shared | Same tokens, same type ramp, same green/amber semantics, same Pretendard | |

---

## Sources

- **GitHub repo (provided):** `team-mori/mori` — Next.js 14 + Tailwind, working demo with `/`, `/demo/student`, `/demo/department`. Full source mirrored under [`source/frontend/`](source/frontend/) for reference.
- **Brand brief (provided):** included verbatim in user prompt — color palette, type rules, voice & copy patterns, what to avoid. **The brief takes precedence over the repo's looser implementation** (see Caveats at the bottom of this file).

The repo is a working 1-week demo; the brief is the direction MORI is moving toward. Where they conflict, this design system follows the brief and notes the divergence.

---

## CONTENT FUNDAMENTALS

The voice is the product. Three rules first, then specifics.

1. **Korean-first, polite (존댓말), suggestive over imperative.** "~할 수 있어요" instead of "~하세요".
2. **Facts before pressure.** Reminders deliver information; they do not push.
3. **Soft when the answer is no.** Ineligibility is described as a gap that can be filled, not a rejection.

### Voice patterns — concrete examples

| `X` (avoid) Avoid | `O` (write) Write instead |
|---|---|
| "지금 신청 안 하면 손해입니다!" | "마감까지 3일 남았어요. 자격 충족 확인됨." |
| "자격이 안 됩니다." | "이 공지는 어학 점수 1개 항목이 부족해요. 채울 수 있는 활동을 볼까요?" |
| "신청하세요!" | "신청 예정으로 표시할 수 있어요." |
| "놓쳤습니다." | "이번에는 지나갔어요. 다음 학기에 다시 열려요." |
| "에러가 발생했습니다." | "잠시 불러오지 못했어요. 다시 시도할게요." |

### Casing

- **Korean:** plain prose, sentence-natural punctuation. No exclamation marks except for completion confirmations.
- **English (when needed):** sentence case. Never Title Case in product UI. `Sign in`, not `Sign In`.
- **Numbers and dates:** spell out units (만 원, 명, %), use Hindu-Arabic numerals, comma separators (`1,240명`).
- **D-day:** `D-3`, `D-day`, `D+2` (past). Never "D-DAY" or "디데이".

### Pronouns

- **Student:** addresses the user ("당신" implied, never written). Verbs in 해요체 (`확인됐어요`, `남았어요`).
- **Admin:** addresses the operator. Slightly more terse (`신청 완료 28%`, `퍼널 보기`). Same politeness register, less padding.

### Eligibility labels (the big three)

These three appear everywhere — cards, lists, profile, filters — and must read as a system, not three random words.

- **자격 충족** — eligible. Calm green badge. Icon: check (lucide `Check`).
- **자격 부족** — partially eligible (one or two requirements missing). Amber badge. Icon: lucide `AlertCircle`.
- **자격 미달** — not eligible. Soft grey, never red. Icon: lucide `MinusCircle`. Always paired with what's missing and a suggestion.

> Forbidden: "탈락", "실격", "불합격", "거절", "X" mark, `X` (avoid) emoji, red text. The product never tells a student they failed.

### Numbers and amounts

Numbers are the visual stars of MORI. The reminder card *anchors* on the D-day numeral, and the amount is the second-most-important glyph on the page.

- D-day: `text-dday` token, ~56px, weight 800.
- Amounts: bold + tabular-nums + tight tracking. `30만 원`, `500만 원 상금`, `월 10만 원`.
- Always show the unit. Never just `30` without `만 원`.

### Emoji policy

**No emoji in product UI.** Only allowed in toast confirmations of *successful* actions, and only checkmarks: `check`. The repo's landing page uses `calendar``target``chart` — those are flagged for replacement with line icons (see Caveats).

### Things never to say

- Anything implying loss/regret (`손해`, `놓치면 안 돼요`, `늦었어요`).
- Anything ranking students against each other (`상위 10%`, `남들보다 빠르게`).
- Anything that sounds like a bank or a government portal (`접수처`, `기각`, `반려`).
- Game-y language (`레벨업`, `포인트`, `뱃지`).

---

## VISUAL FOUNDATIONS

### Color

A **single strong neutral** carries the brand. Colors only appear when they *mean* something.

- **Primary (brand):** `--brand` = `#2B3A55` (midnight indigo, slightly warm). Lives on the wordmark, primary buttons, focus rings, and the admin sidebar (deeper at `--brand-deep` `#1F2937`).
- **Secondary background:** `--bg-page` = `#FAFAF7` (warm off-white). This is non-negotiable — pure cold `#F1F5F9` admin-portal grey is forbidden.
- **Surface:** `--bg-surface` = pure white for cards and modals.
- **Reminder semantic accents** (used as `bg-100` + `fg-700` pairs for badges, never as full fills):
  - `--state-eligible-*` — calm green (`#10B981` toned to `#047857` text on `#ECFDF5`). "자격 충족", completion.
  - `--state-due-soon-*` — mustard / amber (`#D97706` text on `#FEF3C7`). "마감 임박", "D-3 이하".
  - `--state-ineligible-*` — soft grey (`#475569` on `#E2E8F0`). "자격 미달". **Never red.**
  - `--state-new-*` — tinted brand indigo (`#2B3A55` on `#E5EAF1`). New-notification dot, "새 공지".
- Charts on the admin side use the *same* semantic palette: green = completed, amber = deadline-driven, brand-indigo = neutral counts. The repo's violet/orange chart palette is flagged for replacement (see Caveats).

**Forbidden:** gradients, neon, fluorescent colors, red of any kind for negative states, more than one accent saturation per surface.

### Typography

**Pretendard** for everything Korean and Latin. **JetBrains Mono** as a tabular-numeric utility on the admin side (counts in tables — never for body copy). See `colors_and_type.css` for the full ramp.

- Body: 15–16px, line-height **1.6 minimum**.
- Card title: 18–20px, weight 600.
- Page title: 28–32px, weight 700, tight tracking (-0.02em).
- D-day numeral (the visual anchor): **56px, weight 800**, tabular nums.
- Amounts: bold + tabular nums.
- Section eyebrows: 12px, weight 600, **0.16em letter-spacing**, uppercase Latin only.

### Spacing

4px base. Cards use 20–24px internal padding. Card gap on student grid: 16px. Page gutter on mobile: 16px; desktop: 24–32px. Generous — students need to breathe.

### Radii

- **Card minimum 12px, maximum 16px.** Never larger; never sharper.
- Buttons: 8–10px.
- Pills (badges, D-day chip, eligibility chip, category tabs): full pill (`999px`).
- Inputs: 8px.

### Borders

Hairline 1px borders are the default. `--line-1` (`#E2E8F0`) is the workhorse. Cards = paper sitting on paper, defined by edge, not shadow.

### Shadows

Almost none. Three tokens only:

- `--shadow-flat`: just the 1px ring. Default for cards at rest.
- `--shadow-1`: 1px / 2px / 4% — appears on hover.
- `--shadow-2`: 2px / 6px / 6% — for floating elements (toast, dropdown).
- `--shadow-pop`: only for modals over a scrim.

No 3D, no inner shadow, no skeumorphism.

### Backgrounds

- **No images, no patterns, no textures, no gradients** by default.
- The ONE acceptable exception: a subtle warm-grey wash (`--paper-100`) for empty-state illustrations or dashboard sub-sections. Even that should be rare.
- Forbidden: nature/forest/plant motifs (the name is unrelated), public-portal blue gradients, mascot characters, hand-drawn illustrations.

### Animation & motion

Everything moves quickly and slightly. Easing `cubic-bezier(0.2, 0.8, 0.2, 1)`, durations 120/180/280ms.

- Hover: opacity, color, or 1px shadow lift. **No scale up.**
- Press: 1–2% darken on the same color. **No shrink.**
- Card status change (e.g. 신청 예정 → 완료): badge cross-fades; the card itself does not animate.
- Modal: 180ms fade + 4px translate. Never bounce.
- Loading: 1.2s slow pulse on a skeleton card. No spinners on first load — show skeleton cards instead.

### Hover / Press / Focus / Disabled

- **Hover:** card border darkens 1 step (`--line-1` → `--line-strong`), shadow goes flat → shadow-1. Buttons darken to `--brand-deep`.
- **Press:** stays in hover state — no separate press color, no scale.
- **Focus:** 2px ring of `--state-new-bg` outside a 1px `--brand` ring. Always visible for keyboard users.
- **Disabled:** opacity 0.5, no hover state. Cursor `not-allowed`.

### Transparency / blur

- Modal scrim: `rgba(15, 23, 42, 0.4)`. No backdrop blur — keep it clean.
- Toast: solid `--ink-900`, white text. No translucency.

### Layout rules

- **Student:** mobile portrait baseline 360px, max content width 720px. Single fixed top header (60px). Bottom of viewport never has fixed CTAs — they live in the card.
- **Admin:** desktop baseline 1440px, sidebar 240px (collapses to icon rail at <1024px). Content max-width 1280px. Right edge always has 32px gutter for breathing.

### Imagery

MORI uses essentially no decorative imagery. When a real photo is needed (rare — onboarding hero, marketing site), it should be **black-and-white or very desaturated, warm-toned, paper-textured**, not the saturated stock-photo campus look.

---

## ICONOGRAPHY

**Lucide line icons exclusively.** Strokes 1.75px, no fills, rounded line caps and joins. The repo already uses `lucide-react`; this design system pins the same set.

- **Loaded from CDN** in static HTML files: `https://unpkg.com/lucide@latest`.
- Default size: 16px in inline runs, 20px in buttons, 24px in section headers, 32px max for empty-states.
- Default stroke color: inherit from parent text color. Badges set their own color.

### The "reminder vocabulary"

These five icons recur enough to feel like the brand. Don't substitute them.

| Concept | Lucide name | Used for |
|---|---|---|
| Time / D-day | `clock-3` | D-day chip, time-of-day reminder |
| Notification | `bell` | New-notice badge, push toggle |
| Verified eligibility | `check-circle-2` | "자격 충족" badge, completed card |
| Calendar action | `calendar-plus` | "캘린더 추가" button on every card |
| Saved / bookmark | `bookmark` | "관심 표시" |

Secondary set: `external-link` (원문 보기), `chevron-right` (탭 deeper), `search`, `filter`, `x`, `info`, `alert-circle` (자격 부족), `minus-circle` (자격 미달), `users`, `bar-chart-3`, `pie-chart`, `arrow-up-right` (positive metric delta).

**Forbidden as icons:** emoji (the repo's `calendar``target``chart` are flagged for replacement), filled glyphs, multi-color icons, anything not from Lucide.

### Logo

Wordmark **모리** in Pretendard ExtraBold, with the brand mark to its left. Mark is in `assets/logo.svg`. The original repo logo (an emerald circle with a peak path) is flagged — see `assets/logo.svg` for the corrected midnight-indigo version that matches the brief.

---

## Index — what's in this design system

| Path | What it is |
|---|---|
| [`README.md`](README.md) | This file. Voice, visuals, iconography, philosophy. |
| [`SKILL.md`](SKILL.md) | Agent skill manifest — read first if you're an agent invoking `mori-design`. |
| [`colors_and_type.css`](colors_and_type.css) | All design tokens, type ramp, element defaults. Import this in every artifact. |
| [`assets/`](assets/) | Logo SVG, brand mark, icon library reference. |
| [`fonts/`](fonts/) | Pretendard + JetBrains Mono — loaded from CDN; this folder is empty by intent. |
| [`preview/`](preview/) | Design-system spec cards (Type, Colors, Spacing, Components, Brand). |
| [`ui_kits/student/`](ui_kits/student/) | Mobile student app — NoticeCard, EligibilityBadge, RegretModal, full demo screen. |
| [`ui_kits/admin/`](ui_kits/admin/) | Desktop department admin — Sidebar, ReachDonut, FunnelTable, full dashboard. |
| [`source/frontend/`](source/frontend/) | Original repo source mirrored, read-only reference. |

---

## CAVEATS — please review

I made deliberate choices where the **brand brief** and the **repo's actual implementation** disagreed. The brief wins by default in this design system; here's where you may want to push back:

1. **Primary color.** Repo: emerald-600 saturated green (`#059669`). Brief: midnight indigo (`#2B3A55`). I followed the brief. The wordmark, primary CTA, and admin sidebar all use indigo here — landing-page pages in the repo will need to be updated.
2. **Red for "missed opportunities".** Repo: `text-red-600`, `bg-red-50` on the regret modal and missed-count number. Brief: **빨강 금지**. I removed all red from this system — missed states use `--state-ineligible-*` (soft grey) and a `clock` icon with past-tense copy. **You will see the repo's regret modal already uses red — that needs replacing.**
3. **Emoji on landing.** Repo: `calendar``target``chart` in feature cards. Brief: no emoji. Replaced with Lucide icons.
4. **Chart palette.** Repo: violet `#8b5cf6`, orange `#f97316`, sky `#0284c7`. Brief: single neutral + semantic green/amber. Updated chart palette in admin previews — old charts in the repo will need refactoring.
5. **Missing font files.** Pretendard and JetBrains Mono are loaded from CDN (matching the repo). If MORI plans to ship offline / installed assets, you'll need to commit them under `fonts/`.
6. **No real student avatars / department logos.** I used initials in colored circles (`학`, `장`) following the repo. If you want actual department logos, please share assets.
7. **Mock data only.** Demo numbers come from `source/frontend/lib/mock/`. Replace with real Supabase queries before launch.

**The big ask:** please confirm direction #1 — indigo vs. emerald — first. Almost everything visual hinges on it. If you want emerald to remain primary and indigo to be a secondary accent (or vice-versa), I'll re-tokenize.
