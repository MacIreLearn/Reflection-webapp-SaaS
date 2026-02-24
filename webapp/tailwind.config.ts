import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        calm: {
          50: "#f0f9f4",
          100: "#d8f0e3",
          200: "#b3e1c9",
          300: "#82cba8",
          400: "#50b083",
          500: "#2f9568",
          600: "#207852",
          700: "#1a6044",
          800: "#174d38",
          900: "#14402f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
