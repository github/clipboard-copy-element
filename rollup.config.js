/* @flow */

import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg['module'],
      format: 'es'
    },
    {
      file: pkg['main'],
      format: 'umd',
      name: 'ClipboardCopyElement'
    }
  ],
  plugins: [
    babel({
      presets: ['github']
    })
  ]
}
