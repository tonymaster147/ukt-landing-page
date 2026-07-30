import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { renameSync, existsSync } from 'node:fs'

// Build the independent test page for upload to /translation-agency-test-only/.
export default defineConfig({
  base: '/translation-agency-test-only/',
  plugins: [
    react(),
    {
      // Vite names the output after the input (index-test.html); rename to index.html.
      name: 'rename-test-html',
      closeBundle() {
        const from = 'dist-test/index-test.html'
        const to = 'dist-test/index.html'
        if (existsSync(from)) renameSync(from, to)
      },
    },
  ],
  build: {
    outDir: 'dist-test',
    rollupOptions: { input: 'index-test.html' },
  },
})
