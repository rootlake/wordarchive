import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
  plugins: [
    qrcode() // This will show a QR code in the terminal
  ],
  base: '/wordarchive/', // Set the base path for GitHub Pages
  server: {
    open: true // Automatically open browser when starting dev server
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Make sure script.js is directly copied to output
      input: {
        main: './index.html'
      }
    }
  }
}); 