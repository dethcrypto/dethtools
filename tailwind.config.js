const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: ['./{pages,src}/**/*.{tx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.teal,
        gray: colors.neutral,
        'deth-pink': '#FF34F0',
        'deth-purple': '#9B37FF',
        'deth-error': '#FF3459',
        'deth-success': '#4ADE80',
        'deth-white': '#FFFFFF',
        'deth-gray-100': '#F2EFF6',
        'deth-gray-200': '#F2EFF6',
        'deth-gray-300': '#AAA4B6',
        'deth-gray-400': '#938D9E',
        'deth-gray-500': '#55515B',
        'deth-gray-600': '#353239',
        'deth-gray-700': '#222025',
        'deth-gray-800': '#19181C',
        'deth-gray-900': '#171619',
      },
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
              color: theme('colors.deth-gray-800'),
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
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
