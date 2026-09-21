# korabia.co

The Korabia website — car export from Korea and China to the Middle East.
Five languages (Arabic default, English, Russian, Spanish, Korean), a 48-hour
daily-offers system, and a phone-installable admin dashboard.

## How it is deployed

This repository is connected to **Cloudflare Workers Builds**. Every push to
`main` makes Cloudflare install, build and deploy the site automatically. No
local build and no manual deploy step is involved.

| Setting          | Value                    |
| ---------------- | ------------------------ |
| Root directory   | `app`                    |
| Build command    | `bun run build`          |
| Deploy command   | `bunx wrangler deploy`   |
| Worker name      | `korabia`                |

The Worker name in `app/wrangler.jsonc` must stay `korabia` — Workers Builds
refuses the build if it does not match the Worker in the dashboard.

## Cloudflare resources

| Resource | Binding   | Name / id                                      |
| -------- | --------- | ---------------------------------------------- |
| Worker   | —         | `korabia`                                       |
| D1       | `DB`      | `korabia-db` · `a2bcfbe1-bda8-42c0-8c67-82fbcb03333f` |
| R2       | `STORAGE` | `korabia-assets`                                |
| Domains  | —         | `korabia.co`, `www.korabia.co` (301 → apex)     |

`ADMIN_PASSWORD` is a Worker secret. It is set in the Cloudflare dashboard and
never lives in this repository; `wrangler deploy` keeps existing secrets.

## Layout

    app/src/site/        page sections, per-language dictionaries, head tags
    app/src/routes/      one route per language plus /admin and the APIs
    app/src/lib/api/     server functions for offers, requests and admin data
    app/src/components/  site and admin components
    app/migrations/      D1 schema (additive)

## Local development

    cd app
    bun install
    bun run dev

## Things that are deliberately not published

The representative's date of birth and the company's registration date are held
back from the site and from its structured data. Only the registration number,
trade name, representative name and registered address are shown.
