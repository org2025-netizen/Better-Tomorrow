/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B2A5B',
          50: '#E8EDF5',
          100: '#D1DBEB',
          200: '#A3B7D7',
          300: '#7593C3',
          400: '#476FAF',
          500: '#0B2A5B',
          600: '#09224A',
          700: '#071A38',
          800: '#051227',
          900: '#030A15',
        },
        secondary: {
          DEFAULT: '#D71920',
          50: '#FDE8E8',
          100: '#FBD1D2',
          200: '#F7A3A5',
          300: '#F37578',
          400: '#EE474B',
          500: '#D71920',
          600: '#AC141A',
          700: '#810F13',
          800: '#560A0D',
          900: '#2B0506',
        },
        accent: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E8',
          100: '#F7EDD1',
          200: '#EFDBA3',
          300: '#E7C975',
          400: '#DFB747',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#7F6921',
          800: '#554616',
          900: '#2A230B',
        },
        light: '#F7F9FC',
        dark: '#111827',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
