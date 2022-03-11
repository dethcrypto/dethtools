process.env.NODE_ENV = 'test'

module.exports = {
  require: [
    'global-jsdom/register',
    'ts-node/register/transpile-only',
    'earljs/mocha'
  ],
  extension: ['ts', 'tsx'],
  watchExtensions: ['ts', 'tsx'],
  spec: ['./{components,layout,lib,pages}/**/*.test.{ts,tsx}'],
  timeout: 5000,
}
