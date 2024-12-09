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
        firathin: ["FiraSans_100Thin", "sans-serif"],
        firaextralight: ["FiraSans_200ExtraLight", "sans-serif"],
        firalight: ["FiraSans_300Light", "sans-serif"],
        firaregular: ["FiraSans_400Regular", "sans-serif"],
        firamedium: ["FiraSans_500Medium", "sans-serif"],
        firasemibold: ["FiraSans_600SemiBold", "sans-serif"],
        firabold: ["FiraSans_700Bold", "sans-serif"],
        firaextrabold: ["FiraSans_800ExtraBold", "sans-serif"],
        firablack: ["FiraSans_900Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}

