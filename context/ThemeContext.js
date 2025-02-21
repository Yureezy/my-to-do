import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      primary: '#3498db',
      secondary: '#ddeff0',
      accent: '#e74c3c',
      border: '#404040'
    } : {
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#2c3e50',
      primary: '#3498db',
      secondary: '#95a5a6',
      accent: '#e74c3c',
      border: '#ecf0f1'
    }
  };

  const value = {
    theme,
    toggleTheme: () => setIsDarkMode(!isDarkMode)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme avec ThemeProvider');
  }
  return context;
};
