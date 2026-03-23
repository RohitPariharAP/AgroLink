// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the app when you push new code
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AgroLink Farm Platform',
        short_name: 'AgroLink',
        description: 'Empowering farmers with AI, community, and a local marketplace.',
        theme_color: '#3dd68c', // Your brand's mint green
        background_color: '#ffffff',
        display: 'standalone', // Makes it look like a native app (hides the browser URL bar)
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // This tells the service worker to cache all your UI files for offline use!
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jsx}'],
        runtimeCaching: [
          {
            // Cache OpenWeatherMap API calls so the last known weather shows offline
            urlPattern: /^https:\/\/api\.openweathermap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'weather-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // Keep weather for 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
});