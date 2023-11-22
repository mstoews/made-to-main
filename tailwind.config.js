/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    screens: {
      sm: '550px',
      md: '800px',
      lg: '1200px',
      xl: '1440px',
    },
    fontFamily: {
      serif: ['Merriweather', 'serif'],
      garamond: ['Garamond', 'sans-serif'],
      primary:['Garamond', 'sans-serif'],
      sans: ['Garamond', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#FF5733',
        secondary: '#FFFC33',
      },
      spacing: {
        5: '3.5rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite 3s',
        'bounce-slow': 'bounce 3s infinite 3s',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },

  darkMode: "class",
  plugins: [require('./node_modules/tw-elements/dist/plugin.cjs')]
}

