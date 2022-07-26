const { withPlausibleProxy } = require("next-plausible");

/** @type {import('tailwindcss').Config} */
module.exports = withPlausibleProxy()({
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["Montserrat", "serif"],
      mono: ["Roboto Mono", "monospace"],
    },
    extend: {},
  },
  plugins: [],
});
