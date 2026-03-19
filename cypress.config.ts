import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'cypress'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'

// Cypress processes config through tsx, so import.meta.url may not be a file://
// URL. Fall back to process.cwd() if needed.
let projectRoot: string
try {
  projectRoot = path.dirname(fileURLToPath(import.meta.url))
} catch {
  projectRoot = process.cwd()
}
const srcDir = path.resolve(projectRoot, 'src')

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue']

/**
 * Resolve a file path by trying different extensions and index files,
 * similar to how Node/Vite resolves bare specifiers.
 */
function resolveFile(basePath: string): string | null {
  // Try exact path first
  for (const ext of extensions) {
    const filePath = basePath + ext
    if (fs.existsSync(filePath)) return filePath
  }
  // Try as directory with index file
  for (const ext of extensions) {
    const filePath = path.join(basePath, 'index' + ext)
    if (fs.existsSync(filePath)) return filePath
  }
  return null
}

/**
 * Vite plugin that resolves the `@/` alias to the `src/` directory.
 * In Vite 8, the built-in alias plugin does not reliably resolve aliases
 * when running inside Cypress's Node process, so we handle it manually.
 */
function cypressAliasPlugin() {
  return {
    name: 'cypress-resolve-alias',
    enforce: 'pre' as const,
    resolveId(source: string) {
      if (source.startsWith('@/')) {
        const basePath = path.resolve(srcDir, source.slice(2))
        return resolveFile(basePath)
      }
      return null
    },
  } satisfies import('vite').Plugin
}

/**
 * Inline Vite preprocessor for Cypress E2E specs.
 * Replaces cypress-vite which is incompatible with Vite 8 (Rolldown rejects
 * the `manualChunks: false` option that cypress-vite sets).
 */
function vitePreprocessor(): Cypress.FileObject['filePath'] extends string
  ? (file: Cypress.FileObject) => Promise<string>
  : never {
  // Serialize builds to avoid Rolldown conflicts from parallel vite.build() calls
  let buildQueue: Promise<void> = Promise.resolve()

  return (async (file: Cypress.FileObject) => {
    const { outputPath, filePath } = file
    const fileName = path.basename(outputPath)
    const filenameWithoutExtension = path.basename(outputPath, path.extname(outputPath))

    const currentBuild = buildQueue.then(async () => {
      await build({
        configFile: false,
        logLevel: 'warn',
        plugins: [cypressAliasPlugin(), vue()],
        define: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        },
        resolve: {
          alias: {
            '@': srcDir,
          },
        },
        build: {
          emptyOutDir: false,
          minify: false,
          outDir: path.dirname(outputPath),
          sourcemap: true,
          write: true,
          watch: null,
          lib: {
            entry: filePath,
            fileName: () => fileName,
            formats: ['umd'],
            name: filenameWithoutExtension,
          },
        },
      })
    })
    buildQueue = currentBuild.catch(() => undefined)
    await currentBuild

    return outputPath
  }) as ReturnType<typeof vitePreprocessor>
}

export default defineConfig({
  projectId: '69ff82',
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
  },
})
