import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Дата сборки показывается в настройках
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
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
        // «Лаборатория» — отдельная страница. Если открыть её по прямой ссылке,
        // воркер не должен подменять её главной страницей приложения.
        navigateFallbackDenylist: [/\/lab\//],
        // Игры открываются с адресом lab/index.html?game=duel: в кэше страница лежит
        // одна, поэтому параметр игры при поиске в кэше не учитываем (иначе офлайн не работает)
        ignoreURLParametersMatching: [/^game$/],
      },
    }),
  ],
});
