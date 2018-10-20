import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [
  // commonJS
  {
    input: 'src/cjs.js',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
    },
    plugins: [babel()],
  },
  // es
  {
    input: 'src/index.js',
    output: {
      file: 'lib/index.esm.js',
      format: 'esm',
    },
    plugins: [babel()],
  },
  // unpkg
  {
    input: 'src/cjs.js',
    output: {
      file: 'dist/index.js',
      format: 'iife',
      name: 'usefetch',
    },
    plugins: [babel()],
  },
  // unpkg (minified)
  {
    input: 'src/cjs.js',
    output: {
      file: 'dist/index.min.js',
      format: 'iife',
      name: 'usefetch',
    },
    plugins: [
      babel(),
      uglify(),
    ],
  },
];
