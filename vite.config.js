import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // The page is served from https://www.translations.co.uk/translation-agency/
  base: '/translation-agency/',
  plugins: [react()],
})
