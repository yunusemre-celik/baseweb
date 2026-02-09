/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Renkleri CSS değişkenlerine bağlıyoruz.
        // Bu sayede müşteriye özel renk temasını saniyeler içinde değiştirebilirsin.
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: {
          main: "var(--color-text-main)",
          muted: "var(--color-text-muted)",
        }
      },
      fontFamily: {
        // Fontları da değişken yapıyoruz
        sans: ["var(--font-primary)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
      animation: {
        // Özel animasyonlar
        'fade-in': 'fadeIn var(--transition-slow) ease-out forwards',
        'slide-up': 'slideUp var(--transition-normal) ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}