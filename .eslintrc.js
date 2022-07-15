/** @type {import("eslint").Linter.Config} */

module.exports = {
  env: {
    es6: true,
  },
  extends: ['react-app', 'plugin:storybook/recommended'],
  plugins: ['no-only-tests', 'simple-import-sort', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  overrides: [
    {
      files: [
        'pages/**.tsx',
        'pages/**/*.tsx',
        './tailwind.config.js',
        'src/components/**/*.stories.tsx',
      ],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],

  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowDirectConstAssertionInArrowFunctions: true,
      },
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    // this gets inlined into a package eslint, so it means: use current package's package.info or the one at the project root
    'import/no-extraneous-dependencies': [
      'error',
      { packageDir: ['./', __dirname] },
    ],
    // this rule can't find automatically mistakes and needs to be guided
    'import/no-internal-modules': ['error', { forbid: ['**/utils/*'] }],
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    'no-console': 'error',
    'no-debugger': 'error',
    'no-only-tests/no-only-tests': 'error',
    'no-with': 'error',
    'one-var': ['error', { initialized: 'never' }],
    'prefer-const': ['error', { destructuring: 'all' }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'unused-imports/no-unused-imports-ts': 'error',
    'storybook/no-redundant-story-name': 'off',
    'storybook/prefer-pascal-case': 'off',
    // Extracted from typestrict, because of @typescript-eslint react-app - typestrict conflict
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
  },
};
