# Questionnaire router (Layer 3)

Entry path B only. Pick the questionnaire that best fits the business, then ask its
questions conversationally in stage 00 — don't paste the whole list at once. Record
answers into `business-profile.json`.

## Choosing the set

| If the business is… | Use |
|---------------------|-----|
| Software / app / platform, sells a product or subscription | `saas.md` |
| Serves a local area in person (trades, clinics, salons, restaurants, gyms) | `local-services.md` |
| Sells physical or digital products to consumers | `ecommerce.md` |
| Expertise-led, client engagements (law, accounting, consulting, financial) | `professional-services.md` |
| Does creative/marketing/dev work for clients, has a portfolio | `agency.md` |
| Anything that doesn't clearly fit above | `generic.md` |

If unsure between two, pick the closer fit and pull any extra questions you need from
`generic.md`. The goal is a complete `business-profile.json`, not rigid adherence to
one list.

## Shared core (ask for every business type)

Every questionnaire assumes these are captured first:

1. **Business name** and one-line description ("we help X do Y").
2. **Sector / what you do** in plain language.
3. **Primary goal** of the landing page — the single action a visitor should take
   (book, buy, sign up, request a quote, contact).
4. **Primary CTA** label, and a secondary CTA if any.
5. **Target audience** — who they are and what they care about.
6. **Tone hints** — 3–5 words for how the brand should sound; any brands they admire.
7. **Contact** — email, phone, address, social links (whatever applies).
8. **Assets** — logo, brand colours/fonts if they exist, photos, any existing copy.
9. **Anything to avoid** — words, claims, competitors, styles they dislike.

Then add the type-specific questions from the chosen file.

## After gathering

- Fill every field of `business-profile.json` you can; mark unknowns `null`.
- Set `entry_path: "B"` and `business_type` to the chosen set's name.
- Don't invent facts. If something wasn't answered, leave it null and note it in
  `intake.md` for the review gate.
