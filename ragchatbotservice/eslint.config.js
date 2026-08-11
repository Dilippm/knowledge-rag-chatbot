import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
export default [
  js.configs.recommended,

  {
    files: ['src/**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'preserve-caught-error': 'off',

      'no-console': 'off',

      'no-undef': 'error',

      'prefer-const': 'warn',

      'no-var': 'error',

      eqeqeq: ['error', 'always'],

      'object-shorthand': 'warn',

      'prefer-template': 'warn',
    },
    eslintConfigPrettier,
  },
];
