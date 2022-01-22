module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/consistent-type-definitions': [
      'error', 'interface',
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
    ],
    '@typescript-eslint/member-delimiter-style': [
      'warn', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        },
      },
    ],
    // conflicts with adjacent-overload-signatures: https://github.com/typescript-eslint/typescript-eslint/issues/4029
    // '@typescript-eslint/member-ordering': []
    '@typescript-eslint/naming-convention': [
      'warn',

      // camelCase for variables and class members
      {
        selector: ['variableLike', 'memberLike'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },

      // PascalCase for classes and interfaces
      {
        selector: ['typeLike'],
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },

      // do not enfore format for quoted properties
      {
        'selector': [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        'format': null,
        'modifiers': ['requiresQuotes'],
      },
    ],

    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error'],

    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],

    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],

    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'warn', {
        ignore: [0, 1, -1],
      },
    ],

    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
