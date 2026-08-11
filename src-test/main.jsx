import { hydrateRoot, createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// The build prerenders the app into #root (see prerender-test.js), so hydrate
// rather than re-render — the markup is already there and paints immediately.
// Fall back to a client render if the shell is empty (e.g. prerender skipped).
const root = document.getElementById('root')

if (root.hasChildNodes()) {
  hydrateRoot(root, <App />)
} else {
  createRoot(root).render(<App />)
}
