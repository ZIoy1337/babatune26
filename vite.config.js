import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 61170,
        watch: {
            ignored: ['**/.vs/**'],
        },
    },
})