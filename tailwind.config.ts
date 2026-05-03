import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "3rem"
      },
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "PingFang SC",
          "Helvetica Neue",
          "Inter",
          "Segoe UI",
          "Roboto",
          "system-ui",
          "sans-serif"
        ],
        mono: ["SF Mono", "Menlo", "Consolas", "monospace"],
        display: ["SF Pro Display", "PingFang SC", "Inter", "sans-serif"]
      },
      colors: {
        ink: {
          50: "#F5F5F7",
          100: "#E8E8ED",
          200: "#D2D2D7",
          300: "#A1A1A6",
          400: "#86868B",
          500: "#6E6E73",
          600: "#424245",
          700: "#1D1D1F",
          800: "#161617",
          900: "#0B0B0E",
          950: "#050507"
        },
        accent: {
          gold: "#C8A85A",
          deep: "#0066CC",
          azure: "#0A84FF",
          emerald: "#16A34A",
          violet: "#5E5CE6",
          coral: "#FF453A"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F5F5F7",
          muted: "#FAFAFC"
        }
      },
      letterSpacing: {
        tightest: "-0.04em",
        snug: "-0.02em"
      },
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "700" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "600" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }]
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at center, rgba(0,0,0,0.04) 1px, transparent 1px)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")"
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.6s ease-out both",
        "marquee": "marquee 40s linear infinite",
        "shine": "shine 3s linear infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        shine: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" }
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(80px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(80px) rotate(-360deg)" }
        }
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        elevated: "0 20px 60px -10px rgba(0,0,0,0.18)",
        premium: "0 30px 90px -20px rgba(0,0,0,0.35), 0 12px 30px -10px rgba(0,0,0,0.2)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};

export default config;
