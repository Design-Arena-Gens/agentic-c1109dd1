import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        fjord: {
          50: "#f2fbff",
          100: "#dff1ff",
          200: "#bfe1ff",
          300: "#8ecaff",
          400: "#52a9ff",
          500: "#2387ff",
          600: "#0a67ff",
          700: "#054fec",
          800: "#0a3fc4",
          900: "#113b97",
          950: "#0b234b"
        }
      }
    }
  },
  plugins: []
};

export default config;
