/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
    extend: {
      colors: {
        pedra: { DEFAULT: "#ECE6DC", funda: "#E1D9CC", clara: "#F4F0E9" },
        tinta: { DEFAULT: "#17130F", 2: "#221C17", 3: "#2E2620" },
        grafite: { DEFAULT: "#2A241F", suave: "#5A5147" },
        ouro: { DEFAULT: "#B19C71", texto: "#6E5A33", claro: "#CDBB95" },
        cinza: { tinta: "#A89E91" },
      },
      fontFamily: {
        serif: ['"Newsreader"', "Georgia", "serif"],
        sans: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
