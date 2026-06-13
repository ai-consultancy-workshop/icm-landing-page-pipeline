# Stage 00 — Intake

One job: **capture the starting point** for this customer and decide the entry path.
You are setting up the inputs the whole pipeline runs on. Do not design or build.

## Inputs

- Layer 3: `../../setup/questionnaires/_router.md` (choose the right questionnaire)
- Layer 3: `../../setup/questionnaires/<type>.md` (the chosen set — path B only)
- Layer 4: whatever the operator provides — a URL to improve, or answers to questions

## Process

1. Determine the **entry path**:
   - **Path A** if the operator gives a live URL flagged for improvement.
   - **Path B** if there is no usable site — run the questionnaire instead.
2. Path A: record the URL and the operator's stated reasons for improvement (what's
   wrong, what to keep). Do **not** scrape yet — that is stage 01's job.
3. Path B: use `_router.md` to pick the business-type questionnaire, ask the
   questions (don't dump them all at once — converse), and record the answers.
4. Normalise everything into a structured profile. Fill every field you can; mark
   unknowns as `null` rather than guessing.

## Outputs

- `output/business-profile.json` — structured facts:
  `business_name, entry_path ("A"|"B"), existing_url, sector, business_type,
  offerings[], target_audience, primary_goal, primary_cta, secondary_cta,
  contact{email,phone,address,social{}}, tone_hints[], assets{logo,images[]},
  must_keep[], must_fix[]`
- `output/intake.md` — the same in prose: who this business is, what they sell, who
  they sell to, what the landing page must achieve, and any constraints.

## Verify

- `entry_path` is set and consistent (Path A has `existing_url`; Path B does not require it).
- No invented facts — anything not gathered is `null`, not filled from assumption.

## Review gate

Confirm the **primary goal and primary CTA** are right — they steer every later
stage. Check the business is described accurately before brand work begins.
