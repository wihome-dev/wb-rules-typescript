import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const tsJestTransformCfg = createDefaultPreset().transform

const config: Config = {
  transform: {
    ...tsJestTransformCfg
  },
  globals: {
    __TEST__: true,
    __DEV__: true
  },
  moduleNameMapper: {
    '@wb/(.*)': '<rootDir>/src/wb-rules/$1',
    '@wbm/(.*)': '<rootDir>/src/wb-rules-modules/$1'
  },
  setupFiles: [
    '<rootDir>/tests/dotenv-setup.ts',
    '<rootDir>/tests/wb-engine-setup.ts'
  ]
}

export default config
