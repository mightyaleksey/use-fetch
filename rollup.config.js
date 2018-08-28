import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/cjs.js',
    output: {
      file: 'dist/index.js',
      format: 'iife',
      name: 'usefetch',
    },
    plugins: [
      babel(),
    ],
  },
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
