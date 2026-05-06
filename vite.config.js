import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  VitePWA({
    registerType: "autoUpdate", // keeps service worker fresh
    includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
    manifest: {
      name: "Noira Therapist App",
      short_name: "Noira",
      description: "Therapist dashboard progressive web app",
      theme_color: "#111111",
      background_color: "#111111",
      display: "standalone",
      start_url: "/",
      icons: [
        {
          src: "/noira-london-vip.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/noira-london-luxury..png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/noira-london-luxury..png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    }
  })
  ],
})
