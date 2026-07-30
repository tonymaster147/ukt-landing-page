import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Dev-only: serve the INDEPENDENT test page (src-test/) at
// /translation-agency-test-only/, so `npm run dev` lets you open either page.
// The two pages have separate source, so editing one never affects the other.
const testPage = {
  name: 'dev-test-only-page',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url || ''
      const isTestHome = url === '/translation-agency-test-only/' || url === '/translation-agency-test-only'
      if (isTestHome) {
        try {
          const file = fileURLToPath(new URL('./index-test.html', import.meta.url))
          let html = readFileSync(file, 'utf-8')
          html = await server.transformIndexHtml('/translation-agency-test-only/', html)
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          res.end(html)
          return
        } catch (e) {
          return next(e)
        }
      }
      // Static assets (uploads/images) requested relative to the test URL:
      // reuse the same public files as the main page.
      if (url.startsWith('/translation-agency-test-only/')) {
        req.url = url.replace('/translation-agency-test-only', '/translation-agency')
      }
      next()
    })
  },
}

export default defineConfig({
  // The (main) page is served from https://www.translations.co.uk/translation-agency/
  base: '/translation-agency/',
  plugins: [react(), testPage],
})
