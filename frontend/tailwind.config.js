/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // High Voltage Palette
        primary: {
          DEFAULT: '#CCFF00', // Volt
          400: '#bef264',
          500: '#CCFF00',
          600: '#a3cc00',
        },
        background: {
          light: '#f4f4f5', // Zinc 100
          dark: '#09090b',  // Zinc 950 (True Dark)
        },
        surface: {
          light: '#ffffff',
          dark: '#18181b',  // Zinc 900
          'dark-alt': '#27272a', // Zinc 800
        },
        accent: {
          DEFAULT: '#CCFF00',
          secondary: '#ffffff',
        },
        text: {
          primary: {
            light: '#09090b',
            dark: '#ffffff',
          },
          secondary: {
            light: '#71717a', // Zinc 500
            dark: '#a1a1aa',  // Zinc 400
          }
        },
        border: {
          light: '#e4e4e7', // Zinc 200
          dark: '#27272a',  // Zinc 800
        }
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        sans: ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px'
      },
      boxShadow: {
        'neon': '0 0 10px rgba(204, 255, 0, 0.5)',
        'neon-strong': '0 0 20px rgba(204, 255, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
