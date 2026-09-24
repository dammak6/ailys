import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        ailys: {
          black: "#0B0B0B",
          dark: "#141414",
          "dark-surface": "#1A1A1A",
          "dark-border": "#262626",
          bone: "#F5F3EC",
          "bone-light": "#FAF9F5",
          "bone-dark": "#ECE8DF",
          "bone-border": "#E2DDD2",
          gold: "#B79A5B",
          "gold-light": "#CBB27A",
          "gold-dark": "#9F8347",
          "gold-muted": "rgba(183, 154, 91, 0.18)",
          muted: "#767471",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        editorial: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        subeditorial: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        normal: "0em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
        editorial: "0.25em",
        cinematic: "0.35em",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      boxShadow: {
        "subtle": "0 2px 10px rgba(0, 0, 0, 0.03)",
        "editorial": "0 10px 30px rgba(11, 11, 11, 0.05)",
        "gold-glow": "0 0 20px rgba(183, 154, 91, 0.15)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "marquee-scroll": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "marquee-infinite": "marquee-scroll 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
