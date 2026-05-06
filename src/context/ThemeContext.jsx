// src/context/ThemeContext.js
import React, { createContext, useEffect, useContext } from "react";

// Create Context
const ThemeContext = createContext();

// Provider Component — site is dark-only.
export const ThemeProvider = ({ children }) => {
  const isDarkMode = true;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }, []);

  // toggleTheme kept as a no-op for backward compatibility with any consumer.
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for easy access
export const useTheme = () => useContext(ThemeContext);
