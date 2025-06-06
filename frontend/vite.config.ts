import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy':
        "default-src 'self' https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com https://accounts.google.com https://www.youtube.com/iframe_api; " +
        "img-src 'self' https://cdn.builder.io https://movieposters123.blob.core.windows.net https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net data:; " +
        "frame-ancestors 'none'; " +
        "font-src 'self' fonts.gstatic.com data:; " +
        "connect-src 'self' https://localhost:5000 https://accounts.google.com https://oauth2.googleapis.com https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net; " + // ✅ Allow OAuth token exchange
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.youtube.com https://youtube.com;", // ✅ Allow OAuth login popups
    },
    cors: {
      origin: 'http://localhost:3000',
      credentials: true, // ✅ Allow cookies for authentication
    },
  },
  build: {
    outDir: 'dist', // Output directory
    assetsDir: 'assets', // Where to place assets
    rollupOptions: {
      output: {
        // Ensure JavaScript files have proper extensions
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  publicDir: 'public',
});
