module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['chai-expect', 'chai-friendly', 'cypress', 'mocha'],
  extends: [
    '@vue/airbnb',
    '@vue/typescript/recommended',
    'plugin:chai-expect/recommended',
    'plugin:chai-friendly/recommended',
    'plugin:cypress/recommended',
    'plugin:mocha/recommended',
    'plugin:vue/essential'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser', // the typescript-parser for eslint, instead of tslint
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: false
    }
  },
  rules: {
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'angle-bracket' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    'dot-location': ['error', 'object'],
    'implicit-arrow-linebreak': 'off',
    'import/order': ['error', { groups: ['builtin', 'external', 'parent', 'sibling', 'index'] }],
    'import/no-named-default': 'off',
    'max-classes-per-file': 'off',
    'mocha/no-mocha-arrows': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': 'off',
    'no-useless-constructor': 'off',
    semi: ['error', 'never'],
    'vue/script-indent': ['error', 2, { baseIndent: 1 }]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    },
    {
      files: ['src/i18n/strings/**/*.ts'],
      rules: {
        '@typescript-eslint/camelcase': 'off'
      }
    },
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    }
  ]
}
