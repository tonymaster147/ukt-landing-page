// Injects the test page's server-rendered HTML into dist-test/index.html so the
// static file contains the full page (text + layout) on first paint, while the
// client still hydrates it into a live React app.
import { readFileSync, writeFileSync } from 'node:fs'
import { render } from './dist-test-server/entry-server.js'

const file = 'dist-test/index.html'
const template = readFileSync(file, 'utf-8')
const appHtml = render()

if (!template.includes('<div id="root"></div>')) {
  throw new Error('Could not find <div id="root"></div> in dist-test/index.html')
}

const out = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
writeFileSync(file, out)
console.log(`Prerendered ${file} — injected ${appHtml.length} chars of app HTML.`)
