import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// The test page is a plain client-rendered SPA (no prerender).
createRoot(document.getElementById('root')).render(<App />)
