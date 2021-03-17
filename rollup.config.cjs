const path = require('path');
const replacePlugin = require('@rollup/plugin-replace');

module.exports = {
  input: path.resolve('./src/index.js'),
  output: {
    preserveModules: false,
    format: 'cjs',
    file: path.resolve(`./dist/repro.${process.env.DEV ? 'dev.' : ''}js`),
  },
  external: ['rtvjs'],
  treeshake: {
    moduleSideEffects(id) {
      return id !== 'rtvjs';
    },
  },
  plugins: [
    replacePlugin({
      DEV: process.env.DEV ? 'true' : 'false',
      preventAssignment: true,
    }),
  ],
};
