// .storybook/main.js

const path = require('path');
const tsconfig = require('../tsconfig.json');

module.exports = {
  stories: [
    '../**/*.stories.mdx',
    '../**/*.stories.@(ts|tsx)',
    '../src/components/**/*.stories.mdx',
    '../src/components/**/*.stories.@(ts|tsx)',
  ],
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
