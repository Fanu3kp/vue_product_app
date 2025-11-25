import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // Uncomment and update the base path when deploying to GitHub Pages
   base: '/vue_product_app/', // Replace 'vue_product_app' with your repository name
});
