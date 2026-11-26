# Olympia Celebration

Sample website for a private party room in Pandesara, Surat. Plain HTML, CSS and JavaScript with no build step.

| File | What to edit |
|---|---|
| `data.js` | Phone, links, packages, add-ons, gallery photos |
| `i18n.js` | All text in English, Hinglish and Gujarati |
| `index.html`, `styles.css`, `app.js` | Layout, design, behaviour |
| `images/` | Photos. Overwrite a file with the same name to swap it |
| `BUSINESS-INFO.md` | Collected details, sources and open questions |

Prices also appear in the text of `i18n.js` and `index.html` (hero stat and meta description), so update those too.

**Run locally:** `python3 -m http.server 4173`, then open http://localhost:4173

**Deploy:** `vercel deploy --prod`

Before launch: confirm the details in `BUSINESS-INFO.md`, replace the placeholder photos, and remove the `noindex` tag in `index.html`.
