/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1982C4", ink: "#0F5F93", soft: "#E3F0F9" },
        night: { DEFAULT: "#0B1E33", 2: "#12304F" },
        ice: "#F6F9FC",
        mist: "#E7EEF5",
        sand: { DEFAULT: "#F3E7D7", ink: "#7A4E22" },
        graphite: { DEFAULT: "#1B2A3A", soft: "#475A6E" },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
        sans: ['"DM Sans Variable"', "system-ui", "sans-serif"],
      },
      borderRadius: { mod: "1.25rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(11,30,51,.04), 0 8px 24px -12px rgba(11,30,51,.14)",
        lift: "0 2px 4px rgba(11,30,51,.05), 0 18px 40px -18px rgba(15,95,147,.35)",
      },
    },
  },
  plugins: [],
};
