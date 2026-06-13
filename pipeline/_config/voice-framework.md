# Voice framework (Layer 3)

A procedure for capturing **any** brand's tone of voice. Used in stage 01 to
synthesise voice (Path B) or to validate imported voice (Path A). The output is the
voice section of `brand-identity.md` — always the **customer's** voice, never a
template's.

## Capture these dimensions

1. **Audience.** Who is being spoken to (role, sophistication, what they care about)?
   Voice is relative to the reader.
2. **Register.** Where does the brand sit between formal ↔ casual, and corporate ↔
   personal? A law firm and a kids' brand differ deliberately.
3. **Personality (3–5 adjectives).** e.g. confident, warm, precise, playful,
   no-nonsense. These are testable against any sentence.
4. **Vocabulary.** Words the brand uses and words it avoids. Domain terms? Plain
   English? Jargon allowed or banned?
5. **Sentence rhythm.** Short and punchy, or considered and flowing? Fragments for
   emphasis, or full sentences only?
6. **Point of view.** Second person ("you/your") is usual for landing pages;
   confirm. First-person plural ("we") for the brand as actor.
7. **Spelling & mechanics.** British vs US English; sentence case vs Title Case;
   em-dash style; emoji yes/no. Capture explicitly — these recur on every line.
8. **Claim style.** How does it support claims — numbers and mechanisms, or
   adjectives? Prefer concrete proof; record the brand's evidence habit.

## Derive (Path B) vs validate (Path A)

- **Path B (synthesise).** Use the business type, audience, and `tone_hints` from
  intake to choose each dimension. Default to clear, direct, second-person, outcome-led
  copy unless the sector calls for something else. Pick **one** consistent register.
- **Path A (validate).** Read the existing site's copy, infer the dimensions above,
  and keep what's working. Flag inconsistencies or dated phrasing as `must_fix`.
  Preserve genuine equity (a known tagline) while tightening the rest.

## Write it as usable rules

In `brand-identity.md`, record voice as **do / don't with examples**, so the build
stage can apply it without re-deriving:

```
Voice: <3–5 adjectives>
Audience: <who>
Register: <where on the scales>
Do:    write "<good example>", use sentence case, British spelling, lead with outcome
Don't: write "<bad example>", Title Case, vague hype, passive voice, feature dumps
POV:   second person; brand as the actor that solves the problem
```

## Universal guardrails (apply to every brand)

- No vague hype ("revolutionary", "next-gen", "synergy") unless ironically on-brand.
- Back bold claims with a number or a clear mechanism.
- Match the visual brand's energy — voice and design should feel like one thing.
