const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: ['./{pages,src}/**/*.{tx,tsx}'],
  // We'll always in dark mode until we implement light mode.
  // We're using `next-themes` which reads the set color mode from local storage
  // and infers a default from `prefers-color-scheme`.
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      primary: colors.teal,
      pink: '#FF34F0',
      purple: '#9B37FF',
      error: '#FF3459',
      success: '#4ADE80',
      white: '#FFFFFF',
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
            color: theme('colors.white'),
            h1: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '32px',
              fontWeight: 'light',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.pink'),
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
              color: theme('colors.gray.800'),
            },
            p: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '14px',
              color: theme('colors.white'),
            },
            a: {
              marginTop: '0',
              fontSize: '15px',
              textDecoration: 'none',
            },
            code: {
              marginTop: '0',
              fontSize: '15px',
              color: theme('colors.white'),
            },
            pre: {
              marginTop: '0',
              marginBottom: '0',
              fontSize: '12px',
              fontWeight: 'light',
              border: 'none',
              color: theme('colors.gray.300'),
              backgroundColor: theme('colors.gray.900'),
            },
          },
        },
      }),
      spacing: {
        3.75: '0.9375rem', // We often need (16px (1rem) - 1px) to correct for 1px border.
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
