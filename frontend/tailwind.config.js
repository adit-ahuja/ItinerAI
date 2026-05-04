/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 25px 60px rgba(91, 101, 255, 0.3)",
        soft: "0 16px 50px rgba(15, 23, 42, 0.35)"
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 26%), radial-gradient(circle at 80% 0%, rgba(96,165,250,0.18), transparent 28%), radial-gradient(circle at 30% 80%, rgba(232,121,249,0.14), transparent 24%)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        pulseSlow: "pulseSlow 3.5s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.65", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" }
        }
      }
    }
  },
  plugins: []
};
