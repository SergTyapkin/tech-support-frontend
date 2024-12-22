import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { robots } from 'vite-plugin-robots'
import Vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path';

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),
    basicSsl(),
    robots(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',

      includeAssets: [],
      manifest: {
        "short_name": "TechTeam",
        "name": "TechTeam Art Club BMSTU",
        "description":  "Cервис для учета мероприятий и участников техподдержки Art Club BMSTU",
        "icons": [
          {
            "src": "/assets/web-app-manifest-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/assets/web-app-manifest-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "theme_color": "#181818",
        "background_color": "#181818",
        "display": "standalone",
        "id": "/?source=pwa",
        "start_url": "/?source=pwa",
        "scope": "/",
        "prefer_related_applications": false,
        "shortcuts": [
          {
            "name": "Мероприятия",
            "short_name": "Мероприятия",
            "description": "Поиск среди всех мероприятий",
            "url": "/events?source=pwa"
          },
          {
            "name": "Мануалы",
            "short_name": "Мануалы",
            "description": "База полезных технических документов",
            "url": "/docs?source=pwa"
          },
          {
            "name": "Профиль",
            "short_name": "Профиль",
            "description": "Ваш профиль",
            "url": "/profile?source=pwa"
          },
          {
            "name": "Рейтинги",
            "short_name": "Рейтинги",
            "description": "Рейтинг всех участников за последний семестр и не только",
            "url": "/ratings?source=pwa"
          }
        ]
      }
    }),
  ],
  server: {
    port: 8000,
    https: true,

    proxy: {
      '/api': {
        target: `http://creativetechteam.bmstu.ru:9000`,
        secure: false,
        changeOrigin: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/image': {
        target: `https://creativetechteam.bmstu.ru`,
        secure: false,
        changeOrigin: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '~', // to use ~ as project root like: "import Some from '~/components/Some.vue'"
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@~', // to use @~ as node_modules root like: "import Some from '@~/Some'"
        replacement: path.resolve(__dirname, 'node_modules')
      }
    ]
  },
  build: {
    // chunkSizeWarningLimit: 600,
    cssCodeSplit: false
  }
});
