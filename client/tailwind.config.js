/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316', // Orange-500
          light: '#FB923C',  // Orange-400
          dark: '#EA580C',   // Orange-600
        },
      },
    },
  },
  plugins: [],
}