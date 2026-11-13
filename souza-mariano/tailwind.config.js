/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vinho: { DEFAULT: "#5B1E34", escuro: "#3E1423", claro: "#7A2E48" },
        osso: { DEFAULT: "#F5F0E7", 2: "#ECE4D6", 3: "#E2D7C4" },
        grafite: { DEFAULT: "#24201E", suave: "#57504A" },
        bronze: { DEFAULT: "#A9855A", texto: "#7A5A30", claro: "#D2B48A" },
      },
      fontFamily: {
        serif: ['"Newsreader Variable"', "Georgia", "serif"],
        sans: ['"Familjen Grotesk"', "system-ui", "sans-serif"],
      },
      maxWidth: { site: "76rem" },
    },
  },
  plugins: [],
};
