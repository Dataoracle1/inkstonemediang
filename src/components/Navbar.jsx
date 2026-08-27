import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Breaking News', path: '/category/breaking-news' },
    { label: 'Sports', path: '/category/sports' },
    { label: 'Entertainment', path: '/category/entertainment' },
    { label: 'Technology', path: '/category/technology' },
    { label: 'Politics', path: '/category/politics' },
    { label: 'Business', path: '/category/business' },
    { label: 'World', path: '/category/world' },
    { label: 'Opinion', path: '/category/opinion' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      style={{
        backgroundColor: isDark ? '#0f1419' : '#ffffff',
        borderBottom: isDark ? '1px solid #333' : '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top Bar - Date, Trending, Follow, Theme Toggle */}
      <div
        style={{
          backgroundColor: isDark ? '#1a1f2e' : '#f5f5f5',
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          borderBottom: isDark ? '1px solid #333' : '1px solid #e0e0e0',
        }}
      >
        <span style={{ color: isDark ? '#999' : '#666' }}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '3px',
                fontWeight: 600,
                fontSize: '10px',
              }}
            >
              🔴 Trending:
            </span>
            <span style={{ color: isDark ? '#aaa' : '#666', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Nigerians will soon be able to buy shares in refinery – Dangote
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: isDark ? '#999' : '#666' }}>Follow us:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  style={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#999' : '#666',
                    textDecoration: 'none',
                  }}
                >
                  {social[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: isDark ? '#ffd700' : '#333',
              fontSize: '12px',
            }}
          >
            {isDark ? <Moon size={14} /> : <Sun size={14} />}
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isDark ? '#999' : '#666' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isDark ? '#444' : '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              YK
            </div>
            <span style={{ fontSize: '11px' }}>Yakubu Kamaldeen</span>
          </div>
        </div>
      </div>

      {/* Logo & Newsletter Section */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isDark ? '#0f1419' : '#ffffff',
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ fontSize: '36px', fontWeight: 700, color: isDark ? '#fff' : '#000' }}>
            <span style={{ color: isDark ? '#fff' : '#000' }}>SYDLINES</span>
            <span style={{ color: '#d32f2f', fontStyle: 'italic' }}>.</span>
          </div>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '3px',
              fontWeight: 600,
              color: isDark ? '#999' : '#666',
            }}
          >
            SMART NEWS. REAL IMPACT.
          </div>
        </Link>

        {/* Newsletter Signup */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
            padding: '16px 20px',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#fff' : '#000' }}>
            ✉️ Stay informed, daily.
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#999' : '#666' }}>
            Top stories, handpicked for you.
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '3px',
                fontSize: '12px',
                backgroundColor: isDark ? '#2a2f3e' : '#fff',
                color: isDark ? '#fff' : '#000',
              }}
            />
            <button
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        style={{
          backgroundColor: '#1a2a4a',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '30px',
          height: '56px',
        }}
      >
        {/* Home Icon */}
        <Link
          to="/"
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '20px',
          }}
        >
          🏠
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '30px', flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#d32f2f')}
              onMouseLeave={(e) => (e.target.style.color = 'white')}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            🔍
          </button>

          <button
            style={{
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ✉️ Subscribe
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'none',
              '@media (max-width: 768px)': { display: 'block' },
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#1a2a4a',
            padding: '12px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '8px 0',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;