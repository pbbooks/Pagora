/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pagora-base': '#0C1016',
        'pagora-elevated': '#0D1116',
        'pagora-card': '#212830',
        'pagora-accent': '#202930',
        'pagora-blue-deep': '#1B3A67',
        'pagora-primary': '#1E6FEA',
        'pagora-hover': '#4290F3',
        'pagora-text': '#EFF0E6',
        'pagora-muted': '#D5D6D0',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
