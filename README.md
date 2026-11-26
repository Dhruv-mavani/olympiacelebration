# Olympia Celebration

Sample website for a private party room in Pandesara, Surat. Plain HTML, CSS and JavaScript with no build step.

| File | What to edit |
|---|---|
| `data.js` | Phone, links, packages, occasions and sign colours, add-ons, photos |
| `i18n.js` | All text in English, Hinglish and Gujarati |
| `index.html`, `styles.css`, `app.js` | Layout, design, behaviour |
| `images/` | Photos. Overwrite a file with the same name to swap it |
| `BUSINESS-INFO.md` | Collected details, sources and open questions |

Design: "your name in neon". The visitor's name and occasion light up on the opening sign and carry into the booking message. Further down, scrolling switches the room's lights on spot by spot (`spots` in `data.js`).

Prices also appear in `index.html` (fallback text and meta description) and `hero_hint` in `i18n.js`, so update those too.

**Run locally:** `python3 -m http.server 4173`, then open http://localhost:4173

**Deploy:** `vercel deploy --prod`

Before launch: confirm the details in `BUSINESS-INFO.md`, replace the placeholder photos, and remove the `noindex` tag in `index.html`.
