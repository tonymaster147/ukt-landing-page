import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only: also serve the exact same page at /translation-agency-test-only/
// (a mirror), so `npm run dev` lets you open either URL.
const testOnlyMirror = {
  name: 'dev-test-only-mirror',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && req.url.startsWith('/translation-agency-test-only')) {
        req.url = req.url.replace('/translation-agency-test-only', '/translation-agency')
      }
      next()
    })
  },
}

export default defineConfig({
  // The page is served from https://www.translations.co.uk/translation-agency/
  base: '/translation-agency/',
  plugins: [react(), testOnlyMirror],
})
