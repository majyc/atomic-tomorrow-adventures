import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for deployment flexibility
  publicDir: 'public',  
  build: {
    outDir: process.env.NODE_ENV === 'production' && process.env.BUILD_TARGET === 'site' 
      ? '../../../sfxrpg.com/tools/character-creator'  // Adjust path as needed
      : 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false, // Set to true if you want source maps in production
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting for better compatibility
      }
    }
  }
})