// @ts-check
import { create } from '@storybook/theming';

import { theme as tailwindTheme } from '../tailwind.config';

const { colors } = tailwindTheme;

export const storybookTheme = create({
  base: 'dark',

  colorPrimary: colors.purple,
  colorSecondary: colors.pink,

  appBg: colors.gray['700'],
  appContentBg: colors.gray['800'],
  appBorderColor: colors.gray['700'],
  appBorderRadius: 12,

  fontBase: 'Inconsolata, monospace',
  fontCode: 'monospace',

  textColor: colors.gray['100'],

  barTextColor: colors.gray['300'],
  barSelectedColor: colors.gray['100'],
  barBg: colors.gray['800'],

  inputBg: colors.gray['700'],
  inputBorder: 'transparent',
  inputTextColor: colors.gray['100'],
  inputBorderRadius: 6,

  brandTitle: 'dΞth components',
  // brandUrl: 'https://example.com',
  // brandImage: 'https://place-hold.it/350x150',
});
