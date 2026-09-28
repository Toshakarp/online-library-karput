import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'shared-types': path.resolve(__dirname, '../packages/shared-types/src/index.ts'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 4000,
        strictPort: true,
    },
});