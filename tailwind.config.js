// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust if your project uses different paths
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C49E5B",   // gold-like
        secondary: "#1e293b", // slate-800
        accent: "#38bdf8",    // sky-400
      },
    },
  },
  plugins: [],
};
