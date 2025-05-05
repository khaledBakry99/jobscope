/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#001F3F",
        secondary: "#FFA500",
        accent: "#FFD700",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-strong":
          "pulse-strong 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-subtle":
          "pulse-subtle 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
        bounce: "bounce 1s infinite",
        "bounce-slow": "bounce 2s infinite",
        typing: "typing 2s steps(20, end), blink-caret .5s step-end infinite",
        "sparkle-spin": "sparkle-spin 1.5s linear infinite",
        "thinking-dots": "thinking-dots 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "pulse-strong": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.7)",
          },
          "50%": {
            opacity: "0.9",
            transform: "scale(1.12)",
            boxShadow: "0 0 15px 8px rgba(99, 102, 241, 0.4)",
          },
        },
        "pulse-subtle": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.5)",
          },
          "50%": {
            opacity: "0.95",
            transform: "scale(1.08)",
            boxShadow: "0 0 10px 5px rgba(99, 102, 241, 0.3)",
          },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "blink-caret": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "currentColor" },
        },
        "sparkle-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "thinking-dots": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
