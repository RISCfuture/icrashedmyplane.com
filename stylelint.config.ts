import type { Config } from 'stylelint'

const config: Config = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['deep', 'global', 'slotted'] },
    ],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}

export default config
