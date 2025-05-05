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
          DEFAULT: '#FFCC00',
          light: '#FFEB80',
          dark: '#CC9900'
        },
        secondary: {
          DEFAULT: '#FF5555',
          light: '#FF8080',
          dark: '#CC2929'
        },
        accent: '#4D4DFF',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        game: {
          wall: '#2563eb',
          path: '#18181b',
          dot: '#f8fafc',
          powerPellet: '#FFCC00',
          ghost: {
            red: '#ff0000',
            pink: '#ffb8de',
            cyan: '#00ffff',
            orange: '#ffb852',
            frightened: '#2463ff'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Press Start 2P', 'ui-sans-serif', 'system-ui'],
        game: ['Press Start 2P', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'neon': '0 0 5px #FFCC00, 0 0 10px #FFCC00, 0 0 15px #FFCC00'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'chomp': 'chomp 0.3s ease-in-out infinite alternate',
        'blink': 'blink 1s infinite'
      },
      keyframes: {
        chomp: {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0.85)' }
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}