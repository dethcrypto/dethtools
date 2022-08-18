process.env.NODE_ENV = 'test';

module.exports = {
  require: [
    'raf/polyfill',
    'jsdom-global/register',
    'ts-node/register/transpile-only',
    './test/require-extensions.ts',
    'earljs/mocha',
    'esm',
  ],
  extension: ['ts', 'tsx'],
  watchExtensions: ['ts', 'tsx'],
  spec: ['./{src,pages}/**/*.test.{ts,tsx}'],
  timeout: 5000,
  exit: true, // @See ./docs/MOCHA_REACT_BUG.md
};
