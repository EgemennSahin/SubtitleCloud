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
        "3/4": "75vh",
        "9/10": "calc(100vh - 80px)",
        "19/20": "95vh",
      },

      maxHeight: {
        "3/4": "75vh",
      },

      width: {
        full2: "102%",
      },

      height: {
        "9/10": "calc(100vh - 60px)",
      },
    },
  },
  plugins: [],
};
