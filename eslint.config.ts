import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    name: 'app/files-to-ignore',
    ignores: [
      'dist/**',
      'node_modules/**',
      '.yarn/**',
      'e2e/**',
      'coverage/**',
      '.pnp.cjs',
      '.pnp.loader.mjs',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    name: 'app/typescript-project-service',
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  ...pluginVue.configs['flat/strongly-recommended'],
  {
    name: 'app/vue-type-checked',
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      // Disable rules that conflict with Prettier
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  },

  {
    name: 'app/config-files',
    files: ['*.config.ts', '*.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },

  {
    name: 'app/env-dts',
    files: ['env.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  {
    name: 'app/test-files',
    files: ['src/**/__tests__/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  {
    name: 'app/oxlint-compat',
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
)
