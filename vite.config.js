import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Palpitaria da Copa',
        short_name: 'Palpitaria',
        description: 'Faça seus palpites para os jogos da Copa do Mundo.',
        theme_color: '#061A12',
        background_color: '#061A12',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'pt-BR',
        icons: [
          {
            src: '/pwa/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Fazer palpite',
            short_name: 'Palpites',
            description: 'Criar um palpite para uma partida',
            url: '/palpites',
            icons: [{ src: '/pwa/icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Ver confrontos',
            short_name: 'Confrontos',
            description: 'Ver jogos da fase de grupos',
            url: '/confrontos',
            icons: [{ src: '/pwa/icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Ver grupos',
            short_name: 'Grupos',
            description: 'Ver grupos da Copa do Mundo 2026',
            url: '/grupos',
            icons: [{ src: '/pwa/icons/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webp,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'copa-data'
            }
          },
          {
            urlPattern: /\/(flags|square-flags|escudos|assets)\/.*\.(png|svg|webp|jpg|jpeg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'copa-images',
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ]
});
