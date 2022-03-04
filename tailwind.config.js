const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: [
    './pages/**/*.{tx,tsx}',
    './components/**/*.{tx,tsx}',
    './layouts/**/*.{tx,tsx}',
    './lib/**/*.{tx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Source Sans Pro', ...defaultTheme.fontFamily.serif],
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        syne: ['Syne', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.teal,
        gray: colors.neutral,
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}

