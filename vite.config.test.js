import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { renameSync, existsSync } from 'node:fs'

// Build the independent test page.
// TEST_BASE lets the same config produce a build for a different URL prefix
// (e.g. TEST_BASE=/translation-agency/ when deploying over the live page).
export default defineConfig(({ isSsrBuild }) => ({
  base: process.env.TEST_BASE || '/translation-agency-test-only/',
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
  build: isSsrBuild
    ? { outDir: 'dist-test-server' }
    : { outDir: 'dist-test', rollupOptions: { input: 'index-test.html' } },
}))
