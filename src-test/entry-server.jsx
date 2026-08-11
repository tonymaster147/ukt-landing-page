import { renderToString } from 'react-dom/server'
import App from './App.jsx'

// Called at build time to produce the static HTML injected into #root, so the
// page paints text immediately instead of waiting for the JS bundle.
export function render() {
  return renderToString(<App />)
}
