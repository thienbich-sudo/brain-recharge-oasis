import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LangContext.tsx'
import { registerSW } from 'virtual:pwa-register'

// Lắng nghe bản cập nhật PWA Service Worker để tránh bị kẹt Cache
const updateSW = registerSW({ 
  onNeedRefresh() {
    if (confirm('Brain Recharge Oasis đã có phiên bản nâng cấp (Cập nhật tính năng Lặp vòng Yoga & Nút Lùi). Cập nhật ngay?')) {
      updateSW(true);
    }
  },
  immediate: true 
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
