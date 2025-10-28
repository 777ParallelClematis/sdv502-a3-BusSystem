// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,  
        ...globals.jest,     
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
  {
    files: ['__tests__/**/*.mjs'],
    languageOptions: {
      globals: globals.jest,
    },
  },
];