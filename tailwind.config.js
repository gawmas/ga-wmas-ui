/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{html,ts,scss,css}",
  ],
  theme: {
    extend: {
      colors: {
        'gawmas-green': '#0C343D',
        'gawmas-yeller': '#F9BF4B',
      },
      // animation: {
      //   fade: 'fadeOut 5s ease-in-out',
      // },
    },
    container: {
      // you can configure the container to be centered
      center: true,
      // or have default horizontal padding
      // padding: '1rem',
      // default breakpoints but with 40px removed
      //
      // notice how the color changes at 768px but
      // the container size changes at 728px
      screens: {
        sm: '600px',
        md: '870px',
        lg: '1024px',
        xl: '1240px',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
    require('tailwindcss-animated')
  ],
}

