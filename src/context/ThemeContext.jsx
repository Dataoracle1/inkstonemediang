import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('sydlines-theme');
    if (saved) return saved === 'dark';
    
    // Check system preference
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });

  useEffect(() => {
    // Update DOM
    const html = document.documentElement;
    if (isDark) {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
    
    // Persist to localStorage
    localStorage.setItem('sydlines-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme toggle button component
export const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '6px',
        border: '1px solid var(--theme-border)',
        background: 'var(--theme-bg-secondary)',
        color: 'var(--theme-text)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        transition: 'all 0.2s ease',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeContext;