// .storybook/main.js

const path = require('path');

module.exports = {
  stories: [
    '../**/*.stories.mdx',
    '../**/*.stories.@(ts|tsx)',
    '../components/**/*.stories.mdx',
    '../components/**/*.stories.@(ts|tsx)',
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
    config.resolve.roots = [
      path.resolve(__dirname, '../public'),
      'node_modules',
    ];
    return config;
  },
};
