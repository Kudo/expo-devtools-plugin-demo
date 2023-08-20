import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()], base: '/_expo/plugins/expo-plugin-tinybase-inspector', build: {
  assetsDir: 'static',
  copyPublicDir: false,
} });
