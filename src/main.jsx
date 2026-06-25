import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProgressProvider } from './lib/progress.jsx'
import 'highlight.js/styles/github-dark.css'
import './index.css'

// ponytail: HashRouter so deep links work on a plain static/nginx host with zero rewrite config
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </React.StrictMode>,
)
