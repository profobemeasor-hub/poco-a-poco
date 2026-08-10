import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const REPO = 'poco-a-poco';
const pagesBase = `/${REPO}/`;

export default defineConfig(({ command }) => ({
  // GitHub Pages serves project sites from /<repository>/.
  // Keep local development at / so START_ON_MAC.command still works unchanged.
  base: command === 'build' ? pagesBase : '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Poco a Poco — Español Guatemala',
        short_name: 'Poco a Poco',
        description: 'Spanish practice for everyday life and work in Guatemala.',
        theme_color: '#0E2B2A',
        background_color: '#0E2B2A',
        display: 'standalone',
        start_url: pagesBase,
        scope: pagesBase,
        orientation: 'portrait-primary',
        icons: [
          { src: `${pagesBase}pwa-192x192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${pagesBase}pwa-512x512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${pagesBase}pwa-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true
      }
    })
  ]
}));
