import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    basicSsl(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'icone.png',
      ],

      manifest: {
        name: 'Mapa Operacional',
        short_name: 'Mapa',
        description: 'Sistema de gerenciamento do Mapa Operacional',

        start_url: '/',
        scope: '/',
        display: 'standalone',

        background_color: '#ffffff',
        theme_color: '#08345f',

        orientation: 'portrait',

        icons: [
          {
            src: '/icone.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icone.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icone.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],

  server: {
    host: true,
    https: true,
  },
})