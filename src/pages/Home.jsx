import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import TrendingPost from '../components/TrendingPost';
import { TrendingUp, Clock, Flame } from 'lucide-react';
import { CATEGORIES, categoryPath, slugToCategory } from '../utils/categoryUtils';

/* ── Wire ticker across the top of the feed ── */
const WireTicker = ({ headlines, posts }) => {
  if (!headlines.length || !posts.length) return null;
  const doubled = [...posts, ...posts].slice(0, headlines.length * 2);
  return (
    <div style={{ background: 'var(--ink-wire)', overflow: 'hidden', position: 'relative', borderBottom: '1px solid var(--ink-rule)' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, background: 'var(--ink-stamp)', color: '#fff',
        display: 'flex', alignItems: 'center', padding: '0 10px', zIndex: 2,
      }} className="ink-mono">
        <span style={{ fontSize: 10, letterSpacing: '.15em', fontWeight: 600 }}>WIRE</span>
      </div>
      <div style={{
        display: 'flex', whiteSpace: 'nowrap', paddingLeft: 64,
        animation: `ink-scroll ${Math.max(18, headlines.length * 4)}s linear infinite`,
      }} className="ink-ticker-track">
        {doubled.map((post, i) => (
          <Link
            key={i}
            to={`/news/${post.slug}`}
            className="ink-mono"
            style={{
              fontSize: 12,
              color: 'var(--ink-wire-bright)',
              padding: '9px 28px 9px 0',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--ink-stamp)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--ink-wire-bright)'}
            title={`Read: ${post.title}`}
          >
            {post.title}
            <span style={{ marginLeft: 28, opacity: 0.5 }}>//</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ── Animated count-up (real numbers, no more hardcoded stats) ── */
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(target) || 0;
    if (from === to) return;
    let frame;
    let start = null;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};

const formatCompact = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
};

/* ── Ledger stat strip — real numbers, animated ── */
const Ledger = ({ storiesToday, deskCount, totalViews }) => {
  const animatedStories = useCountUp(storiesToday);
  const animatedDesks = useCountUp(deskCount);
  const animatedViews = useCountUp(totalViews);

  return (
    <div className="ink-ledger" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: 16,
      padding: '16px 18px',
      borderBottom: '1px solid var(--ink-rule)',
      background: 'var(--ink-paper)',
    }}>
      <style>{`
        @media (max-width: 640px) {
          .ink-ledger {
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 12px !important;
            padding: 12px !important;
          }
        }
      `}</style>

      <div className="ink-cell" style={{
        padding: '12px 0',
        borderRight: '1px solid var(--ink-rule)',
        textAlign: 'center',
      }}>
        <span className="ink-num" style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 700,
          color: 'var(--ink-stamp)',
          display: 'block',
        }}>
          {animatedStories}
        </span>
        <span className="ink-label ink-mono" style={{
          fontSize: 10,
          color: 'var(--ink-ink-soft)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginTop: 4,
        }}>
          Stories Today
        </span>
      </div>

      <div className="ink-cell" style={{
        padding: '12px 0',
        borderRight: '1px solid var(--ink-rule)',
        textAlign: 'center',
      }}>
        <span className="ink-num" style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 700,
          color: 'var(--ink-stamp)',
          display: 'block',
        }}>
          {animatedDesks}
        </span>
        <span className="ink-label ink-mono" style={{
          fontSize: 10,
          color: 'var(--ink-ink-soft)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginTop: 4,
        }}>
          Desks
        </span>
      </div>

      <div className="ink-cell" style={{
        padding: '12px 0',
        textAlign: 'center',
      }}>
        <span className="ink-num" style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 700,
          color: 'var(--ink-stamp)',
          display: 'block',
        }}>
          {formatCompact(animatedViews)}
        </span>
        <span className="ink-label ink-mono" style={{
          fontSize: 10,
          color: 'var(--ink-ink-soft)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginTop: 4,
        }}>
          Total Views
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams();

  const category = useMemo(() => {
    if (categorySlug) return slugToCategory(categorySlug);
    return searchParams.get('category');
  }, [categorySlug, searchParams]);

  const searchQuery = searchParams.get('search');

  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [breakingPosts, setBreakingPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest');
  const [ledgerStats, setLedgerStats] = useState({ storiesToday: 0, totalViews: 0 });

  useEffect(() => { fetchTrendingPosts(); fetchBreakingNews(); fetchLedgerStats(); }, []);
  useEffect(() => { fetchPosts(); }, [filter, category, searchQuery]);

  const fetchBreakingNews = useCallback(async () => {
    try {
      const response = await postsAPI.getAll({ category: 'Breaking News', limit: 10 });
      const data = response.data.data?.posts || response.data.posts || response.data || [];
      setBreakingPosts(data);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
    }
  }, []);

  const fetchLedgerStats = useCallback(async () => {
    try {
      const response = await postsAPI.getAll({ limit: 100 });
      const allPosts = response.data.data?.posts || response.data.posts || response.data || [];
      const todayStr = new Date().toDateString();
      const storiesToday = allPosts.filter(p => new Date(p.createdAt).toDateString() === todayStr).length;
      const totalViews = allPosts.reduce((sum, p) => sum + (p.views || 0), 0);
      setLedgerStats({ storiesToday, totalViews });
    } catch (error) {
      console.error('Error fetching ledger stats:', error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: 20 };
      if (filter === 'trending') params.trending = true;
      else if (filter === 'popular') params.featured = true;
      if (category) params.category = category;
      if (searchQuery) params.search = searchQuery;

      const response = await postsAPI.getAll(params);
      const postsData = response.data.data?.posts || response.data.posts || response.data || [];
      setPosts(postsData);
      if (postsData.length > 0 && !searchQuery) setFeaturedPost(postsData[0]);
      else setFeaturedPost(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filter, category, searchQuery]);

  const fetchTrendingPosts = async () => {
    try {
      const response = await postsAPI.getTrending(5);
      const trendingData = response.data.data?.posts || response.data.posts || response.data || [];
      setTrendingPosts(trendingData);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      setTrendingPosts([]);
    }
  };

  const displayPosts = useMemo(() => searchQuery ? posts : posts.slice(1), [posts, searchQuery]);
  const sidebarCategories = ['Breaking News', 'Finance', 'Sports', 'Entertainment', 'Technology', 'World'];
  const headlines = useMemo(() => breakingPosts.map(p => p.title).filter(Boolean), [breakingPosts]);

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        .ink-filter-btn {
          display:flex; align-items:center; gap:8px; padding:10px 16px; border:none;
          background:transparent; cursor:pointer; font-weight:600; font-size:11px;
          text-transform:uppercase; letter-spacing:.08em;
          border-bottom:2px solid transparent; transition:.2s;
          font-family:'IBM Plex Mono',monospace; white-space:nowrap;
        }
        
        .ink-posts-grid { display:flex; flex-direction:column; }
        
        .ink-skeleton {
          background: linear-gradient(90deg, var(--ink-paper-dim) 25%, var(--ink-rule) 50%, var(--ink-paper-dim) 75%);
          background-size: 400px 100%;
          animation: ink-shimmer 1.5s infinite;
        }
        
        @keyframes ink-shimmer { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }

        /* MOBILE FIRST APPROACH */
        @media (max-width: 640px) {
          .ink-two-col {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .ink-sidebar {
            display: none !important;
          }
          
          .ink-filter-btn {
            padding: 8px 12px !important;
            font-size: 10px !important;
          }
          
          .ink-cats-row {
            padding: 10px 12px !important;
            gap: 6px !important;
          }
          
          .ink-pill {
            padding: 6px 12px !important;
            font-size: 11px !important;
          }
          
          .ink-featured-card {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .ink-article-title {
            font-size: 20px !important;
          }
          
          .ink-posts-grid {
            gap: 12px !important;
          }
          
          .ink-detail-wrapper {
            padding: 12px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .ink-two-col {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .ink-sidebar {
            display: block !important;
          }
        }

        @media (min-width: 1025px) {
          .ink-two-col {
            grid-template-columns: 2fr 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>

      <WireTicker headlines={headlines} posts={breakingPosts} />
      <Ledger storiesToday={ledgerStats.storiesToday} deskCount={CATEGORIES.length} totalViews={ledgerStats.totalViews} />

      {/* ── Category pills ── */}
      <div className="ink-cats-row" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 18px', borderBottom: '1px solid var(--ink-rule)', scrollBehavior: 'smooth' }}>
        <Link to="/" className={`ink-pill ${!category ? 'ink-active' : ''}`} style={{
          padding: '8px 16px',
          background: !category ? 'var(--ink-stamp)' : 'transparent',
          color: !category ? 'white' : 'var(--ink-ink)',
          border: !category ? 'none' : '1px solid var(--ink-rule)',
          borderRadius: 4,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 12,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: '.2s',
        }}>
          All Desks
        </Link>
        {sidebarCategories.map(cat => (
          <Link key={cat} to={categoryPath(cat)} className={`ink-pill ${category === cat ? 'ink-active' : ''}`} style={{
            padding: '8px 16px',
            background: category === cat ? 'var(--ink-stamp)' : 'transparent',
            color: category === cat ? 'white' : 'var(--ink-ink)',
            border: category === cat ? 'none' : '1px solid var(--ink-rule)',
            borderRadius: 4,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: '.2s',
          }}>
            {cat}
          </Link>
        ))}
      </div>

      {/* ── Category banner (when filtering by category) ── */}
      {category && (
        <div style={{ padding: '28px 18px', borderBottom: '1px solid var(--ink-rule)', background: 'var(--ink-wire)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <p className="ink-mono" style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-wire-bright)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Desk
            </p>
            <h2 className="ink-serif" style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 600, color: '#eeeadf', marginBottom: 10 }}>
              {category}
            </h2>
            <Link to="/" style={{ fontSize: 12, color: 'rgba(238,234,223,.6)', textDecoration: 'none' }} className="ink-mono">
              &larr; Back to all desks
            </Link>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 18px 60px', width: '100%', boxSizing: 'border-box' }}>

        {searchQuery && (
          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="ink-mono" style={{ fontSize: 12, border: '1px solid var(--ink-rule)', borderRadius: 999, padding: '7px 16px', color: 'var(--ink-ink-soft)' }}>
              Search: "{searchQuery}"
            </span>
            <Link to="/" className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-stamp)', textDecoration: 'none' }}>
              Clear filters
            </Link>
          </div>
        )}

        {/* ── Hero ── */}
        {featuredPost && !searchQuery && (
          <div style={{ margin: '20px 0' }}>
            <NewsCard post={featuredPost} featured />
          </div>
        )}

        <div className="ink-two-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginTop: 24 }}>

          {/* ── Main feed column ── */}
          <div>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--ink-rule)', marginBottom: 8, overflowX: 'auto', scrollBehavior: 'smooth' }}>
              {[
                { value: 'latest', label: 'Latest', icon: <Clock size={13} /> },
                { value: 'popular', label: 'Popular', icon: <Flame size={13} /> },
                { value: 'trending', label: 'Trending', icon: <TrendingUp size={13} /> },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  className="ink-filter-btn"
                  onClick={() => setFilter(value)}
                  style={{
                    color: filter === value ? 'var(--ink-stamp)' : 'var(--ink-ink-soft)',
                    borderBottomColor: filter === value ? 'var(--ink-stamp)' : 'transparent',
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            <div className="ink-mono" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 10, color: 'var(--ink-ink-soft)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              <span>The Wire Desk</span>
              <span>Updated just now</span>
            </div>

            {loading ? (
              <div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--ink-rule)' }}>
                    <div className="ink-skeleton" style={{ width: 88, height: 88, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="ink-skeleton" style={{ height: 16, width: '85%', marginBottom: 10 }} />
                      <div className="ink-skeleton" style={{ height: 11, width: '45%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h3 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, color: 'var(--ink-ink)' }}>No stories found</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-ink-soft)', marginBottom: 20 }}>
                  {category ? `No posts in "${category}" yet.` : searchQuery ? `No results for "${searchQuery}".` : 'No posts yet. Create your first post in the admin dashboard!'}
                </p>
                {(category || searchQuery) && (
                  <Link to="/" className="ink-btn ink-btn-stamp" style={{ padding: '10px 20px', background: 'var(--ink-stamp)', color: 'white', textDecoration: 'none', borderRadius: 4, fontWeight: 600 }}>View all posts</Link>
                )}
              </div>
            ) : (
              <div className="ink-posts-grid">
                {displayPosts.map((post) => (
                  <NewsCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="ink-sidebar">
            <div className="ink-card" style={{ padding: '20px 18px', marginBottom: 20, position: 'sticky', top: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <h3 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Trending Now</h3>
              </div>
              {trendingPosts.length > 0 ? (
                <div>
                  {trendingPosts.map((post, i) => (
                    <TrendingPost key={post._id} post={post} rank={i + 1} />
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>No trending posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '22px 18px 34px' }} className="ink-mono ink-rule-top">
        <span style={{ fontSize: 10, color: 'var(--ink-ink-soft)', letterSpacing: '.08em' }}>SYDLINES MEDIA &mdash; REPORTED, NOT REPEATED</span>
      </div>
    </div>
  );
};

export default Home;