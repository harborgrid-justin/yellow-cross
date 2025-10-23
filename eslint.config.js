/**
 * ESLint Configuration (v9 format)
 * Migrated from .eslintrc.json to flat config format
 */

import globals from 'globals';

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest
      }
    },
    rules: {
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': 'off', // Allow console for logging
      'no-undef': 'error',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'no-var': 'error',
      'prefer-const': 'warn',
      'arrow-spacing': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2 }],
      'eol-last': ['warn', 'always']
    }
  },
  {
    // Ignore patterns
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      'frontend/dist/**',
      'backend/dist/**',
      'docs/api/**'
    ]
  }
];
