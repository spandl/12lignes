import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    root: './src', // Project root
    build: {
        outDir: '../dist', // Ensure the dist is relative to the root
        emptyOutDir: true, // Clear the dist folder before building
        sourcemap: true, // Enable separate source maps
        rollupOptions: {
            output: {
                assetFileNames: 'css/[name].[hash][extname]', // Output CSS in /css directory
            },
        },
        target: 'esnext', // Use 'esnext' for modern syntax, but ensure compatibility
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'audio/**/*.{wav,mp3}',
                    dest: 'audio',
                },
            ],
        }),
    ],
    server: {
        port: 5173, // Ensure this matches the debugger URL
    },
});
