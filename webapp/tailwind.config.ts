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
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "grid-flow": "gridFlow 3s linear infinite",
        "aurora-1": "aurora1 15s ease-in-out infinite",
        "aurora-2": "aurora2 20s ease-in-out infinite",
        "aurora-3": "aurora3 25s ease-in-out infinite",
      },
      keyframes: {
        gridFlow: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "-40px 40px" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        aurora1: {
          "0%, 100%": { transform: "translateX(-5%) translateY(-5%) rotate(-5deg) scale(1)" },
          "50%": { transform: "translateX(5%) translateY(5%) rotate(5deg) scale(1.1)" }
        },
        aurora2: {
          "0%, 100%": { transform: "translateX(5%) translateY(5%) rotate(5deg) scale(1.1)" },
          "50%": { transform: "translateX(-5%) translateY(-5%) rotate(-5deg) scale(1)" }
        },
        aurora3: {
          "0%, 100%": { transform: "translateX(-5%) translateY(5%) rotate(0deg) scale(1)" },
          "50%": { transform: "translateX(5%) translateY(-5%) rotate(-5deg) scale(1.05)" }
        }
      }
    },
  },
  plugins: [],
};

export default config;
