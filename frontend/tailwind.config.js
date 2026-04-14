/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#11131c",
        surface: "#1d1f29",
        primary: "#bac3ff",
        secondary: "#44ddc1",
        tertiary: "#cdbdff",
      },
    },
  },
  plugins: [],
}
