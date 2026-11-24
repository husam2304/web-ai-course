# web-ai-course

Everything for Husam's 5-day course «تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي» (مؤسسة ولي العهد, Amman, Nov 2026).

**Shared course log (read first, update on every change that affects another area):** see the Claude Doc «سجل الدورة» — its link is in each agent's starter message.

## Layout

| Folder | What | Edit here? |
|---|---|---|
| `backend/` | ASP.NET Core 8 Minimal API + SQL Server (submissions, teams/trainees, feedback, contact, trash). Hosted on MonsterASP: https://web-train.runasp.net | ✅ |
| `site-src/` | **Generator of the website**: `gen_pages.py` (all pages, nav, admin/submit/team-files markup) + `gen_resources.py` (ملفات الدورة page) + `day1_code.txt` | ✅ edit HTML **here**, then regenerate |
| `site/` | The generated static site (Netlify: web-ai-course.netlify.app). `css/` and `js/` are hand-written and edited directly; the `*.html` files come from the generator | ✅ css/js · ❌ html (regenerate) |
| `day1-kit/` | Day 1 printables, WhatsApp texts, starter `my-card` project (also used by the generator) | ✅ |
| `decks/` | Arabic PowerPoint sources (pptxgenjs). `day1.js` standalone; days 2-4 = `headN.js` + (`helpers4.js` for day 4) + `bodyN.js`. Built decks in `decks/out/` | ✅ edit sources, rebuild |
| `tools/` | `package.sh` (regenerate site + bugs copy + zips into `dist/`), `make-bugs-copy.sh` (Day 4 exercise), `build-decks.sh [day]` | |

## Commands

```bash
python3 site-src/gen_pages.py          # regenerate site/*.html
tools/package.sh                       # site + bugs copy + zips in dist/
tools/build-decks.sh 2                 # rebuild Day 2 deck -> decks/out/
```

## Rules that must not break

- «ملفات الدورة» Day 3+: cards with `data-lock` stay hidden until opened from the admin («ملفات الدورة 🔒» tab, table `ContentUnlocks`). Page-hiding only; if the API is down the page shows everything.
- Upload limit: 50MB per file (`Limits.MaxFileMb` + `web.config` + `MAX_FILE_MB` in `submit.js` must match).
- Trainees' projects: **no backend**. Anything that needs one is a display-only UI. JS features (incl. localStorage) are fine.
- The course site itself does use the backend (submit, team files, feedback, contact, admin).
- `API_URL = 'https://web-train.runasp.net'` in `site/js/*.js`.
- Backend schema changes go in `backend/Data/SchemaUpgrade.cs` (idempotent SQL, runs on startup; statements separated by a blank line) **and** `backend/upgrade-database.sql`. The live DB already has data: never rely on `EnsureCreated` for new tables/columns.
- The sandbox has no `dotnet`: Husam builds and publishes the backend himself. Say so whenever backend code changes.
- `backend/appsettings.json` holds placeholders only. The real one lives on the server — never commit secrets.
- Trainee data (Excel exports, reviews) is personal: never commit it (`*.xlsx` is ignored).
- Arabic RTL everywhere; Jordanian dialect for trainee-facing text; technical terms in English.
