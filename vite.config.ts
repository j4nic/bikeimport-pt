import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3030,
        host: '0.0.0.0',
      },
      preview: {
        host: '0.0.0.0',
        port: parseInt(process.env.PORT || '8080'),
        allowedHosts: [
          '.run.app', // Erlaubt alle Cloud Run Domains
          'localhost',
          '127.0.0.1'
        ]
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
