import { renderToString } from 'react-dom/server'
import App from './App.jsx'

// Called at build time to produce the static HTML injected into #root.
export function render() {
  return renderToString(<App />)
}
