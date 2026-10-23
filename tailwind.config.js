/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vibe: {
          darkBg: '#050B1D',
          darkSidebar: '#08122B',
          darkCard: '#0B1733',
          darkCardSecondary: '#101F43',
          darkBorder: '#1A294C',
          darkBorderSubtle: '#14203D',
          darkHover: '#13234A',
          purple: '#7047FF',
          indigo: '#4038F5',
          textMain: '#F4F6FF',
          textSecondary: '#A8B5D5',
          success: '#38D9A9',
          warning: '#F5C451',
          error: '#FF6B81',
          // Light theme
          lightBg: '#F5F7FD',
          lightSidebar: '#FFFFFF',
          lightCard: '#FFFFFF',
          lightCardSecondary: '#F1F4FA',
          lightBorder: '#E2E8F0',
          lightBorderSubtle: '#EDF2F7',
          lightTextMain: '#0F172A',
          lightTextSecondary: '#64748B',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(112, 71, 255, 0.35)',
        'glow-indigo': '0 0 25px -5px rgba(64, 56, 245, 0.35)',
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'card-light': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        pulseSubtle: 'pulseSubtle 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
