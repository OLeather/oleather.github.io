/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}", "./node_modules/tw-elements/dist/js/**/*.js"],
  plugins: [require("tw-elements/dist/plugin.cjs")],
  theme: {
    extend: {
      keyframes: {
        expand: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(2) translateX(25%)' },
        }
      },
      animation: {
        expand: 'expand 1s'
      }

    },
  },
  plugins: []
}