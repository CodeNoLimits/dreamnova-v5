import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sacred: {
          gold: "#D4AF37",
          "gold-light": "#E8C960",
          "gold-dark": "#B8941F",
          cyan: "#00D4FF",
          "cyan-light": "#33DDFF",
          "cyan-dark": "#00A8CC",
          black: "#050508",
          "black-light": "#0A0A10",
          "black-medium": "#111118",
          white: "#FFFFFF",
          "white-dim": "#E8E8F0",
          gray: "#8888AA",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        sacred: ["var(--font-cormorant)", "serif"],
      },
      backgroundImage: {
        "sacred-gradient":
          "linear-gradient(135deg, #D4AF37 0%, #00D4FF 50%, #D4AF37 100%)",
        "dark-gradient":
          "radial-gradient(ellipse at center, #0A0A10 0%, #050508 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)",
      },
      animation: {
        "sacred-pulse": "sacred-pulse 3s ease-in-out infinite",
        "gold-shimmer": "gold-shimmer 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "sacred-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
      },
      boxShadow: {
        sacred: "0 0 30px rgba(212, 175, 55, 0.15)",
        "sacred-lg": "0 0 60px rgba(212, 175, 55, 0.25)",
        cyan: "0 0 30px rgba(0, 212, 255, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
