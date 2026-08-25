import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE_PATH ?? (command === 'build' ? '/image-rights-promotion-flow-v1/' : '/'),
  plugins: [react(), tsconfigPaths(), ...(process.env.SINGLE_FILE ? [viteSingleFile()] : [])],
  css: {
    postcss: './postcss.config.cjs',
  },
  resolve: {
    alias: {
      'styled-system': path.resolve(__dirname, './styled-system'),
    },
  },
}))
