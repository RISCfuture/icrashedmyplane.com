module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['vuejs-accessibility'],
  extends: [
    '@vue/airbnb',
    '@vue/typescript/recommended',
    'plugin:vue/essential',
    'plugin:vuejs-accessibility/recommended'
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
    'import/no-named-default': 'off',
    'import/order': ['error', { groups: ['builtin', 'external', 'parent', 'sibling', 'index'] }],
    'max-classes-per-file': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'no-useless-constructor': 'off',
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
    'vuejs-accessibility/click-events-have-key-events': 'off',
    semi: ['error', 'never']
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
        'class-methods-use-this': 'off'
      }
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
