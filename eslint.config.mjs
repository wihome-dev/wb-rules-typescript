import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import pluginJest from 'eslint-plugin-jest'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.node } },
  // TypeScript Defaults
  tseslint.configs.strictTypeChecked.map(config => ({
    ...config,
    files: ['**/*.ts']
  })),
  tseslint.configs.stylisticTypeChecked.map(config => ({
    ...config,
    files: ['**/*.ts']
  })),
  // TypeScript Overrides
  {
    files: ['**/*.ts'],
    rules: {
      // Правило несовместимо с wb-rules 2.0
      '@typescript-eslint/prefer-includes': 'off'
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  // TypeScript Type Definition Overrides
  {
    files: ['types/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off'
    }
  },
  // Stylistic Defaults
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    ...stylistic.configs.customize({
      quotes: 'single',
      quoteProps: 'consistent',
      commaDangle: 'never',
      indent: 2
    })
  },
  // Stylistic Overrides
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    rules: {
      '@stylistic/curly-newline': ['error', 'always'],
      '@stylistic/nonblock-statement-body-position': ['error', 'below']
    }
  },
  // Jest Defaults
  {
    files: ['tests/**/*.test.{js,ts}'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error'
    }
  },
  globalIgnores([
    'node_modules/',
    'build/',
    'dist/',
    'tsc-replacers/',
    'types/'
  ])
])
