// @ts-check
// .storybook/main.js

const path = require('path');
const tsconfig = require('../tsconfig.json');

module.exports = {
  stories: ['../src/**/*.stories.{ts,tsx,mdx}'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    config.resolve.modules.push(
      path.resolve(__dirname, '..', tsconfig.compilerOptions.baseUrl),
    );

    return config;
  },
};
