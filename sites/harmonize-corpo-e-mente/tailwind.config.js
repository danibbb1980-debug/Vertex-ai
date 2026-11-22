/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        areia: "#EEE8DE",
        "areia-2": "#E4DCCD",
        tinta: "#1F2638",
        "tinta-2": "#2A3247",
        terracota: "#B5532F",
        "terracota-esc": "#8E3E21",
        apoio: "#5E574D",
        "apoio-claro": "#B9B3A8",
      },
      fontFamily: {
        serif: ['"Newsreader Variable"', "Georgia", "serif"],
        sans: ['"Hanken Grotesk Variable"', "system-ui", "sans-serif"],
      },
      maxWidth: { page: "84rem" },
    },
  },
  plugins: [],
};
