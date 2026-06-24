# MORI Wireframe Plan

## Purpose

The wireframe must validate the MVP1 student mobile product before visual polish. It should prove that MORI can turn crawled school notices into useful action cards and extend discovery through calendar saves, similar contests, and youth policies.

The active route is `/wireframe`.

## MVP1 Screens

### 1. Student Home Feed

Must show:

- mobile frame,
- category subscription chips,
- deadline-first card list,
- school notice cards,
- saved/interested state,
- urgent and confirmation-needed states.

### 2. Opportunity Detail

Must show:

- D-day hero,
- summary,
- eligibility state,
- gap or unknown explanation,
- required documents,
- original notice link,
- calendar action.

The detail layout should not repeat card containers for every section. Use card layout only where it helps scanning.

### 3. Calendar Save State

Must show:

- save to calendar action,
- saved confirmation,
- fallback when deadline confidence is low.

### 4. Similar Contest Recommendations

Must show:

- two or three recommended contests,
- recommendation reason,
- provider/source,
- deadline,
- save or view action.

### 5. Youth Policy Recommendations

Must show:

- policy title,
- institution,
- benefit,
- eligibility hint,
- source link.

### 6. Progressive Profile Prompt

Must show:

- one missing field request,
- skip action,
- explanation of why the field helps.

## Deferred MVP2 Screens

These are documented but not required for the first student wireframe:

- department dashboard,
- notice performance detail,
- source health view,
- privacy masking examples.

## Design Constraints

- Minimum mobile screen width: 320px.
- Keep mobile ratio stable across desktop preview.
- Do not use red.
- Use MORI tokens from `frontend/app/design-tokens.css`.
- Use D-day as the primary visual anchor.
- Keep cards limited to repeated opportunity items.
- Avoid stacked card-inside-card layouts in detail sections.

## Wireframe Acceptance Checklist

- School notice ingestion is represented in the UI.
- Student can understand the opportunity without leaving MORI.
- Student can still open the original notice.
- Student can save a deadline to calendar.
- Eligibility has fit, gap, unknown, and unfit examples.
- Similar contests are present.
- Youth policy recommendations are present.
- Low-confidence extraction state is present.
- Department dashboard is clearly marked as MVP2, not MVP1.
