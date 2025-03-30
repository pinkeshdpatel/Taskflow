/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1C1C1C',
        surface: '#242424',
        'surface-light': '#2C2C2C',
      },
    },
  },
  plugins: [],
};