/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f3b4d', // Aizome Indigo
          dark: '#122430',
          light: '#eef2f5',
        },
        accent: {
          DEFAULT: '#8a2e3b', // Crimson Accent
          light: '#fbeef0',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f9f7f1', // Rice Paper Off-white
        },
        ink: {
          DEFAULT: '#2b2b2b', // Charcoal
          muted: '#707070',
        },
        borderc: {
          DEFAULT: '#e4e1d9',
          focus: '#1f3b4d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
