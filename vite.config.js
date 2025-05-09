import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
  plugins: [
    qrcode() // This will show a QR code in the terminal
  ],
  server: {
    open: true // Automatically open browser when starting dev server
  }
}); 