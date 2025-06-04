import multi from '@rollup/plugin-multi-entry'
import typescript from '@rollup/plugin-typescript'
import dotenv from '@dotenv-run/rollup'
import del from 'rollup-plugin-delete'
import tscAlias from 'rollup-plugin-tsc-alias'

export default {
  input: ['src/wb-rules/*.ts'],
  plugins: [
    multi({ preserveModules: true }),
    typescript(),
    dotenv({
      prefix: '^APP_',
      verbose: false
    }),
    del({
      targets: 'dist/*',
      hook: 'buildStart',
      verbose: false
    }),
    tscAlias(),
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
