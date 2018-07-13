import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';


export default [
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/index.js',
      format: 'iife',
      name: 'useFetch',
    },
    plugins: [
      babel(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/index.min.js',
      format: 'iife',
      name: 'useFetch',
    },
    plugins: [
      babel(),
      uglify(),
    ],
  }
];
