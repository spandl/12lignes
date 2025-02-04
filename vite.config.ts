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
                assetFileNames: (assetInfo) => {
                    const fileName = assetInfo.names[0] as string; // Type assertion to avoid TS error
                    if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(fileName)) {
                        return 'images/[name][extname]'; // Images go to /images
                    }
                    return 'css/[name][extname]'; // CSS stays in /css
                },
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
                { src: 'images/**/*.{png,jpg,jpeg,gif,svg,webp,avif}', dest: 'images' },
            ],
        }),
    ],
    server: {
        port: 5173, // Ensure this matches the debugger URL
    },
});
