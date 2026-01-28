/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D8CFF",
        primaryDark: "#1E6FDB",
        background: "#FFFFFF",
        surface: "#F9FAFB",
        border: "#E5E7EB",
        textPrimary: "#111827",
        textSecondary: "#33383DFF",
      },
    },
  },
  plugins: [],
};