/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'modal-open': {
          '0%': { opacity: '0', scale: '0.95' },
          '100%': { opacity: '1', scale: '1' },
        },
        'modal-close': {
          '0%': { opacity: '1', scale: '1' },
          '100%': { opacity: '0', scale: '0.95' },
        },
        'overlay-open': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'overlay-close': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'modal-open': 'modal-open 0.125s ease-out',
        'modal-close': 'modal-close 0.125s ease-in forwards',
        'overlay-open': 'overlay-open 0.125s ease-out',
        'overlay-close': 'overlay-close 0.125s ease-in forwards',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}