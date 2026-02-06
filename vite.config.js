import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '우리 가족 플래너',
        short_name: '가족플래너',
        description: '우리 가족의 행복한 일정을 관리하는 플래너',
        theme_color: '#fafaef',
        background_color: '#fafaef',
        display: 'standalone',
        scope: '/family-planner/',
        start_url: '/family-planner/',
        icons: [
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/family-planner/',
})
