/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'waymark-black': '#0F0F0F',
        'waymark-amber': '#F59E0B',
        'waymark-gray': '#1F2937',
      },
      backgroundImage: {
        'hero-gradient': "linear-gradient(to bottom, rgba(15,15,15,0.7), #0F0F0F)",
      }
    },
  },
  plugins: [],
}