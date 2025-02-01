/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors:{
        blue: {
          DEFAULT: '#002A50'
        },
        red: {
          DEFAULT: '#e31e24'
        }
      },
      fontFamily: {
        hyundai: ['HyundaiSans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

