/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette from your current design
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#06b6d4',
        },
        accent: {
          DEFAULT: '#f59e0b',
        },
        text: {
          DEFAULT: '#f8fafc',
          light: '#cbd5e1',
          muted: '#94a3b8',
        },
        bg: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          dark: '#0c0f1a',
        },
        surface: {
          DEFAULT: '#334155',
          light: '#475569',
        },
        glass: {
          bg: 'rgba(30, 41, 59, 0.7)',
          border: 'rgba(148, 163, 184, 0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'neon': '0 0 5px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3), 0 0 35px rgba(99, 102, 241, 0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shine': 'shine 2s infinite',
        'gradient-move': 'gradient-move 2s linear infinite',
        'pulse-text': 'pulse-text 2s infinite alternate',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        shine: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-move': {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
        'pulse-text': {
          '0%': { filter: 'brightness(1)' },
          '100%': { filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
