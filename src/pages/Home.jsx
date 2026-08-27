import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDark } = useTheme();
  const [trendingIndex, setTrendingIndex] = useState(0);

  const trending = [
    'Control After U.S. Military Operations',
    'Nigerians will soon be able to buy shares in refinery – Dangote',
    'INEC clarifies basis for recent voter data update',
  ];

  const categories = [
    { label: 'Breaking News', description: 'Stay updated', icon: '📰' },
    { label: 'Sports', description: 'Scores & updates', icon: '⚽' },
    { label: 'Entertainment', description: 'Celebs & culture', icon: '⭐' },
    { label: 'Technology', description: 'Gadgets & trends', icon: '⚙️' },
    { label: 'Politics', description: 'Policy & leaders', icon: '🏛️' },
    { label: 'Business', description: 'Markets & economy', icon: '📊' },
    { label: 'World', description: 'Global updates', icon: '🌍' },
    { label: 'Opinion', description: 'Views & analysis', icon: '💬' },
  ];

  const editorsPicks = [
    {
      id: 1,
      category: 'TECHNOLOGY',
      title: 'AI tools Nigerians are using to work smarter in 2026',
      date: 'Aug 27, 2026',
      readTime: '4 min read',
      image: '🖥️',
    },
    {
      id: 2,
      category: 'SPORTS',
      title: 'Super Eagles land in Uyo ahead of crucial qualifier',
      date: 'Aug 27, 2026',
      readTime: '3 min read',
      image: '⚽',
    },
    {
      id: 3,
      category: 'POLITICS',
      title: 'Senate passes bill to strengthen local content',
      date: 'Aug 27, 2026',
      readTime: '6 min read',
      image: '🏛️',
    },
  ];

  const latestNews = [
    {
      id: 1,
      title: 'Fuel price may drop as Dangote refinery increases supply',
      date: 'Aug 27, 2026',
      image: '🏭',
    },
    {
      id: 2,
      title: 'CBN raises interest rate by 25 basis points',
      date: 'Aug 27, 2026',
      image: '💰',
    },
    {
      id: 3,
      title: 'Electricity workers suspend strike after agreement',
      date: 'Aug 27, 2026',
      image: '⚡',
    },
    {
      id: 4,
      title: 'Nollywood set to shine at Toronto Film Festival',
      date: 'Aug 27, 2026',
      image: '🎬',
    },
  ];

  const featuredStories = [
    { id: 1, title: 'Story 1', image: '🌅', category: 'Breaking News' },
    { id: 2, title: 'Story 2', image: '🌃', category: 'Technology' },
    { id: 3, title: 'Story 3', image: '⛈️', category: 'Weather' },
  ];

  const mostRead = [
    {
      number: '01',
      title: 'Nigerians will soon be able to buy shares in refinery – Dangote',
      views: '12.5K views',
    },
    {
      number: '02',
      title: 'Super Eagles land in Uyo ahead of crucial qualifier',
      views: '9.3K views',
    },
    {
      number: '03',
      title: 'CBN raises interest rate by 25 basis points',
      views: '8.1K views',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: isDark ? '#0f1419' : '#ffffff',
        color: isDark ? '#fff' : '#000',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Trending Carousel */}
      <div
        style={{
          backgroundColor: isDark ? '#1a2a4a' : '#1a2a4a',
          color: 'white',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: '#d32f2f',
            padding: '8px 12px',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '12px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ⚡ TRENDING NOW
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              animation: `scroll 20s linear infinite`,
              whiteSpace: 'nowrap',
            }}
          >
            {[...trending, ...trending].map((item, idx) => (
              <span key={idx} style={{ marginRight: '60px', display: 'inline-block' }}>
                {item}
              </span>
            ))}
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        <button
          onClick={() => setTrendingIndex((prev) => (prev - 1 + trending.length) % trending.length)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ←
        </button>
        <button
          onClick={() => setTrendingIndex((prev) => (prev + 1) % trending.length)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          →
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* Featured + Editors Picks + Latest */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '60px',
          }}
        >
          {/* Featured Story */}
          <div
            style={{
              backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '360px',
                backgroundColor: isDark ? '#2a2f3e' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
              }}
            >
              🇳🇬
            </div>
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  width: 'fit-content',
                  marginBottom: '12px',
                }}
              >
                TOP STORY
              </div>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  margin: '12px 0',
                  color: isDark ? '#fff' : '#000',
                }}
              >
                Nigerians will soon be able to buy shares in refinery – Dangote
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: isDark ? '#aaa' : '#666',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                Dangote says the move will allow ordinary Nigerians to become part-owners in the country's energy future.
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: isDark ? '#999' : '#666' }}>
                <span>📅 Aug 27, 2026</span>
                <span>⏱️ 5 min read</span>
              </div>
            </div>
          </div>

          {/* Right Column - Editors Picks + Latest News */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Editors Picks */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: isDark ? '#fff' : '#000',
                  }}
                >
                  Editor's Picks
                </h3>
                <Link
                  to="/category/news"
                  style={{
                    fontSize: '12px',
                    color: '#d32f2f',
                    textDecoration: 'none',
                  }}
                >
                  View all →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {editorsPicks.map((article) => (
                  <div
                    key={article.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: isDark ? '#2a2f3e' : '#e0e0e0',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        flexShrink: 0,
                      }}
                    >
                      {article.image}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#d32f2f',
                          marginBottom: '4px',
                        }}
                      >
                        {article.category}
                      </div>
                      <h4
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: isDark ? '#fff' : '#000',
                          marginBottom: '6px',
                          lineHeight: 1.3,
                        }}
                      >
                        {article.title}
                      </h4>
                      <div
                        style={{
                          fontSize: '11px',
                          color: isDark ? '#999' : '#666',
                        }}
                      >
                        {article.date} • {article.readTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: isDark ? '#fff' : '#000',
                  }}
                >
                  Latest News
                </h3>
                <Link
                  to="/category/latest"
                  style={{
                    fontSize: '12px',
                    color: '#d32f2f',
                    textDecoration: 'none',
                  }}
                >
                  View all →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {latestNews.map((article) => (
                  <div
                    key={article.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: isDark ? '#2a2f3e' : '#e0e0e0',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        flexShrink: 0,
                      }}
                    >
                      {article.image}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: isDark ? '#fff' : '#000',
                          marginBottom: '6px',
                          lineHeight: 1.3,
                        }}
                      >
                        {article.title}
                      </h4>
                      <div
                        style={{
                          fontSize: '11px',
                          color: isDark ? '#999' : '#666',
                        }}
                      >
                        {article.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            marginBottom: '60px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '20px',
              color: isDark ? '#fff' : '#000',
            }}
          >
            Browse by Category
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={`/category/${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  textDecoration: 'none',
                  padding: '16px',
                  backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                  borderRadius: '8px',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '13px',
                    color: isDark ? '#fff' : '#000',
                    marginBottom: '4px',
                  }}
                >
                  {cat.label}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: isDark ? '#999' : '#666',
                  }}
                >
                  {cat.description}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Stories */}
        <div
          style={{
            marginBottom: '60px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #d32f2f',
              color: isDark ? '#fff' : '#000',
            }}
          >
            Featured Stories
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {featuredStories.map((story) => (
              <div
                key={story.id}
                style={{
                  backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: isDark ? '#2a2f3e' : '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px',
                  }}
                >
                  {story.image}
                </div>
                <div style={{ padding: '16px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#d32f2f',
                      marginBottom: '8px',
                    }}
                  >
                    {story.category}
                  </div>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: isDark ? '#fff' : '#000',
                    }}
                  >
                    {story.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Read */}
        <div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #d32f2f',
              color: isDark ? '#fff' : '#000',
            }}
          >
            Most Read
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {mostRead.map((article) => (
              <div
                key={article.number}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#d32f2f',
                    minWidth: '40px',
                  }}
                >
                  {article.number}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isDark ? '#fff' : '#000',
                      marginBottom: '8px',
                      lineHeight: 1.4,
                    }}
                  >
                    {article.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '12px',
                      color: isDark ? '#999' : '#666',
                    }}
                  >
                    {article.views}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;