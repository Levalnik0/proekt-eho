import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Проект Эхо',
        short_name: 'Эхо',
        description: 'Интерактивный мост доверия между детьми и взрослыми',
        lang: 'ru',
        // start_url не задаём: плагин подставит базовый путь сборки.
        // С жёстким '/' установленное приложение открывало бы корень домена,
        // а на GitHub Pages сайт лежит в подпапке.
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#e8e9eb',
        theme_color: '#e8e9eb',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
});
