import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const useInkTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useInkTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('ink-theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-ink-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('ink-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/* Small reusable toggle button matching the mockup exactly:
   ☾ Dark / ☀ Light pill, top-right of the masthead strip. */
export const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useInkTheme();
  return (
    <button
      className="ink-theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
    >
      <span>{isDark ? '☀' : '☾'}</span>
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};