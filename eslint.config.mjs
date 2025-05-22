import { globalIgnores } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

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
  globalIgnores([
    'node_modules/',
    'build/',
    'dist/',
    'tsc-replacers/',
    'types/'
  ]),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
)
