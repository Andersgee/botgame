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
    extend: {
      /*
        transitionTimingFunction: {
          'ease-in': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          'ease-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
        }
        */
    },
  },
  plugins: [],
});
