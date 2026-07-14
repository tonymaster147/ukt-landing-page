# Quote form backend (PHP)

Handles the landing-page quote form: stores uploaded documents in `files_upload/`,
saves each submission to a database table, and emails a notification (with the files
attached) via GSuite SMTP. Returns JSON so the React form redirects to the thank-you page.

## Files
| File | Purpose |
|------|---------|
| `submit.php` | The endpoint the form POSTs to. |
| `config.php` | DB credentials, SMTP settings, upload limits. **Contains secrets.** |
| `smtp_mailer.php` | Dependency-free SMTP client (STARTTLS + AUTH LOGIN + attachments). |
| `schema.sql` | Creates the `ukt_quote_requests` table. Run once. |
| `files_upload/` | Where uploaded documents are stored (hardened via `.htaccess`). |

## Deploy (WordPress / wpx / Hostinger)

1. **Create the table** — phpMyAdmin → database `translat1` → **SQL** tab → paste the
   contents of `schema.sql` → **Go**. (Creates `ukt_quote_requests`.)

2. **Upload this whole `api/` folder** to your site via FTP/File Manager, e.g. to
   `public_html/lp-api/`. Make sure `files_upload/` is writable (permissions `755`).

3. **Set the public URL** in `config.php` → `FILES_PUBLIC_URL` to match where you put it,
   e.g. `https://www.translations.co.uk/lp-api/files_upload`.

4. **Point the form at it** — in `src/data.js` set
   `SUBMIT_ENDPOINT = 'https://www.translations.co.uk/lp-api/submit.php'`
   (match your upload path), then rebuild the React app (`npm run build`).

5. **Test** — open the site, submit the form. You should: land on the thank-you page,
   see a new row in `ukt_quote_requests`, find the file(s) in `files_upload/`, and receive
   the email at `faruqui.a4u@gmail.com`.

## Notes
- **SMTP**: uses a Google **App Password** for `projects@translations.co.uk`. Outbound
  port **587** must be open on the host. If the email fails, the lead is still saved to the
  DB + folder (email is best-effort); check the server error log for `[quote-submit]`.
- **CORS**: `ALLOWED_ORIGIN` is `*` for easy testing. Once live on the same domain, set it
  to `https://www.translations.co.uk`.
- **Security**: `config.php` holds DB + SMTP secrets — it's blocked from direct HTTP access
  by `.htaccess`, and PHP execution + directory listing are disabled inside `files_upload/`.
  Allowed upload types: pdf, doc(x), odt, rtf, txt, images, xls(x), ppt(x), csv, zip
  (max 15 MB each, up to 10 files).
