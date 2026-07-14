# ukt-landing-page

Google Ads landing page for **translations.co.uk** — served at
`https://www.translations.co.uk/translation-agency/`.

Built with **React + Vite**. The quote form posts to a small PHP backend
(`/api`) that stores submissions in the WordPress database, saves uploaded
documents, and emails a notification + customer confirmation via GSuite SMTP.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Structure

- `src/` — React app (`App.jsx`, `data.js`, `index.css`)
- `public/` — static assets (`uploads/`, self-hosted `fonts/`, `.htaccess`)
- `api/` — PHP backend (`submit.php`, `smtp_mailer.php`, `schema.sql`, …)
- `index.html` — page shell, tracking (GTM / Clarity / Clicky / Ads), FAQ schema

## Deploy

`vite build`, then upload `dist/` to the site root and `api/` to `/api` via SFTP.
The page is configured for the `/translation-agency/` base path.

> Secrets (`api/config.php`, `.claude/`) are git-ignored and must be configured
> directly on the server.
