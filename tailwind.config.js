/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Press Start 2P', 'cursive', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#FFCC00',
          dark: '#E6B800',
        },
        secondary: {
          DEFAULT: '#FF5555',
          dark: '#E63939',
        },
        surface: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#111315',
        },
        game: {
          wall: '#1F3E82',
          dot: '#FFB8AE',
          powerPellet: '#FFCC00',
          'ghost-red': '#FF0000',
          'ghost-pink': '#FFB8FF',
          'ghost-cyan': '#00FFFF',
          'ghost-orange': '#FFB852',
          'ghost-frightened': '#2121FF'
        }
      },
      animation: {
        'chomp': 'chomp 0.3s linear infinite alternate',
      },
      keyframes: {
        chomp: {
          '0%': { clipPath: 'circle(50% at center)' },
          '100%': { clipPath: 'polygon(100% 0%, 100% 0%, 100% 50%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)' },
        },
      },
      gridTemplateColumns: {
        '19': 'repeat(19, minmax(0, 1fr))'
      }
    },
  },
  plugins: [],
};