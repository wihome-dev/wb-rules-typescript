import { globalIgnores } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginJest from 'eslint-plugin-jest'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.ts'] // Правила TS только для файлов TS.
  })),
  tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.ts'] // Правила TS только для файлов TS.
  })),
  prettierRecommended,
  {
    files: ['tests/**/*.{js,ts}'],
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
    'types/',
    'jest.config.ts'
  ]),
  {
    rules: {
      // Для поддержки конструкций вида dev['deviceId']['control']
      '@typescript-eslint/dot-notation': 'off',
      // Для поддержки конструкций вида dev['deviceId']['control']
      '@typescript-eslint/no-unsafe-member-access': 'off'
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
)
