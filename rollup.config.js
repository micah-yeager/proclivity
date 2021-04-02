import path from 'path'

import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'

import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import del from 'rollup-plugin-delete'
import zip from 'rollup-plugin-zip'

const isProduction = process.env.NODE_ENV === 'production'

// Aliases for module resolution
const projectRootDir = path.resolve(__dirname)
const aliases = [
  {
    find: 'src',
    replacement: path.resolve(projectRootDir, 'src'),
  },
]
if (isProduction) {
  aliases.concat([
    {
      find: 'react',
      // Use the production build
      replacement: require.resolve('react/esm/react.production.min.js'),
    },
    {
      find: 'react-dom',
      // Use the production build
      replacement: require.resolve('react-dom/esm/react-dom.production.min.js'),
    },
  ])
}

export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: path.join('chunks', '[name]-[hash].js'),
  },
  plugins: [
    chromeExtension({ browserPolyfill: true }),
    // Adds a Chrome extension reloader during watch mode
    simpleReloader(),
    alias({ entries: aliases }),
    // Replace environment variables
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    babel({
      // Do not transpile dependencies
      ignore: ['node_modules'],
      babelHelpers: 'bundled',
    }),
    resolve({ preferBuiltins: false }),
    commonjs(),
    json({ compact: true }),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
    cleanup({ comments: 'none' }),
    // Empties the output dir before a new build
    del({ targets: 'dist/*' }),
    // Outputs a zip file in ./releases
    isProduction && zip({ dir: 'releases' }),
  ],
}
