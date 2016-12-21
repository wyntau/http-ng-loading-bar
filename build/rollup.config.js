// rollup.config.js
import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/interceptor.ts',
  dest: 'loading-bar.js',
  format: 'umd',
  moduleName: 'loadingBar',
  exports: 'named',

  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
