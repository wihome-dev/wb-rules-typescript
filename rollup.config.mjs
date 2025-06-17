import multi from '@rollup/plugin-multi-entry'
import typescript from '@rollup/plugin-typescript'
import tscAlias from 'rollup-plugin-tsc-alias'
import dotenv from '@dotenv-run/rollup'
import replace from '@rollup/plugin-replace'
import del from 'rollup-plugin-delete'

export default {
  input: ['src/wb-rules/*.ts'],
  plugins: [
    multi({ preserveModules: true }),
    typescript(),
    tscAlias(),
    dotenv({
      prefix: '^APP_',
      verbose: false
    }),
    replace({
      preventAssignment: true,
      __DEV__: process.env.NODE_ENV !== 'production',
      // Автоматически меняется в процессе тестирования
      __TEST__: false
    }),
    del({
      targets: 'dist/*',
      hook: 'buildStart',
      verbose: false
    }),
    del({
      targets: 'dist/_virtual',
      hook: 'closeBundle',
      verbose: false
    })
  ],
  output: {
    format: 'cjs',
    dir: 'dist',
    preserveModules: true
  }
}
