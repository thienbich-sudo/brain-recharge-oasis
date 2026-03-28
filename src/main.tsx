import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LangContext.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register the PWA service worker explicitly for Chrome WebAPK installation
registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
