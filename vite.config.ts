import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    root: './src', // Project root
    build: {
        outDir: '../dist', // Ensure the dist is relative to the root
        emptyOutDir: true, // Clear the dist folder before building
        sourcemap: true, // Enable separate source maps
        rollupOptions: {
            input: {
                main: './src/index.html',
                test: './src/scroll-test.html',
            },
            output: {
                assetFileNames: 'css/[name][extname]', // .[hash] Output CSS in /css directory
            },
        },
        target: 'esnext', // Use 'esnext' for modern syntax, but ensure compatibility
    },
    css: {
        preprocessorOptions: {
            scss: {
                // Add SCSS options here if necessary
            },
        },
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
