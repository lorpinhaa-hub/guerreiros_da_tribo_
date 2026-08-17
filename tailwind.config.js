/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        guarani: {
          dark: "#004A1A",
          base: "#005A20",
          medium: "#2E8B57",
          light: "#9CE5B5",
        },
      },
    },
  },
  plugins: [],
};
