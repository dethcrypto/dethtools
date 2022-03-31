const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: ['./{pages,src}/**/*.{tx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: colors.teal,
      'deth-pink': '#FF34F0',
      pink: '#FF34F0',
      'deth-purple': '#9B37FF',
      purple: '#9B37FF',
      'deth-error': '#FF3459',
      error: '#FF3459',
      'deth-success': '#4ADE80',
      success: '#4ADE80',
      'deth-white': '#FFFFFF',
      white: '#FFFFFF',
      'deth-gray': {
        100: '#F2EFF6',
        200: '#F2EFF6',
        300: '#AAA4B6',
        400: '#938D9E',
        500: '#55515B',
        600: '#353239',
        700: '#222025',
        800: '#19181C',
        900: '#171619',
      },
      gray: {
        100: '#F2EFF6',
        200: '#F2EFF6',
        300: '#AAA4B6',
        400: '#938D9E',
        500: '#55515B',
        600: '#353239',
        700: '#222025',
        800: '#19181C',
        900: '#171619',
      },
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.deth-white'),
            fontFamily: '"Inconsolata", monospace',
            h1: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '32px',
              fontWeight: 'light',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.deth-pink'),
            },
            h2: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '28px',
              fontWeight: 'light',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.600'),
            },
            h3: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '24px',
              fontWeight: 'light',
              color: theme('colors.pink.800'),
            },
            h4: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '20px',
              color: theme('colors.deth-gray.800'),
            },
            p: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '14px',
              color: theme('colors.deth-white'),
            },
            a: {
              marginTop: '0',
              fontSize: '15px',
              textDecoration: 'none',
            },
            code: {
              marginTop: '0',
              fontSize: '15px',
              color: theme('colors.deth-white'),
            },
            pre: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '12px',
              fontWeight: 'light',
              border: 'none',
              color: theme('colors.deth-gray.300'),
              backgroundColor: theme('colors.deth-gray.900'),
            },
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
