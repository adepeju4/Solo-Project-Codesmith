/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        medium: "1.5rem",
        default: "1.2rem",
        small: "1rem",
        large: "4rem",
        XLarge: "7rem",
      },
      clipPath: {
        ellipse: "ellipse(50% 50% at 85% 30%)",
      },

      fontWeight: {
        hairline: 100, // Thin
        thin: 100,
        light: 200,
        normal: 300, // Normal
        medium: 400, // Regular
        semibold: 500,
        bold: 600,
        extrabold: 700, // Bold
        black: 800, // Extra Bold
        extrablack: 900, // Black
      },
    },
  },
  plugins: [],
};

export default config;
