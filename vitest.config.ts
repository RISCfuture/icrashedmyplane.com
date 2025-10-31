import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
import * as path from 'node:path'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', 'cypress/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      setupFiles: ['./vitest.setup.ts']
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@cypress': path.resolve(__dirname, './cypress')
      }
    }
  })
)
