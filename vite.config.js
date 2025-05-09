import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
  plugins: [
    qrcode() // This will show a QR code in the terminal
  ],
  base: './',
  server: {
    open: true // Automatically open browser when starting dev server
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false, // Disable minification for easier debugging
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
}); 