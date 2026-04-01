/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Editorial Theme (Primary Layout mapped to base variables)
        'pagora-base': '#FFFFFF',
        'pagora-elevated': '#FAFAFA',
        'pagora-border': '#EAEAEA',
        'pagora-text': '#111111',
        'pagora-muted': '#888888',
        
        // Exact Brand Colors & Dark Elements Preserved
        'pagora-primary': '#1E6FEA',
        'pagora-hover': '#4290F3',
        'pagora-blue-deep': '#1B3A67',
        'pagora-dark-card': '#212830',
        'pagora-dark-base': '#0C1016',
        'pagora-dark-elevated': '#0D1116',
        'pagora-dark-accent': '#202930',
        'pagora-light-text': '#EFF0E6',
        'pagora-light-muted': '#D5D6D0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      boxShadow: {
        'book': '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 10px 20px -5px rgba(0, 0, 0, 0.08)',
        'pill': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}