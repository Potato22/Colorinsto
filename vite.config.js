import {
    defineConfig
} from 'vite'
export default defineConfig({
    // Base public path
    base: '/',

    // Server options
    //server: {
    //    port: 3000,
    //    open: true
    //},

    // Build options
    build: {
        outDir: 'dist',
        minify: true
    },

    // Resolve aliases
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})