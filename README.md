# Rímskokatolícka farnosť Lokca — webová stránka

Nová verzia farskej stránky (pôvodne WordPress, obnovená z archívu web.archive.org).
Postavená na **Next.js 14 + SQLite** s vlastnou administráciou.

## Čo stránka obsahuje

- Rovnaký vzhľad a štruktúra ako pôvodná stránka (logo, menu, citát, Aktuality, pätička)
- Všetkých 28 obsahových stránok obnovených z archívu (História, Kostoly, Kňazi, Sviatosti, Aktivity, Kontakt…)
- 74 obrázkov zachránených z archívu (`public/assets/uploads/`)
- **Oznamy** — farské oznamy s archívom a prílohou (PDF/obrázok)
- **Aktuality** — novinky/články s úvodným obrázkom
- **Fotogaléria** — albumy spravované v administrácii
- **Odber noviniek** — návštevníci sa prihlásia e-mailom; pri zverejnení nového oznamu
  alebo aktuality môže admin jedným klikom rozoslať e-mail všetkým odberateľom
- **Administrácia na `/admin`** — úprava všetkých stránok, oznamov, aktualít, galérie
  a nastavení priamo na webe. Po prihlásení sa na stránkach zobrazuje plávajúce
  tlačidlo „✎ Upraviť“ (úprava priamo zo stránky, na ktorej sa nachádzate).

## Spustenie (vývoj)

```bash
npm install
cp .env.example .env.local   # a vyplňte hodnoty
npm run seed                 # naplní databázu obsahom z data/import/
npm run dev                  # http://localhost:3000
```

## Nastavenie (.env.local)

| Premenná | Význam |
|---|---|
| `ADMIN_PASSWORD` | heslo do administrácie `/admin` |
| `SESSION_SECRET` | náhodný reťazec (min. 32 znakov) pre bezpečné cookies |
| `SITE_URL` | verejná adresa webu (používa sa v odkazoch v e-mailoch) |
| `SMTP_HOST/PORT/USER/PASS/FROM` | SMTP server na odosielanie e-mailov (Websupport, Gmail app-password, Resend…) |

**Poznámka k e-mailom:** kým SMTP nie je vyplnené, prihlásenie na odber funguje
(bez potvrdzovacieho e-mailu) a tlačidlo „Uložiť a poslať odberateľom“ zahlási chybu.
Po vyplnení SMTP funguje potvrdzovanie odberu aj hromadné rozosielanie.

## Nasadenie (produkcia)

```bash
npm run build
npm start        # alebo cez PM2 / systemd na VPS
```

Stránka potrebuje Node.js server (VPS, Railway, Render…). Databáza je súbor
`data/site.db`, nahrané súbory sú v `public/uploads/` — oboje pravidelne zálohujte.

## Štruktúra

- `app/` — stránky a API (Next.js App Router)
- `app/admin/` — administrácia
- `components/` — navigácia, editor, odberový formulár…
- `lib/` — databáza (better-sqlite3), prihlásenie (iron-session), e-maily (nodemailer)
- `scripts/seed.js` — jednorazové naplnenie databázy z `data/import/*.json`
- `public/assets/uploads/` — obrázky obnovené z archívu

## Čo sa z archívu nepodarilo zachrániť

- ~120 obrázkov v článkoch a **všetky fotky z pôvodnej fotogalérie** (321 súborov) —
  Wayback Machine ich nikdy nezaarchivoval. Ak máte zálohu starého webu alebo fotky
  v počítači, nahrajte ich cez administráciu (Galéria / editor obrázkov).
- Súbor `mostbet.jpg` z roku 2024 bol z archívu vylúčený — vyzerá ako spam z hacknutého
  WordPressu.
