import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// import EsLint from 'vite-plugin-linter'
import tsConfigPaths from 'vite-tsconfig-paths';
import * as packageJson from './package.json';

// const { EsLinter, linterPlugin } = EsLint
// https://vitejs.dev/config/
// export default defineConfig((configEnv) => ({
export default defineConfig(() => ({
  plugins: [
    react(),
    tsConfigPaths(),
    // linterPlugin({
    //   include: ['./src}/**/*.{ts,tsx}'],
    //   linters: [new EsLinter({ configEnv })],
    // }),
    // dts({
    //   include: ['src/'],
    // }),
  ],
  build: {
    lib: {
      entry: resolve('src', 'main.tsx'),
      name: 'ReactDataTable',
      formats: ['es', 'umd'],
      fileName: (format) => `react-data-table.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
}))