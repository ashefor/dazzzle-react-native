/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A",
        secondary: "#FFFFFF",
        tertiary: "#DD3FE5",
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
      }, 
      fontFamily: {
        firathin: ["Onest_100Thin", "sans-serif"],
        firaextralight: ["Onest_200ExtraLight", "sans-serif"],
        firalight: ["Onest_300Light", "sans-serif"],
        firaregular: ["Onest_400Regular", "sans-serif"],
        firamedium: ["Onest_500Medium", "sans-serif"],
        firasemibold: ["Onest_600SemiBold", "sans-serif"],
        firabold: ["Onest_700Bold", "sans-serif"],
        firaextrabold: ["Onest_800ExtraBold", "sans-serif"],
        firablack: ["Onest_900Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}

