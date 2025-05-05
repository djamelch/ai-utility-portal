
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        brand: {
          50: "#f0f7ff",
          100: "#e0eefe",
          200: "#c0ddfd",
          300: "#90c2fb",
          400: "#5c9ff7",
          500: "#3b82f6",
          600: "#2570ea",
          700: "#1d58d8",
          800: "#1e48af",
          900: "#1e3e8a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        card: "0 2px 10px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 10px 30px rgba(0, 0, 0, 0.1)",
        glow: "0 0 20px rgba(var(--primary), 0.4)",
        "inner-glow": "inset 0 0 20px rgba(var(--primary), 0.2)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        // New animations
        height: {
          "0%, 100%": { height: "40%" },
          "50%": { height: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "text-slide": {
          "0%, 16%": { transform: "translateY(0%)" },
          "20%, 36%": { transform: "translateY(-16.66%)" },
          "40%, 56%": { transform: "translateY(-33.33%)" },
          "60%, 76%": { transform: "translateY(-50%)" },
          "80%, 96%": { transform: "translateY(-66.66%)" },
          "100%": { transform: "translateY(-83.33%)" },
        },
        "bg-pulse": {
          "0%, 100%": { backgroundColor: "rgba(var(--primary), 0.1)" },
          "50%": { backgroundColor: "rgba(var(--accent), 0.1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        fadeOut: "fadeOut 0.5s ease-out forwards",
        scaleIn: "scaleIn 0.3s ease-out forwards",
        slideUp: "slideUp 0.4s ease-out forwards",
        slideDown: "slideDown 0.4s ease-out forwards",
        slideInRight: "slideInRight 0.4s ease-out forwards",
        pulse: "pulse 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        // New animations
        blink: "blink 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        ripple: "ripple 1s cubic-bezier(0.65, 0, 0.35, 1) forwards",
        "spin-slow": "spin-slow 3s linear infinite",
        "text-slide": "text-slide 12s cubic-bezier(0.83, 0, 0.17, 1) infinite",
        "bg-pulse": "bg-pulse 3s ease-in-out infinite",
      },
      backdropFilter: {
        glass: "blur(16px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
