
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import TrendingPost from '../components/TrendingPost';
import { TrendingUp, Clock, Flame } from 'lucide-react';
import { CATEGORIES, categoryPath, slugToCategory } from '../utils/categoryUtils';

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
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest');

  // ── Dark mode detection (syncs with Navbar toggle) ──
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // ── Color tokens ──
  const c = useMemo(() => ({
    pageBg:       isDark ? '#0f172a' : '#f8fafc',
    cardBg:       isDark ? '#1e293b' : 'white',
    cardBorder:   isDark ? '#334155' : '#f3f4f6',
    headingColor: isDark ? '#f1f5f9' : '#0f1a12',
    bodyText:     isDark ? '#cbd5e1' : '#374151',
    mutedText:    isDark ? '#94a3b8' : '#6b7280',
    inputBg:      isDark ? '#1e293b' : 'white',
    inputBorder:  isDark ? '#475569' : '#e5e7eb',
    skeletonBg:   isDark ? '#334155' : '#e5e7eb',
    filterBorder: isDark ? '#1e293b' : '#f3f4f6',
    filterActive: '#16a34a',
    filterInactive: isDark ? '#94a3b8' : '#6b7280',
    filterHover:  isDark ? '#e2e8f0' : '#374151',
    catLinkBg:    isDark ? '#0f2d1a' : '#f0fdf4',
    catLinkColor: '#16a34a',
    emptyBtnBg:   '#16a34a',
  }), [isDark]);

  useEffect(() => { fetchTrendingPosts(); }, []);
  useEffect(() => { fetchPosts(); }, [filter, category, searchQuery]);

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
    } finally { setLoading(false); }
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

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: c.pageBg, minHeight: '100vh', transition: 'background .3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        @keyframes pulse   { 0%,100%{opacity:1;}50%{opacity:.5;} }

        .filter-btn {
          display:flex; align-items:center; gap:8px; padding:12px 20px; border:none;
          background:transparent; cursor:pointer; font-weight:700; font-size:14px;
          border-bottom:3px solid transparent; transition:.2s;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .cat-link {
          display:block; padding:10px 16px; border-radius:12px; transition:.2s;
          font-weight:600; font-size:14px; text-decoration:none;
        }
        @media(max-width:1024px){ .two-col { grid-template-columns:1fr !important; } }
      `}</style>

      {/* ── Featured Hero ── */}
      {featuredPost && !searchQuery && !category && (
        <div style={{ background: 'linear-gradient(135deg,#0f1a12 0%,#14532d 60%,#166534 100%)', padding: '48px 24px 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(74,222,128,.05)' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
              <div>
                <span style={{ display: 'inline-block', background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#4ade80', marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {featuredPost.category || 'Featured Story'}
                </span>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', marginBottom: 20, lineHeight: 1.2 }}>
                  {featuredPost.title}
                </h1>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,.8)', lineHeight: 1.8, marginBottom: 28 }}>
                  {featuredPost.excerpt || featuredPost.content?.substring(0, 150) + '...'}
                </p>
                <Link to={`/news/${featuredPost.slug || featuredPost._id}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'white', color: '#16a34a', borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.2)', transition: '.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Read More
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </div>
              {featuredPost.image && (
                <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.1)', height: 360 }}>
                  <img src={featuredPost.image} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
              )}
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
            <svg viewBox="0 0 1440 48" fill={c.pageBg} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 48 }}>
              <path d="M0,28 C360,60 1080,0 1440,28 L1440,48 L0,48 Z" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Category Banner ── */}
      {category && (
        <div style={{ background: 'linear-gradient(135deg,#0f1a12 0%,#14532d 100%)', padding: '36px 24px 40px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Category</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: 'white', marginBottom: 14, lineHeight: 1.2 }}>
              {category}
            </h2>
            <Link to="/"
              style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)', textDecoration: 'none', transition: '.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}>
              ← Back to all news
            </Link>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: featuredPost && !searchQuery && !category ? '-52px auto 0' : '0 auto', padding: '0 24px 48px', position: 'relative', zIndex: 1 }}>

        {/* ── Active Filters ── */}
        {searchQuery && (
          <div style={{ marginBottom: 24, animation: 'fadeUp .4s ease', paddingTop: category ? 0 : 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isDark ? '#0f2d1a' : '#f0fdf4', border: `1px solid ${isDark ? '#166534' : '#dcfce7'}`, borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: isDark ? '#4ade80' : '#14532d' }}>
                Search: "{searchQuery}"
              </span>
              <Link to="/" style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', textDecoration: 'none', padding: '6px 12px' }}>
                Clear filters
              </Link>
            </div>
          </div>
        )}

        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>

          {/* ── Main Content ── */}
          <div style={{ animation: 'fadeUp .4s ease .05s both' }}>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${c.filterBorder}`, marginBottom: 32, overflowX: 'auto' }}>
              {[
                { value: 'latest',   label: 'Latest',   icon: <Clock size={18} /> },
                { value: 'popular',  label: 'Popular',  icon: <Flame size={18} /> },
                { value: 'trending', label: 'Trending', icon: <TrendingUp size={18} /> },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  className="filter-btn"
                  onClick={() => setFilter(value)}
                  style={{
                    color: filter === value ? c.filterActive : c.filterInactive,
                    borderBottomColor: filter === value ? c.filterActive : 'transparent',
                  }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ background: c.cardBg, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)', animation: 'pulse 1.5s ease infinite', border: `1px solid ${c.cardBorder}` }}>
                    <div style={{ height: 200, background: c.skeletonBg }} />
                    <div style={{ padding: 20 }}>
                      <div style={{ height: 16, background: c.skeletonBg, borderRadius: 8, marginBottom: 12, width: '80%' }} />
                      <div style={{ height: 12, background: c.skeletonBg, borderRadius: 8, width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px', background: c.cardBg, borderRadius: 24, boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: `1px solid ${c.cardBorder}` }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📰</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: c.headingColor, marginBottom: 12, fontFamily: "'Playfair Display',serif" }}>
                  No posts found
                </h3>
                <p style={{ fontSize: 15, color: c.mutedText, marginBottom: 24 }}>
                  {category
                    ? `No posts in "${category}" yet.`
                    : searchQuery
                      ? `No results for "${searchQuery}".`
                      : 'No posts available yet. Create your first post in the admin dashboard!'}
                </p>
                {(category || searchQuery) && (
                  <Link to="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#16a34a', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(22,163,74,.3)' }}>
                    View all posts
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {displayPosts.map((post, i) => (
                  <div key={post._id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <NewsCard post={post} isDark={isDark} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div style={{ animation: 'fadeUp .4s ease .12s both' }}>

            {/* Trending */}
            <div style={{ background: c.cardBg, borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,.07)', border: `1px solid ${c.cardBorder}`, marginBottom: 24, position: 'sticky', top: 88 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: c.headingColor, marginBottom: 20, fontFamily: "'Playfair Display',serif", display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>🔥</span>
                Trending Now
              </h2>
              {trendingPosts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {trendingPosts.map((post, i) => (
                    <TrendingPost key={post._id} post={post} rank={i + 1} isDark={isDark} />
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 14, color: c.mutedText }}>No trending posts yet.</p>
              )}
            </div>

            {/* Categories */}
            <div style={{ background: c.cardBg, borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,.07)', border: `1px solid ${c.cardBorder}` }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: c.headingColor, marginBottom: 16, fontFamily: "'Playfair Display',serif" }}>
                Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {sidebarCategories.map(cat => (
                  <Link
                    key={cat}
                    to={categoryPath(cat)}
                    className="cat-link"
                    style={{
                      background: category === cat ? c.catLinkBg : 'transparent',
                      color: category === cat ? c.catLinkColor : c.bodyText,
                    }}
                    onMouseEnter={e => { if (category !== cat) e.currentTarget.style.background = isDark ? '#1e293b' : '#f9fafb'; }}
                    onMouseLeave={e => { if (category !== cat) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;