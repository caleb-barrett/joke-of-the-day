import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

const alias = { '@': resolve(__dirname, 'src') };

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias },
  },
  renderer: {
    resolve: { alias },
  },
});
