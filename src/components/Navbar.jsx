import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';
import { useTheme, ThemeToggleButton } from '../context/ThemeContext';
import { postsAPI } from '../utils/api';

const Navbar = () => {
  const { isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trending, setTrending] = useState([]);
  const [currentTrendIndex, setCurrentTrendIndex] = useState(0);

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTrendIndex((prev) => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trending]);

  const fetchTrending = async () => {
    try {
      const response = await postsAPI.getAll?.({ category: 'Breaking News', limit: 5 });
      const posts = response?.data?.data?.posts || response?.data?.posts || [];
      setTrending(posts);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    }
  };

  const trendingPost = trending[currentTrendIndex];

  return (
    <nav style={{
      background: isDark ? '#0D1117' : '#071A33',
      color: isDark ? '#E8E4DD' : '#FFFFFF',
      transition: 'all 0.3s ease',
    }}>
      <style>{`
        .navbar-utility-bar {
          background: ${isDark ? '#0F1117' : '#071A33'};
          border-bottom: 1px solid ${isDark ? '#30363D' : '#C4422F'};
          padding: 12px 40px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .utility-left {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .utility-date {
          color: ${isDark ? '#8B949E' : 'rgba(255,255,255,0.7)'};
          font-family: "IBM Plex Mono", monospace;
        }

        .trending-headline {
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${isDark ? '#C9D1D9' : '#FFFFFF'};
          font-weight: 600;
          max-width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trending-badge {
          background: #C4422F;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .utility-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .social-links {
          display: flex;
          gap: 8px;
        }

        .social-link {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 1px solid ${isDark ? '#30363D' : 'rgba(255,255,255,0.2)'};
          color: ${isDark ? '#C9D1D9' : '#FFFFFF'};
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: rgba(196, 66, 47, 0.2);
          border-color: #C4422F;
          color: #C4422F;
        }

        .navbar-branding {
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: ${isDark ? '#0D1117' : '#071A33'};
        }

        .navbar-logo {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-syd {
          color: ${isDark ? '#E8E4DD' : '#FAF9F6'};
        }

        .logo-lines {
          color: #C4422F;
          font-style: italic;
        }

        .navbar-tagline {
          font-size: 11px;
          color: ${isDark ? '#8B949E' : 'rgba(255,255,255,0.6)'};
          font-family: "IBM Plex Mono", monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-left: 8px;
        }

        .navbar-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .navbar-main {
          background: ${isDark ? '#0D1117' : '#071A33'};
          border-top: 1px solid ${isDark ? '#30363D' : '#C4422F'};
          border-bottom: 1px solid ${isDark ? '#30363D' : '#C4422F'};
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
        }

        .navbar-links {
          display: flex;
          gap: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navbar-link {
          padding: 0 18px;
          height: 50px;
          display: flex;
          align-items: center;
          color: ${isDark ? '#C9D1D9' : '#FFFFFF'};
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          border-right: 1px solid ${isDark ? '#30363D' : 'rgba(255,255,255,0.1)'};
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .navbar-link:hover {
          background: rgba(196, 66, 47, 0.1);
          color: #C4422F;
        }

        .navbar-link.active {
          background: rgba(196, 66, 47, 0.15);
          color: #C4422F;
          border-bottom: 2px solid #C4422F;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: ${isDark ? '#C9D1D9' : '#FFFFFF'};
          cursor: pointer;
          padding: 8px;
        }

        @media (max-width: 768px) {
          .navbar-utility-bar {
            padding: 12px 20px;
          }

          .navbar-branding {
            padding: 12px 20px;
          }

          .navbar-main {
            padding: 0 20px;
          }

          .navbar-links {
            display: none;
          }

          .navbar-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: ${isDark ? '#161B22' : '#071A33'};
            border-bottom: 1px solid ${isDark ? '#30363D' : '#C4422F'};
            z-index: 999;
          }

          .navbar-link {
            border: none;
            border-bottom: 1px solid ${isDark ? '#30363D' : 'rgba(255,255,255,0.1)'};
            width: 100%;
            padding: 0 20px;
          }

          .menu-toggle {
            display: block;
          }

          .trending-headline {
            display: none;
          }
        }
      `}</style>

      {/* Utility Bar */}
      <div className="navbar-utility-bar">
        <div className="utility-left">
          <span className="utility-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          {trendingPost && (
            <div className="trending-headline">
              <span className="trending-badge">🔥 TRENDING</span>
              <span>{trendingPost.title}</span>
            </div>
          )}
        </div>
        <div className="utility-right">
          <div className="social-links">
            <a href="https://facebook.com" className="social-link" title="Facebook">f</a>
            <a href="https://twitter.com" className="social-link" title="Twitter">𝕏</a>
            <a href="https://instagram.com" className="social-link" title="Instagram">📷</a>
          </div>
          <ThemeToggleButton />
          <a href="/admin/login" className="social-link" title="Admin">⚙️</a>
        </div>
      </div>

      {/* Branding */}
      <div className="navbar-branding">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="navbar-logo">
            <span className="logo-syd">SYD</span>
            <span className="logo-lines">LINES.</span>
          </div>
          <div className="navbar-tagline">Smart News. Real Impact.</div>
        </div>
        <div className="navbar-controls">
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 20 }}>🔔</button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="navbar-main">
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" className="navbar-link active">Home</a>
          <a href="/?category=Breaking%20News" className="navbar-link">Breaking News</a>
          <a href="/?category=Business" className="navbar-link">Business</a>
          <a href="/?category=Technology" className="navbar-link">Technology</a>
          <a href="/?category=Sports" className="navbar-link">Sports</a>
          <a href="/?category=Entertainment" className="navbar-link">Entertainment</a>
        </ul>
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;