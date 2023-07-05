module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: false,
    },
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/extensions': 'off',
    'max-classes-per-file': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-html': 'off',
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/no-static-element-interactions': 'off',
    semi: ['error', 'never'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
    {
      files: ['src/**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      parserOptions: {
        project: true,
      },
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      }
    },
    {
      files: ['tests/unit/**/*.ts'],
      plugins: ['chai-expect', 'chai-friendly', 'mocha'],
      env: {
        mocha: true,
      },
      extends: [
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      parserOptions: {
        project: true,
      },
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      }
    },
    {
      files: ['tests/unit/**/*.spec.ts'],
      rules: {
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['tests/e2e/**/*.ts'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true,
      },
      extends: [
        'plugin:cypress/recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
      parserOptions: {
        project: true,
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}
