/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
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
  ],
  testTimeout: 500
}

export default config
