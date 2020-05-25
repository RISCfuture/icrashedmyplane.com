module.exports = {
  plugins: [
    'cypress'
  ],
  env: {
    'cypress/globals': true
  },
  rules: {
    strict: 'off'
  },
  extends: [
    'plugin:cypress/recommended'
  ]
}
