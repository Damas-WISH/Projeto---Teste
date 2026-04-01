// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Configure for Firebase Hosting
  outDir: './dist',
  publicDir: './public',
  // Build output is optimized for static hosting
  output: 'static',
});
