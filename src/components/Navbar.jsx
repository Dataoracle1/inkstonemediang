import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useInkTheme, ThemeToggleButton } from '../context/ThemeContext';
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

// Categories shown in the desktop pill row (keep it short, like the mockup's "All Desks / World / Business…")
const DESKTOP_NAV_CATEGORIES = ['Breaking News', 'Sports', 'Entertainment', 'Technology', 'Politics'];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { isDark } = useInkTheme();
  const { isAuthenticated, admin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  }, []);

  return (
    <>
      <style>{`
        .ink-nav-pill {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
          padding: 7px 14px; border-radius: 999px; border: 1px solid var(--ink-rule);
          white-space: nowrap; color: var(--ink-ink-soft); background: transparent;
          text-decoration: none; transition: background .15s, color .15s, border-color .15s;
        }
        .ink-nav-pill:hover, .ink-nav-pill.active {
          background: var(--ink-ink); color: var(--ink-paper); border-color: var(--ink-ink);
        }
        .ink-nav-pill:focus-visible { outline: 2px solid var(--ink-stamp); outline-offset: 2px; }

        .ink-cats-row {
          display: flex; gap: 8px; overflow-x: auto; padding: 12px 18px;
          border-bottom: 1px solid var(--ink-rule); scrollbar-width: none;
        }
        .ink-cats-row::-webkit-scrollbar { display: none; }

        .ink-mobile-menu { animation: ink-slideDown .3s ease; }
        @media (min-width: 1024px) {
          .ink-mobile-menu, .ink-mobile-toggle { display: none !important; }
        }
        .ink-desktop-actions { display: none; }
        @media (min-width: 1024px) { .ink-desktop-actions { display: flex; } }

        .ink-mobile-cats { display: flex; flex-direction: column; gap: 2px; max-height: 240px; overflow-y: auto; }

        .ink-search-bar { animation: ink-slideDown .3s ease; }
        .ink-modal { animation: ink-scaleIn .22s ease; }
        .ink-backdrop { animation: ink-fadeIn .2s ease; }
      `}</style>

      <nav
        style={{
          zIndex: 50,
          background: 'var(--ink-paper)',
          borderBottom: '3px solid var(--ink-ink)',
          transition: 'background .35s ease, border-color .35s ease',
        }}
      >
        {/* ── Top strip: date + auth + theme toggle ── */}
        <div
          className="ink-mono"
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 18px',
            fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--ink-ink-soft)',
            borderBottom: '1px solid var(--ink-rule)',
            maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box',
          }}
        >
          <span className="hidden sm:inline">{currentDate.long}</span>
          <span className="sm:hidden">{currentDate.short}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-stamp)', textDecoration: 'none', fontWeight: 700 }}
              >
                <User size={13} />
                <span className="hidden sm:inline">{admin?.name}</span>
              </Link>
            )}
            <ThemeToggleButton />
          </div>
        </div>

        {/* ── Masthead ── */}
        <div style={{ padding: '26px 18px 16px', textAlign: 'center', maxWidth: 1280, margin: '0 auto' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <img
                src="/sydlines-icon.png"
                alt="Sydlines"
                style={{ width: 'clamp(34px, 6vw, 48px)', height: 'clamp(34px, 6vw, 48px)', objectFit: 'contain', flexShrink: 0 }}
              />
              <h1
                className="ink-serif"
                style={{ fontWeight: 600, fontSize: 'clamp(34px, 7vw, 50px)', lineHeight: .9, margin: 0, letterSpacing: '-.02em', color: 'var(--ink-ink)' }}
              >
                SYD<em style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--ink-stamp)' }}>LINES</em>
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
              <span style={{ width: 26, height: 1, background: 'var(--ink-rule)' }} />
              <span className="ink-mono" style={{ fontSize: 10, letterSpacing: '.3em', color: 'var(--ink-ink-soft)', fontWeight: 600 }}>MEDIA</span>
              <span style={{ width: 26, height: 1, background: 'var(--ink-rule)' }} />
            </div>
            <div className="ink-mono" style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-ink-soft)', letterSpacing: '.05em' }}>
              Breaking News &middot; Sports &middot; Entertainment
            </div>
          </Link>
        </div>

        {/* ── Nav pills + actions row ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 18px 14px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="ink-cats-row" style={{ padding: 0, border: 'none', flex: '1 1 auto', minWidth: 0 }}>
            <Link to="/" className="ink-nav-pill">Home</Link>
            {DESKTOP_NAV_CATEGORIES.map(cat => (
              <Link key={cat} to={categoryPath(cat)} className="ink-nav-pill">{cat}</Link>
            ))}
            <Link to="/contact" className="ink-nav-pill">Contact</Link>
          </div>

          <div className="ink-desktop-actions" style={{ alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => setShowSearch(s => !s)}
              className="ink-mono"
              style={{
                width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--ink-rule)',
                background: 'transparent', color: 'var(--ink-ink-soft)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '.15s',
              }}
            >
              <Search size={16} />
            </button>
            <button onClick={() => setShowSubscribeModal(true)} className="ink-btn ink-btn-stamp">
              <Mail size={13} />
              Subscribe
            </button>
          </div>

          <button
            className="ink-mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            style={{
              width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--ink-rule)',
              background: 'transparent', color: 'var(--ink-ink)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Desktop search bar ── */}
        {showSearch && (
          <div className="ink-search-bar" style={{ borderTop: '1px solid var(--ink-rule)', padding: '14px 18px', maxWidth: 1280, margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles..." autoFocus
                className="ink-mono"
                style={{
                  flex: 1, padding: '10px 16px', border: '1px solid var(--ink-rule)', borderRadius: 4,
                  fontSize: 13, outline: 'none', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)',
                }}
              />
              <button type="submit" className="ink-btn ink-btn-stamp">Search</button>
              <button type="button" onClick={() => setShowSearch(false)} className="ink-btn">Cancel</button>
            </form>
          </div>
        )}

        {/* ── Mobile menu ── */}
        {isMenuOpen && (
          <div className="ink-mobile-menu" style={{ borderTop: '1px solid var(--ink-rule)', padding: '16px 18px 18px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="ink-mono"
                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--ink-rule)', borderRadius: 4, fontSize: 13, outline: 'none', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)' }}
              />
              <button type="submit" className="ink-btn ink-btn-stamp" style={{ flexShrink: 0 }}>
                <Search size={16} />
              </button>
            </form>

            <div className="ink-mobile-cats">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="ink-nav-pill" style={{ textAlign: 'left' }}>Home</Link>
              {ALL_CATEGORIES.map(cat => (
                <Link key={cat} to={categoryPath(cat)} onClick={() => setIsMenuOpen(false)} className="ink-nav-pill" style={{ textAlign: 'left' }}>
                  {cat}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="ink-nav-pill" style={{ textAlign: 'left' }}>Contact</Link>
            </div>

            <button
              onClick={() => { setShowSubscribeModal(true); setIsMenuOpen(false); }}
              className="ink-btn ink-btn-stamp"
              style={{ marginTop: 12, width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              Subscribe to Newsletter
            </button>
          </div>
        )}
      </nav>

      {/* ── Subscribe Modal ── */}
      {showSubscribeModal && (
        <div
          className="ink-backdrop"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowSubscribeModal(false)}
        >
          <div
            className="ink-modal"
            style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, boxShadow: '0 24px 64px rgba(0,0,0,.25)', maxWidth: 460, width: '100%', padding: 32 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail color="var(--ink-stamp)" size={20} />
                </div>
                <h3 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Subscribe</h3>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 14, color: 'var(--ink-ink-soft)', marginBottom: 22, lineHeight: 1.6 }}>
              Get the wire delivered to your inbox. Stay informed with SYDLINES MEDIA.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-ink-soft)' }}>
                  Email Address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required disabled={isSubscribing}
                  style={{
                    width: '100%', padding: '11px 15px', border: '1px solid var(--ink-rule)', borderRadius: 4,
                    fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--ink-paper-dim)',
                    color: 'var(--ink-ink)', opacity: isSubscribing ? .6 : 1,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={isSubscribing} className="ink-btn ink-btn-stamp" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                </button>
                <button type="button" onClick={() => setShowSubscribeModal(false)} disabled={isSubscribing} className="ink-btn" style={{ justifyContent: 'center', padding: '12px 20px' }}>
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