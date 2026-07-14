import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root')

// In production the HTML is prerendered, so hydrate it; in dev #root is empty.
if (root.firstElementChild) {
  hydrateRoot(root, <App />)
} else {
  createRoot(root).render(<App />)
}
