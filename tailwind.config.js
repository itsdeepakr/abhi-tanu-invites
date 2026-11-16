/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        armelie: ['"Armelie"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
        bodoni: ['"Bodoni Moda"', 'serif'],
        allura: ['"Allura"', 'cursive'],
      },
    },
  },
  plugins: [],
}

