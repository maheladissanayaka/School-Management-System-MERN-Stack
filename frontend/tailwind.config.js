/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        schoolBlue: "#1e40af",
        schoolBg: "#f8fafc",
      },
    },
  },
  plugins: [],
}