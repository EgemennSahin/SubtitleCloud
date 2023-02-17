/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost", "sans-serif"],
      },

      boxShadow: {
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
        "inner-lg": "inset 0 4px 12px 0 rgba(0, 0, 0, 0.2)",
      },

      minHeight: {
        "1/2": "50vh",
        "9/10": "calc(100vh - 80px)",
      },
    },
  },
  plugins: [],
};
