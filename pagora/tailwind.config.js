
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        pagora: {
          text: '#111111',
          muted: '#888888',
          accent: '#1E6FEA',
          border: '#EAEAEA',
          bg: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
}
