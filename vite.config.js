import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // base: './',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/quasar.variables.scss";',
      },
    },
    postcss: './postcss.config.js',
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls,
        // compilerOptions: {
        //   isCustomElement: tag => tag.startsWith('ion-'),
        // },
      },
    }),
    vueDevTools(),
    quasar({
      sassVariables: fileURLToPath(new URL('src/styles/quasar.variables.scss', import.meta.url)),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
