import multi from '@rollup/plugin-multi-entry'
import typescript from '@rollup/plugin-typescript'
import dotenv from '@dotenv-run/rollup'
import del from 'rollup-plugin-delete'

export default {
  input: ['src/wb-rules/*.ts'],
  plugins: [
    multi({ preserveModules: true }),
    typescript(),
    dotenv({
      prefix: '^APP_',
      verbose: false
    }),
    del({ targets: ['build/*', 'dist/*'] })
  ],
  output: {
    format: 'cjs',
    dir: 'build',
    preserveModules: true
  }
}
