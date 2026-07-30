// Prerender for the test-only page. Vite outputs the entry as index-test.html;
// we inject the server-rendered app HTML and write it out as index.html.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { render } from './dist-server-test/entry-server.js'

const src = 'dist-test/index-test.html'
const dest = 'dist-test/index.html'
const template = readFileSync(src, 'utf-8')
const appHtml = render()

if (!template.includes('<div id="root"></div>')) {
  throw new Error('Could not find <div id="root"></div> in dist-test/index-test.html')
}

const out = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
writeFileSync(dest, out)
try {
  unlinkSync(src) // remove index-test.html; the deployable file is index.html
} catch (e) {
  /* ignore */
}
console.log(`Prerendered ${dest} — injected ${appHtml.length} chars of app HTML.`)
