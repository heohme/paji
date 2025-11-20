/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'poker-green': '#0d7a4f',
        'poker-red': '#c62828',
        'poker-yellow': '#f9a825',
        'poker-blue': '#1565c0',
      }
    },
  },
  plugins: [],
}
