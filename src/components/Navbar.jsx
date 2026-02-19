

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon, User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { newsletterAPI } from '../utils/api';
import { categoryPath } from '../utils/categoryUtils';

// ── Stem helper: "politics" → "politic", "sports" → "sport" ──
const stemSearchTerm = (term) => {
  term = term.toLowerCase().trim();
  const suffixes = ['ical', 'ically', 'ics', 'tion', 'tions', 'ing', 'ings', 'ed', 'ers', 'er', 'ly', 'ment', 'ments', 'ies', 's'];
  for (const suffix of suffixes) {
    if (term.endsWith(suffix) && term.length > suffix.length + 3) {
      return term.slice(0, -suffix.length);
    }
  }
  return term;
};

const ALL_CATEGORIES = [
  'Breaking News',
  'Finance',
  'Stock Markets',
  'Economy',
  'Sports',
  'Movies',
  'Entertainment',
  'Technology',
  'Politics',
  'Health',
  'World',
  'Business',
  'Science',
  'Other',
];

// Categories shown in the desktop nav bar (keep it short)
const DESKTOP_NAV_CATEGORIES = ['Breaking News', 'Sports', 'Entertainment', 'Technology', 'Politics'];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { isAuthenticated, admin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const stemmed = stemSearchTerm(searchQuery.trim());
      navigate(`/?search=${encodeURIComponent(stemmed)}`);
      setSearchQuery('');
      setShowSearch(false);
      setIsMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  const handleSubscribe = useCallback(async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribing(true);
    try {
      const response = await newsletterAPI.subscribe(email.trim());
      showToast(response.data.message || 'Please check your email to confirm subscription!', 'success');
      setEmail('');
      setShowSubscribeModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubscribing(false);
    }
  }, [email, showToast]);

  const currentDate = useMemo(() => {
    const date = new Date();
    return {
      long: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(.93);}to{opacity:1;transform:scale(1);} }
        @keyframes fadeIn    { from{opacity:0;}to{opacity:1;} }

        .ink-nav-link {
          font-size: 14px; font-weight: 800; font-family: 'DM Sans', sans-serif;
          padding: 9px 12px; border-radius: 10px; text-decoration: none;
          transition: color .2s, background .2s; display: block; letter-spacing: 0.1px;
          white-space: nowrap;
        }
        .ink-search-bar { animation: slideDown .3s ease; }
        .ink-modal      { animation: scaleIn .22s ease; }
        .ink-backdrop   { animation: fadeIn .2s ease; }

        /* Mobile menu — hidden on desktop (≥1024px) */
        .ink-mobile-menu {
          display: block;
          animation: slideDown .3s ease;
        }
        @media (min-width: 1024px) {
          .ink-mobile-menu { display: none !important; }
          .ink-mobile-toggle { display: none !important; }
        }

        /* Desktop nav — hidden on mobile (<1024px) */
        .ink-desktop-nav {
          display: none;
        }
        @media (min-width: 1024px) {
          .ink-desktop-nav { display: flex; }
        }

        /* Desktop actions — hidden on mobile */
        .ink-desktop-actions {
          display: none;
        }
        @media (min-width: 1024px) {
          .ink-desktop-actions { display: flex; }
        }

        /* Mobile category scroll */
        .ink-mobile-cats {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 240px;
          overflow-y: auto;
        }
      `}</style>

      <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50"
        style={{ fontFamily: "'DM Sans', sans-serif", boxShadow: '0 2px 16px rgba(0,0,0,.08)' }}>

        {/* ── Top Bar ── */}
        <div className="bg-gray-900 dark:bg-black text-white" style={{ padding: '10px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hidden sm:block" style={{ fontSize: 14, fontWeight: 700, letterSpacing: .3 }}>{currentDate.long}</span>
            <span className="sm:hidden" style={{ fontSize: 14, fontWeight: 700 }}>{currentDate.short}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              {isAuthenticated && (
                <Link to="/admin/dashboard" className="hover:text-green-400 transition-colors"
                  style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 800 }}>
                  <User size={17} />
                  <span className="hidden sm:inline">{admin?.name}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Nav Row ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', flexShrink: 0 }}>
              <img
                src="https://i.postimg.cc/Rh7CTkm7/inkstonelogo-green.png"
                alt="Inkstone Media"
                style={{ width: 42, height: 42, objectFit: 'contain' }}
                loading="lazy"
              />
              <div>
                <h1 className="text-gray-900 dark:text-white"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
                  INKSTONE <span style={{ color: '#16a34a' }}>MEDIA</span>
                </h1>
                <p className="hidden sm:block text-gray-500 dark:text-gray-400"
                  style={{ fontSize: 11, fontWeight: 700, letterSpacing: .8 }}>
                  Breaking News • Sports • Entertainment
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="ink-desktop-nav" style={{ alignItems: 'center', gap: 2, overflowX: 'auto' }}>
              <Link to="/" className="ink-nav-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                Home
              </Link>
              {DESKTOP_NAV_CATEGORIES.map(cat => (
                <Link key={cat} to={categoryPath(cat)}
                  className="ink-nav-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  {cat}
                </Link>
              ))}
              <Link to="/contact" className="ink-nav-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                Contact
              </Link>
            </div>

            {/* ── Desktop Actions ── */}
            <div className="ink-desktop-actions" style={{ alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <button
                onClick={() => setShowSearch(s => !s)}
                className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                style={{ width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Search size={19} />
              </button>
              <button
                onClick={() => setShowSubscribeModal(true)}
                style={{ padding: '11px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 11, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 4px 14px rgba(22,163,74,.35)', transition: 'transform .2s', letterSpacing: .3, whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Subscribe
              </button>
            </div>

            {/* ── Mobile Toggle (hidden on desktop via CSS) ── */}
            <button
              className="ink-mobile-toggle text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ width: 44, height: 44, borderRadius: 11, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* ── Desktop Search Bar ── */}
          {showSearch && (
            <div className="ink-search-bar border-t border-gray-100 dark:border-gray-800"
              style={{ paddingTop: 18, paddingBottom: 18, display: 'none' }}
              ref={el => { if (el) el.style.display = 'block'; }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles..." autoFocus
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 dark:focus:border-green-500"
                  style={{ flex: 1, padding: '11px 18px', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 11, fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                />
                <button type="submit"
                  style={{ padding: '11px 26px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 11, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Search
                </button>
                <button type="button" onClick={() => setShowSearch(false)}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  style={{ padding: '11px 22px', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 11, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* ── Mobile Menu (hidden on desktop via CSS) ── */}
          {isMenuOpen && (
            <div className="ink-mobile-menu border-t border-gray-100 dark:border-gray-800"
              style={{ paddingTop: 16, paddingBottom: 18 }}>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  type="text" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 placeholder-gray-400"
                  style={{ flex: 1, padding: '11px 15px', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 11, fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                />
                <button type="submit"
                  style={{ width: 44, height: 44, background: '#16a34a', color: 'white', border: 'none', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <Search size={19} />
                </button>
              </form>

              {/* Home + All Categories */}
              <div className="ink-mobile-cats">
                <Link to="/" onClick={() => setIsMenuOpen(false)}
                  className="ink-nav-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  🏠 Home
                </Link>
                {ALL_CATEGORIES.map(cat => (
                  <Link key={cat} to={categoryPath(cat)} onClick={() => setIsMenuOpen(false)}
                    className="ink-nav-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                    {cat}
                  </Link>
                ))}
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}
                  className="ink-nav-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Contact
                </Link>
              </div>

              {/* Subscribe Button */}
              <button
                onClick={() => { setShowSubscribeModal(true); setIsMenuOpen(false); }}
                style={{ marginTop: 12, padding: '13px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 11, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', width: '100%', letterSpacing: .3 }}>
                Subscribe to Newsletter
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Subscribe Modal ── */}
      {showSubscribeModal && (
        <div className="ink-backdrop"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowSubscribeModal(false)}>
          <div className="ink-modal bg-white dark:bg-gray-900"
            style={{ borderRadius: 24, boxShadow: '0 24px 64px rgba(0,0,0,.25)', maxWidth: 480, width: '100%', padding: 36 }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail color="#16a34a" size={24} />
                </div>
                <h3 className="text-gray-900 dark:text-white"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, margin: 0 }}>
                  Subscribe
                </h3>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                style={{ width: 38, height: 38, borderRadius: 10, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-500 dark:text-gray-400"
              style={{ fontSize: 15, fontWeight: 600, marginBottom: 24, lineHeight: 1.7 }}>
              Get the latest news and updates delivered to your inbox. Stay informed with INKSTONE MEDIA.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="text-gray-700 dark:text-gray-300"
                  style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>
                  Email Address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required disabled={isSubscribing}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 placeholder-gray-400 focus:border-green-500"
                  style={{ width: '100%', padding: '13px 17px', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 12, fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', opacity: isSubscribing ? .6 : 1, transition: 'border-color .2s' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={isSubscribing}
                  style={{ flex: 1, padding: '14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 4px 16px rgba(22,163,74,.35)', opacity: isSubscribing ? .7 : 1, transition: 'transform .2s', letterSpacing: .3 }}
                  onMouseEnter={e => !isSubscribing && (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                </button>
                <button type="button" onClick={() => setShowSubscribeModal(false)} disabled={isSubscribing}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{ padding: '14px 26px', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Navbar);