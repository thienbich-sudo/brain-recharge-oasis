import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5176,
    strictPort: true,
    open: true // Tự động mở một tab trình duyệt mới hoàn toàn sạch sẽ
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false // Tạm tắt để dev không bị lưu cache cũ liên tục
      },
      manifest: {
        name: 'Brain Recharge Oasis',
        short_name: 'Oasis',
        description: 'Trạm năng lượng tĩnh lặng cho tâm trí',
        theme_color: '#0a0f1c',
        background_color: '#0a0f1c',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
