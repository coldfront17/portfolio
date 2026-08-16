# Kris Tong Portfolio — Working Context

A static personal portfolio / case-study website for **Kris (Lingwei) Tong**, a
Digital Experience Designer & UX Researcher at the HIT Lab NZ, University of
Canterbury. Deployed via GitHub Pages at
**https://coldfront17.github.io/portfolio/**.

There is **no build step, framework, package manager, or CI** — just
hand-authored HTML with Tailwind loaded from a CDN, plus two small vanilla-JS
files. Edit the HTML and it ships.

## Tech stack

- **HTML**, one file per page. No templating or includes, so shared markup
  (nav, `<head>` meta, sidebar) is duplicated and must be kept in sync by hand.
- **Tailwind CSS** via the Play CDN: `<script src="https://cdn.tailwindcss.com"></script>`.
  Note that the **typography plugin is not loaded**, so `prose` classes on
  `<article>` are inert — every element needs its own explicit utility classes.
- **Dark mode** per page via `tailwind.config = { darkMode: 'media' }`. It
  follows the OS `prefers-color-scheme`; there is no manual toggle yet.
- **Vanilla JS only**, no dependencies:
  - `assets/lightbox.js` — click-to-zoom lightbox, auto-attached to every
    `<img>` inside an `<article>`. Loaded at the end of `<body>` on detail pages.
  - `assets/project-chrome.js` — injects the sticky top nav and breadcrumb plus
    the scroll-reveal "Back to List" button on detail pages. Takes the page name
    from its own `data-project-name` attribute. Styles are injected from JS, so
    changing detail-page chrome means editing this file, not the HTML.

## Page map

| File | Purpose |
| --- | --- |
| `index.html` | Home / about: bio, skills grid, work experience. |
| `work.html` | "Selected Projects" list, newest first; each card links to a detail page. |
| `project-*.html` | One case-study page per project (10 of them). |
| `assets/` | Images, per-project media folders, `lightbox.js`, `project-chrome.js`. |
| `CLAUDE.md` | This file — the canonical working context. |
| `.cursor/rules/project-context.mdc` | Thin pointer to this file, for Cursor. |
| `For future versions/Ver 2.0 Plan.md` | Planned retro-styled redesign; not started. |

### Projects, newest first

`work.html` is ordered newest to oldest. Current order:

1. `camstories-v2` — CamStories V2: Paired AR at a Heritage Site (2026)
2. `tourism` — Immersive Regenerative Tourism (2025)
3. `tourmaster` — Tour Master 360
4. `sia` — Singapore Airlines A350-900 Virtual Tour
5. `mataliki` — Matariki Hunga Nui
6. `wananga` — Virtual Immersive Wānanga
7. `cvr` — Cinematic VR Storytelling Guidelines
8. `castbox` — CastBox VR Sculpting Tool
9. `c4` — C4 Coffee Christchurch Order System
10. `napos` — NAPOS App

Each project has `project-<slug>.html`, a 16:9 card thumbnail at
`assets/project-<slug>.jpg`, and most have a media folder under
`assets/Project-detial-materials/<slug>/`.

**Content status:** `camstories-v2`, `tourism`, `sia`, and `mataliki` are written
out as full case studies. The rest are still short summaries awaiting full
content — tracked in Linear under the `Portfolio_Web` project (team `DEV`).

## Shared layout conventions

Keep these identical across pages.

- **Body classes:**
  `bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans antialiased`
- **`index.html` / `work.html`:** `max-w-6xl` main, `md:w-1/4` `<aside>`
  (avatar + contact links, `md:sticky md:top-24`) beside a `md:w-3/4` content
  `<section>`. Their sticky top nav is written inline in the HTML — `Home` and
  `Work` links, active link gets
  `text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-1`.
- **Detail pages (`project-*.html`):** narrower `max-w-4xl` main, a `21/9` hero
  `<figure>`, a metadata `<header>`, then `<article>`. Nav and breadcrumb come
  from `project-chrome.js`; do not hand-write a nav bar on these pages.
- **Metadata header:** label/value pairs in a `flex flex-wrap gap-y-4 gap-x-8
  text-sm` row. Labels are `text-gray-500 dark:text-gray-400`, values
  `font-medium text-gray-900 dark:text-white`. Fields in use: Role / Type,
  Platform, Timeline, Programme, Location, Method, Funding. Add fields as the
  project needs them rather than forcing every page to match.
- **Images** use `onerror` fallbacks to `via.placeholder.com` so missing assets
  degrade gracefully instead of showing a broken icon.
- **"See Details"** buttons are pill-shaped dark/white; optional external
  "Learn more ↗" links sit beside them.

### Case-study page patterns

Established on `project-tourism.html` and `project-camstories-v2.html`; reuse
these rather than inventing new ones.

- **Section headings:** `<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">`
- **Body paragraphs:** `<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">`
- **Lede paragraph:** `text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8`
- **Figure with caption:** `<figure class="my-8">` + `<img class="w-full rounded-xl shadow-md">`
  + `<figcaption class="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">`
- **Image grids:** `grid grid-cols-2 gap-4 my-8` or `grid-cols-3`
- **Statistics strip:** `grid grid-cols-2 md:grid-cols-4 gap-4 my-10` of
  `bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700`
  cards, each with a `text-xl md:text-2xl font-bold` figure over a
  `text-sm text-gray-600 dark:text-gray-400` label. Keep the number size
  responsive or it wraps badly on mobile.
- **Tables** go in an `overflow-x-auto` wrapper so they scroll instead of
  breaking the page on mobile. Prefer real `<table>` markup over a screenshot —
  it works in dark mode and stays searchable.
- **Video embeds:** a `relative w-full aspect-video` wrapper with an
  `absolute inset-0 w-full h-full` iframe, served from `youtube-nocookie.com`,
  with `loading="lazy"`, `title`, and `allowfullscreen`. No autoplay.

### `<head>` requirements

Every page carries the favicon / home-screen icon block, a meta description, a
canonical URL, Open Graph tags, and Twitter Card tags, all between `<title>` and
the Tailwind script. **When adding a page, copy this whole block and update every
value** — there is no template to do it for you.

The icon block is byte-identical on every page and can be copied verbatim:

```html
<link rel="icon" href="assets/favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#FCA230">
<meta name="apple-mobile-web-app-title" content="Kris Tong">
```

The per-page tags that follow it always change.

- `og:image` and `twitter:image` **must be absolute URLs** under
  `https://coldfront17.github.io/portfolio/`; relative paths silently fail in
  every scraper.
- `og:type` is `website` for `index.html` / `work.html`, `article` for project
  pages.
- `twitter:card` is `summary_large_image` where the image is landscape;
  `index.html` uses `summary` because `assets/avatar.jpg` is square.
- Keep descriptions roughly 130–180 characters and distinct per page.

### Icons and the web manifest

`assets/favicon/` holds the whole icon set plus `icon-source.jpg`, the original
square artwork it is all derived from. `site.webmanifest` at the repo root makes
the site installable, so Android "Add to Home Screen" uses the icon and name
rather than a screenshot.

| File | Used by |
| --- | --- |
| `favicon.ico` (16/32/48/64) | Desktop browser tabs, including older browsers |
| `favicon-16.png`, `favicon-32.png` | Modern browser tabs |
| `apple-touch-icon.png` (180×180) | iOS / iPadOS Add to Home Screen |
| `icon-192.png`, `icon-512.png` | Android / Chrome home screen and splash, declared `any` + `maskable` |
| `og-home.png` (1200×1200) | The homepage's social share thumbnail |
| `icon-source.jpg` | Source artwork; regenerate the set from this |

Two deliberate choices to preserve when regenerating:

- **Icons use a tighter crop than the source.** The artwork is a goose whose head
  sits in the upper third; scaling the full square to 16px reduces it to an
  unreadable blob. Every icon size is cropped to roughly
  `(240, 140, 700, 600)` of the 940×940 source so the head fills the frame.
  `og-home.png` keeps the full uncropped composition, since it is displayed
  large.
- **`index.html` uses `twitter:card = summary`,** not
  `summary_large_image`. The large-image card crops to 1.91:1, which would cut
  the goose's head off; the small square card shows the icon intact.

`theme-color` and the manifest's `theme_color` / `background_color` are all
`#FCA230`, sampled from the source artwork's background. Keep them in step with
the icon if it ever changes.

### `work.html` card links

Each card links to its detail page **twice**: from the "See Details" button and
from the thumbnail. The thumbnail link carries `aria-hidden="true"`
`tabindex="-1"` and its `<img>` has `alt=""`, so assistive technology and
keyboard users get one link per card instead of two duplicates pointing at the
same place. Hover feedback comes from `class="block group"` on the link driving
`group-hover:shadow-md group-hover:brightness-[1.03]` on the image.

Because the scroll-restoration script binds to `a[href^="project-"]`, the
thumbnail link picks up scroll saving automatically — no extra wiring needed.

### Scroll-restoration behaviour (`work.html` ⇄ detail pages)

`work.html` saves `window.scrollY` to `sessionStorage` (`workScrollY`) when a
`project-*` link is clicked, hides the page (`opacity:0`) on return via an
inline script in `<head>`, restores the saved position on `load`, then fades
back in. Preserve this when editing `work.html` navigation, or returning from a
detail page will jump to the top.

## Writing conventions

- **First person, outcome-oriented case-study prose.** Say what the problem was,
  what you did, and what happened.
- **Report negative and null results directly.** The two CamStories pages both
  lead with findings that went against the design's intent; that honesty is
  deliberate and is part of how this portfolio presents research credibility.
  Do not soften it into a success story.
- **Spelling: New Zealand / British English** for new copy — programme,
  behaviour, artefact, analysed, recognise, signposted. Older pages still mix in
  US spellings (`honor`, `behavior`, `user-centered`); a site-wide pass has not
  been done.
- **Do not state publication status** for research projects. Papers have been
  rejected and re-targeted; pages present the work as research, with no venue or
  submission claims. Check with Kris before adding any.
- **Cultural terms:** keep te reo Māori terms in-line with a short gloss on
  first use — `kaitiakitanga (guardianship)`, `rangatahi (Māori youth)`.
- **Cross-link related projects** where one is a continuation of another (see
  the links between `tourism` and `camstories-v2`).

## Adding a project

1. Copy an existing detail page — `project-camstories-v2.html` is the current
   best reference — as `project-<slug>.html`.
2. Update the `<head>` block completely: title, description, canonical, all OG
   and Twitter tags.
3. Set `data-project-name` on the `project-chrome.js` script tag.
4. Add `assets/project-<slug>.jpg` at 16:9, and a media folder if needed.
5. Insert a card in `work.html` **in date order** — newest at the top of
   Selected Projects.
6. Preview locally before committing (see below).

Note the misspelled media directory `assets/Project-detial-materials/`
("detial"). Renaming it would mean updating every `src` across the project
pages; it has been left alone deliberately.

## Testing / preview

No automated tests or CI. To preview:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Tailwind and the placeholder fallbacks need network access. If Tailwind's CDN is
unreachable in your environment, every utility class becomes inert and the page
will look broken and report huge horizontal overflow — that is the missing
stylesheet, not a layout bug. To verify layout in a sandboxed environment,
compile an equivalent stylesheet from the markup and inject it:

```bash
npx tailwindcss -c tw.config.js -i tw.in.css -o tw.built.css --minify
# tw.config.js: { darkMode: 'media', content: ['*.html', 'assets/*.js'] }
```

Check any change in **light mode, dark mode, and at 390px wide** before
committing. The most common regressions are a missing `dark:` variant and a wide
element causing horizontal overflow on mobile.

## Known issues / cleanup opportunities

Verify before "fixing" — some are intentional.

- **Matariki naming inconsistency.** The slug and `work.html` card read
  `mataliki` / "Mataliki Hana Nui", but the detail page reads "Matariki Hunga
  Nui", which is the correct te reo Māori spelling. The card title and slug are
  the ones that are wrong.
- **Misspelled asset folder** `assets/Project-detial-materials/`, as above.
- **Stray temp file** `assets/Project-detial-materials/~$oject Detailed Pages.docx`
  is a leftover Office lock file and can be deleted.
- **Source `.docx`** `assets/Project-detial-materials/Project Detailed Pages.docx`
  holds source copy for the detail pages.
- **Placeholder GitHub link** in the `index.html` sidebar (`href="#"`).
- **Unmerged translation draft.** The branch
  `cursor/i18n-translation-review-ea1c` holds `i18n/translation-review.md`, a
  620-line EN/ZH translation of the whole site, not present on `main`. Chinese
  localisation is **deferred** — do not start implementing it. Linear DEV-88
  tracks Kris reviewing that draft first.
- **No light/dark toggle.** Linear DEV-74 / DEV-75 track adding one with
  `localStorage` persistence.
- **Large images.** Several card thumbnails are multi-megabyte originals
  (`project-wananga.jpg` is 2 MB, `project-sia.jpg` and `project-tourism.jpg`
  are 1.4 MB each) displayed at well under 1000px. Downscaling them would be an
  easy performance win.

## Project tracking

Work is tracked in Linear, workspace `ks-own-pr`, project **Portfolio_Web**
under team **Personal Dev (`DEV`)**. Check it for current priorities before
starting unprompted work.
