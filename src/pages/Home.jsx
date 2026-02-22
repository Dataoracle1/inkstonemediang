
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import TrendingPost from '../components/TrendingPost';
import { TrendingUp, Clock, Flame, Zap } from 'lucide-react';
import { CATEGORIES, categoryPath, slugToCategory } from '../utils/categoryUtils';

const TICKER_HEIGHT = 40;

/* ── Intersection Observer hook ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ── Animated counter ── */
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── Scroll progress bar ── */
const ScrollProgress = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setWidth((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: 'rgba(0,0,0,0.1)' }}>
      <div style={{ height: '100%', width: `${width}%`, background: 'linear-gradient(90deg, #16a34a, #4ade80)', transition: 'width 0.1s linear', borderRadius: '0 2px 2px 0' }} />
    </div>
  );
};

/* ── Breaking News Ticker ── */
const BreakingNewsTicker = ({ isDark, navHeight }) => {
  const [breakingPosts, setBreakingPosts] = useState([]);

  const fetchBreakingNews = useCallback(async () => {
    try {
      const response = await postsAPI.getAll({ category: 'Breaking News', limit: 10 });
      const data = response.data.data?.posts || response.data.posts || response.data || [];
      setBreakingPosts(data);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
    }
  }, []);

  useEffect(() => {
    fetchBreakingNews();
    const interval = setInterval(fetchBreakingNews, 30000);
    return () => clearInterval(interval);
  }, [fetchBreakingNews]);

  const headlines = useMemo(() =>
    breakingPosts.map(p => p.title).filter(Boolean),
    [breakingPosts]
  );

  const text = headlines.join('   ·   ');

  if (!headlines.length) return null;

  return (
    <div style={{
      position: 'fixed',
      top: navHeight,       /* dynamically measured — always exact */
      left: 0,
      right: 0,
      height: TICKER_HEIGHT,
      background: isDark ? '#0f172a' : '#0f1a12',
      borderBottom: '2px solid #16a34a',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
      zIndex: 49,
    }}>
      {/* Label */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 20px',
        background: '#dc2626',
        position: 'relative',
        zIndex: 2,
      }}>
        <Zap size={13} color="white" fill="white" />
        <span style={{
          fontSize: 11,
          fontWeight: 900,
          color: 'white',
          letterSpacing: 2,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Breaking
        </span>
        <div style={{
          position: 'absolute',
          right: -12, top: 0, bottom: 0, width: 12,
          background: '#dc2626',
          clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
        }} />
      </div>

      {/* Ticker scroll */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', paddingLeft: 16, position: 'relative' }}>
        <div style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: `ticker ${Math.max(20, text.length * 0.12)}s linear infinite`,
          willChange: 'transform',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#d1fae5', fontFamily: "'DM Sans', sans-serif", paddingRight: 80 }}>
            {text}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#d1fae5', fontFamily: "'DM Sans', sans-serif", paddingRight: 80 }}>
            {text}
          </span>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 24, background: isDark ? 'linear-gradient(90deg,#0f172a,transparent)' : 'linear-gradient(90deg,#0f1a12,transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, background: isDark ? 'linear-gradient(270deg,#0f172a,transparent)' : 'linear-gradient(270deg,#0f1a12,transparent)', pointerEvents: 'none' }} />
      </div>

      {/* Live dot */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', paddingRight: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse-dot 1.4s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>LIVE</span>
        </div>
      </div>
    </div>
  );
};

/* ── Stats Bar ── */
const StatsBar = ({ posts, isDark }) => {
  const stats = [
    { label: 'Stories Today', value: posts.length, suffix: '+' },
    { label: 'Categories', value: 6, suffix: '' },
    { label: 'Readers', value: 12400, suffix: '+' },
  ];
  return (
    <div style={{
      background: isDark ? '#1e293b' : '#f0fdf4',
      borderBottom: `1px solid ${isDark ? '#334155' : '#dcfce7'}`,
      padding: '10px 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#16a34a', fontFamily: "'DM Sans', sans-serif" }}>
              <Counter end={s.value} suffix={s.suffix} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#94a3b8' : '#6b7280', fontFamily: "'DM Sans', sans-serif" }}>
              {s.label}
            </span>
            {i < stats.length - 1 && (
              <div style={{ width: 1, height: 20, background: isDark ? '#334155' : '#d1fae5', marginLeft: 16 }} />
            )}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: isDark ? '#64748b' : '#9ca3af', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

/* ── Section Header ── */
const SectionHeader = ({ eyebrow, title, sub, left = false }) => (
  <div style={{ textAlign: left ? 'left' : 'center', maxWidth: left ? 'none' : 560, margin: left ? '0' : '0 auto', marginBottom: 32 }}>
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: '#16a34a', marginBottom: 10, textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{eyebrow}</div>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: '#0f1a12', lineHeight: 1.2, margin: '0 0 10px' }}>{title}</h2>
    {sub && <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{sub}</p>}
  </div>
);

const Home = () => {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams();

  /* ── Measure navbar height dynamically ── */
  const [navHeight, setNavHeight] = useState(115);
  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector('nav');
      if (nav) setNavHeight(nav.offsetHeight);
    };
    measure();                                          // on mount
    window.addEventListener('resize', measure);        // on resize (mobile/desktop switch)
    return () => window.removeEventListener('resize', measure);
  }, []);

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

  /* Dark mode detection */
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  /* Color tokens */
  const c = useMemo(() => ({
    pageBg:         isDark ? '#0f172a' : '#f8fafc',
    cardBg:         isDark ? '#1e293b' : 'white',
    cardBorder:     isDark ? '#334155' : '#f3f4f6',
    headingColor:   isDark ? '#f1f5f9' : '#0f1a12',
    bodyText:       isDark ? '#cbd5e1' : '#374151',
    mutedText:      isDark ? '#94a3b8' : '#6b7280',
    filterBorder:   isDark ? '#1e293b' : '#f3f4f6',
    filterActive:   '#16a34a',
    filterInactive: isDark ? '#94a3b8' : '#6b7280',
    catLinkBg:      isDark ? '#0f2d1a' : '#f0fdf4',
    catLinkColor:   '#16a34a',
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

  /* Total offset = navbar + ticker — used for spacer and sidebar sticky top */
  const totalOffset = navHeight + TICKER_HEIGHT;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: c.pageBg, minHeight: '100vh', transition: 'background .3s', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=Playfair+Display:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
        @keyframes pulse   { 0%,100%{opacity:1;}50%{opacity:.45;} }
        @keyframes ticker  { from{transform:translateX(0);}to{transform:translateX(-50%);} }
        @keyframes float   { 0%,100%{transform:translateY(0px);}50%{transform:translateY(-8px);} }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 0 0 rgba(74,222,128,0.4); }
          50%      { opacity:.8; transform:scale(1.15); box-shadow:0 0 0 5px rgba(74,222,128,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .filter-btn {
          display:flex; align-items:center; gap:8px; padding:12px 22px; border:none;
          background:transparent; cursor:pointer; font-weight:700; font-size:13px;
          border-bottom:3px solid transparent; transition:.2s;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .filter-btn:hover { opacity:.8; }

        .cat-link {
          display:block; padding:10px 16px; border-radius:12px; transition:.2s;
          font-weight:600; font-size:14px; text-decoration:none;
        }

        @media(max-width:1024px){
          .two-col { grid-template-columns: 1fr !important; }
        }
        .posts-grid {
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(min(280px,100%), 1fr));
          gap:20px; width:100%;
        }
        @media(max-width:640px){
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-image { display:none !important; }
        }

        .skeleton-shimmer {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 400px 100%;
          animation: shimmer 1.5s infinite;
        }
        .dark .skeleton-shimmer {
          background: linear-gradient(90deg, #334155 25%, #3f536b 50%, #334155 75%);
          background-size: 400px 100%;
        }
      `}</style>

      <ScrollProgress />

      {/* ── Breaking News Ticker — FIXED, never moves ── */}
      <BreakingNewsTicker isDark={isDark} navHeight={navHeight} />

      {/* ── Spacer so page content starts below the fixed ticker ── */}
      <div style={{ height: TICKER_HEIGHT }} />

      {/* ── Stats Bar ── */}
      <StatsBar posts={posts} isDark={isDark} />

      {/* ── Featured Hero ── */}
      {featuredPost && !searchQuery && !category && (
        <div style={{
          background: 'linear-gradient(135deg,#0b1612 0%,#14532d 55%,#166534 100%)',
          padding: '56px 24px 96px',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}>
          <div style={{ position:'absolute', top:'-20%', right:'-8%', width:600, height:600, borderRadius:'50%', background:'rgba(74,222,128,.04)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-15%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'rgba(22,163,74,.06)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', inset:0, opacity:.08, backgroundImage:'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />

          <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1, width:'100%' }}>
            <div className="two-col hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center' }}>
              <div style={{ animation:'fadeUp .6s ease both' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(220,38,38,.2)', border:'1px solid rgba(220,38,38,.4)', borderRadius:100, padding:'5px 14px' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', animation:'pulse-dot 1.4s ease-in-out infinite' }} />
                    <span style={{ fontSize:11, fontWeight:800, color:'#fca5a5', letterSpacing:1.5, textTransform:'uppercase' }}>Live</span>
                  </div>
                  <span style={{ display:'inline-block', background:'rgba(74,222,128,.12)', border:'1px solid rgba(74,222,128,.25)', borderRadius:100, padding:'5px 14px', fontSize:11, fontWeight:700, color:'#86efac', letterSpacing:1, textTransform:'uppercase' }}>
                    {featuredPost.category || 'Featured Story'}
                  </span>
                </div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,4.5vw,52px)', fontWeight:900, color:'white', marginBottom:20, lineHeight:1.18, letterSpacing:'-0.01em' }}>
                  {featuredPost.title}
                </h1>
                <p style={{ fontSize:16, color:'rgba(255,255,255,.72)', lineHeight:1.8, marginBottom:32, maxWidth:480 }}>
                  {featuredPost.excerpt || featuredPost.content?.substring(0, 160) + '...'}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <Link
                    to={`/news/${featuredPost.slug || featuredPost._id}`}
                    style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 30px', background:'white', color:'#16a34a', borderRadius:14, fontWeight:800, fontSize:14, textDecoration:'none', boxShadow:'0 8px 28px rgba(0,0,0,.25)', transition:'.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                  >
                    Read Full Story
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </Link>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,.45)', fontWeight:500 }}>
                    {featuredPost.readTime || '5 min read'}
                  </span>
                </div>
              </div>

              {featuredPost.image && (
                <div className="hero-image" style={{ position:'relative', animation:'fadeUp .6s ease .1s both' }}>
                  <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.4)', border:'1px solid rgba(255,255,255,.08)', height:380 }}>
                    <img src={featuredPost.image} alt={featuredPost.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.3) 0%, transparent 50%)' }} />
                  </div>
                  <div style={{ position:'absolute', top:-16, right:-12, zIndex:3, background:'white', borderRadius:100, padding:'8px 16px', boxShadow:'0 8px 32px rgba(0,0,0,.15)', display:'flex', alignItems:'center', gap:8, animation:'float 3s ease-in-out infinite' }}>
                    <span style={{ fontSize:15 }}>🔥</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'#111827', whiteSpace:'nowrap' }}>Trending #1</span>
                  </div>
                  <div style={{ position:'absolute', bottom:-12, left:-16, zIndex:3, background:'white', borderRadius:100, padding:'8px 16px', boxShadow:'0 8px 32px rgba(0,0,0,.15)', display:'flex', alignItems:'center', gap:8, animation:'float 3s ease-in-out .8s infinite' }}>
                    <span style={{ fontSize:15 }}>👁️</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'#111827', whiteSpace:'nowrap' }}>Top Story</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ position:'absolute', bottom:-2, left:0, right:0 }}>
            <svg viewBox="0 0 1440 56" fill={c.pageBg} preserveAspectRatio="none" style={{ display:'block', width:'100%', height:56 }}>
              <path d="M0,32 C320,64 720,0 1080,28 C1240,42 1360,16 1440,32 L1440,56 L0,56 Z"/>
            </svg>
          </div>
        </div>
      )}

      {/* ── Category Banner ── */}
      {category && (
        <div style={{ background:'linear-gradient(135deg,#0b1612 0%,#14532d 100%)', padding:'40px 24px 48px', width:'100%', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:.06, backgroundImage:'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
          <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#4ade80', letterSpacing:2, textTransform:'uppercase', marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>Category</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,4vw,44px)', fontWeight:900, color:'white', marginBottom:16, lineHeight:1.2 }}>
              {category}
            </h2>
            <Link to="/"
              style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.5)', textDecoration:'none', transition:'.2s', display:'inline-flex', alignItems:'center', gap:6 }}
              onMouseEnter={e => e.currentTarget.style.color='#4ade80'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.5)'}
            >
              ← Back to all news
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div style={{
        maxWidth: 1280,
        margin: featuredPost && !searchQuery && !category ? '-56px auto 0' : '0 auto',
        padding: '0 16px 60px',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}>

        {searchQuery && (
          <div style={{ marginBottom:24, animation:'fadeUp .4s ease', paddingTop:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, background: isDark ? '#0f2d1a' : '#f0fdf4', border:`1px solid ${isDark ? '#166534' : '#dcfce7'}`, borderRadius:100, padding:'7px 16px', fontSize:13, fontWeight:700, color: isDark ? '#4ade80' : '#14532d', fontFamily:"'DM Sans',sans-serif" }}>
                🔍 Search: "{searchQuery}"
              </span>
              <Link to="/" style={{ fontSize:13, fontWeight:700, color:'#16a34a', textDecoration:'none', padding:'7px 14px' }}>
                Clear filters
              </Link>
            </div>
          </div>
        )}

        <div className="two-col" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:32, width:'100%' }}>

          {/* ── Main Column ── */}
          <div style={{ animation:'fadeUp .4s ease .05s both', minWidth:0 }}>

            {/* Filter Tabs */}
            <div style={{ display:'flex', gap:0, borderBottom:`2px solid ${c.filterBorder}`, marginBottom:28, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
              {[
                { value:'latest',   label:'Latest',   icon:<Clock size={16}/> },
                { value:'popular',  label:'Popular',  icon:<Flame size={16}/> },
                { value:'trending', label:'Trending', icon:<TrendingUp size={16}/> },
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
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            {loading ? (
              <div className="posts-grid">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ background:c.cardBg, borderRadius:20, overflow:'hidden', border:`1px solid ${c.cardBorder}` }}>
                    <div className="skeleton-shimmer" style={{ height:200 }} />
                    <div style={{ padding:20 }}>
                      <div className="skeleton-shimmer" style={{ height:14, borderRadius:8, marginBottom:10, width:'75%' }} />
                      <div className="skeleton-shimmer" style={{ height:11, borderRadius:8, width:'50%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'72px 24px', background:c.cardBg, borderRadius:24, border:`1px solid ${c.cardBorder}` }}>
                <div style={{ fontSize:64, marginBottom:20 }}>📰</div>
                <h3 style={{ fontSize:22, fontWeight:800, color:c.headingColor, marginBottom:12, fontFamily:"'Playfair Display',serif" }}>
                  No posts found
                </h3>
                <p style={{ fontSize:15, color:c.mutedText, marginBottom:24, lineHeight:1.6 }}>
                  {category ? `No posts in "${category}" yet.` : searchQuery ? `No results for "${searchQuery}".` : 'No posts yet. Create your first post in the admin dashboard!'}
                </p>
                {(category || searchQuery) && (
                  <Link to="/" style={{ display:'inline-block', padding:'12px 28px', background:'#16a34a', color:'white', borderRadius:12, fontWeight:700, fontSize:14, textDecoration:'none', boxShadow:'0 4px 16px rgba(22,163,74,.3)' }}>
                    View all posts
                  </Link>
                )}
              </div>
            ) : (
              <div className="posts-grid">
                {displayPosts.map((post, i) => (
                  <div key={post._id} style={{ animationDelay:`${i * 0.05}s`, minWidth:0 }}>
                    <NewsCard post={post} isDark={isDark} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div style={{ animation:'fadeUp .4s ease .15s both', minWidth:0 }}>

            {/* Trending Now */}
            <div style={{ background:c.cardBg, borderRadius:24, padding:'28px 24px', boxShadow:'0 4px 24px rgba(0,0,0,.07)', border:`1px solid ${c.cardBorder}`, marginBottom:24, position:'sticky', top: totalOffset + 8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <span style={{ fontSize:22 }}>🔥</span>
                <h2 style={{ fontSize:18, fontWeight:800, color:c.headingColor, margin:0, fontFamily:"'Playfair Display',serif" }}>
                  Trending Now
                </h2>
                <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#16a34a', animation:'pulse-dot 1.4s ease-in-out infinite' }} />
                  <span style={{ fontSize:10, fontWeight:700, color:'#16a34a', letterSpacing:1, fontFamily:"'DM Sans',sans-serif" }}>LIVE</span>
                </div>
              </div>
              {trendingPosts.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {trendingPosts.map((post, i) => (
                    <TrendingPost key={post._id} post={post} rank={i+1} isDark={isDark} />
                  ))}
                </div>
              ) : (
                <p style={{ fontSize:14, color:c.mutedText, fontFamily:"'DM Sans',sans-serif" }}>No trending posts yet.</p>
              )}
            </div>

            {/* Categories */}
            <div style={{ background:c.cardBg, borderRadius:24, padding:'28px 24px', boxShadow:'0 4px 24px rgba(0,0,0,.07)', border:`1px solid ${c.cardBorder}` }}>
              <h3 style={{ fontSize:16, fontWeight:800, color:c.headingColor, marginBottom:16, fontFamily:"'Playfair Display',serif" }}>
                Browse Topics
              </h3>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {sidebarCategories.map(cat => (
                  <Link
                    key={cat}
                    to={categoryPath(cat)}
                    className="cat-link"
                    style={{
                      background: category === cat ? c.catLinkBg : 'transparent',
                      color:      category === cat ? c.catLinkColor : c.bodyText,
                      fontFamily: "'DM Sans',sans-serif",
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