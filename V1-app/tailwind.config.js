/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        secondary: "#FF8A50",
        accent: "#FFB800",
        success: "#4CAF50",
        error: "#E53E3E",
        warning: "#FFB800",
        info: "#2196F3",
      },
    },
  },
  plugins: [],
};
