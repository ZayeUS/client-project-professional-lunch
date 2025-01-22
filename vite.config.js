import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        server: {
            proxy: {
                "/api":'https://client-project-professional-lunch.fly.dev/',
            }
        },
        plugins: [react()],
    };
});
