import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Second page: https://www.translations.co.uk/translation-agency-test-only/
// Independent source in src-test/, builds to dist-test/.
export default defineConfig({
  base: '/translation-agency-test-only/',
  plugins: [react()],
  build: {
    outDir: 'dist-test',
    rollupOptions: { input: 'index-test.html' },
  },
})
