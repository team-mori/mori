# MORI User Flows

## Flow A. First Session

1. Student opens MORI on mobile.
2. Student selects interest categories.
3. Student enters only minimal profile fields: school, enrollment status, grade, major.
4. MORI shows a deadline-first feed.
5. Student sees school notice cards converted into action cards.

Success criteria:

- student reaches the feed without a long onboarding form,
- at least one opportunity card is understandable without opening the original notice.

## Flow B. School Notice to Calendar

1. Student opens a school notice card.
2. MORI shows deadline, summary, required documents, eligibility state, and original notice link.
3. Student checks whether the opportunity is relevant.
4. Student taps calendar save.
5. MORI creates an `.ics` file or opens Google Calendar.
6. The card returns to the feed with a saved state.

Success criteria:

- student can save a deadline without manually copying title/date,
- original notice remains accessible for final verification.

## Flow C. Eligibility Gap

1. Student opens a card with `unknown` or `gap` eligibility.
2. MORI explains which field is missing or which requirement may be unmet.
3. If a single profile field can resolve the uncertainty, MORI asks for that field only.
4. Student updates the field or skips.
5. MORI updates the eligibility state or keeps it as confirmation needed.

Success criteria:

- unknown is not treated as unfit,
- student understands the next action without feeling rejected.

## Flow D. Similar Contest Discovery

1. Student opens a relevant school opportunity.
2. MORI shows similar contests below the notice detail.
3. Each recommendation includes title, provider, deadline, and reason.
4. Student opens a recommendation or saves it to calendar.

Success criteria:

- recommendation feels connected to the current opportunity,
- student can understand why it appeared.

## Flow E. Youth Policy Discovery

1. Student opens a scholarship, internship, startup, or support notice.
2. MORI shows related youth policies based on profile and opportunity context.
3. Student reviews benefit, institution, deadline or always-on status.
4. Student opens the policy source or saves the deadline.

Success criteria:

- policy recommendation is not mixed into the school notice feed without context,
- each policy keeps its official source visible.

## Flow F. Low Confidence Fallback

1. MORI extracts a notice but deadline or eligibility confidence is low.
2. The card remains visible with a confirmation-needed state.
3. The detail page shows the uncertain field and original notice link.
4. Student can still save, dismiss, or open the original notice.

Success criteria:

- partial crawl results are useful but not misleading,
- source transparency is preserved.

## Flow G. Department Analytics, MVP2

1. Department operator opens the dashboard.
2. Operator sees anonymous funnel metrics.
3. Operator opens a notice performance detail.
4. MORI masks small groups below 5.
5. Operator uses aggregate drop-off signals to improve the next notice.

Success criteria:

- no student-level data is visible,
- dashboard is not required for MVP1 wireframe acceptance.
