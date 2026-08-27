import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { postsAPI } from '../utils/api';

const Home = () => {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll?.({ limit: 12 });
      const data = response?.data?.data?.posts || response?.data?.posts || [];
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = [
    { name: 'Breaking News', icon: '📰' },
    { name: 'Finance', icon: '💵' },
    { name: 'Stock Markets', icon: '📈' },
    { name: 'Economy', icon: '💹' },
    { name: 'Sports', icon: '🏆' },
    { name: 'Movies', icon: '🎬' },
    { name: 'Entertainment', icon: '⭐' },
    { name: 'Technology', icon: '💻' },
  ];

  return (
    <div style={{
      background: isDark ? '#0F1117' : '#FFFFFF',
      color: isDark ? '#E8E4DD' : '#071A33',
      transition: 'all 0.3s ease',
      minHeight: '100vh',
    }}>
      <style>{`
        .home-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin: 40px 0;
        }

        .category-card {
          background: ${isDark ? '#161B22' : '#FAF9F6'};
          border: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
        }

        .category-card:hover {
          background: ${isDark ? '#21262D' : '#FFFFFF'};
          border-color: #C4422F;
          transform: translateY(-4px);
          box-shadow: 0 4px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(196, 66, 47, 0.1)'};
        }

        .category-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .category-name {
          font-family: "Playfair Display", serif;
          font-size: 16px;
          font-weight: 700;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          margin: 0;
        }

        .category-link {
          font-size: 12px;
          color: #C4422F;
          margin-top: 8px;
          display: block;
          text-decoration: none;
          font-weight: 500;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .post-card {
          background: ${isDark ? '#161B22' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .post-card:hover {
          box-shadow: 0 8px 16px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'};
          transform: translateY(-4px);
        }

        .post-image {
          width: 100%;
          height: 200px;
          background: ${isDark ? '#0D1117' : '#F1F3F5'};
          object-fit: cover;
        }

        .post-content {
          padding: 20px;
        }

        .post-category {
          display: inline-block;
          background: rgba(196, 66, 47, 0.1);
          color: #C4422F;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .post-title {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .post-excerpt {
          font-size: 14px;
          color: ${isDark ? '#8B949E' : '#64748B'};
          margin: 0 0 12px;
          line-height: 1.5;
        }

        .post-meta {
          font-size: 12px;
          color: ${isDark ? '#8B949E' : '#64748B'};
          font-family: "IBM Plex Mono", monospace;
          display: flex;
          gap: 16px;
        }

        .section-title {
          font-family: "Playfair Display", serif;
          font-size: 24px;
          font-weight: 700;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          margin: 40px 0 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #C4422F;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: ${isDark ? '#8B949E' : '#64748B'};
        }

        @media (max-width: 768px) {
          .home-container {
            padding: 20px;
          }

          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="home-container">
        <h1 className="section-title">Categories</h1>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <a key={cat.name} href={`/?category=${encodeURIComponent(cat.name)}`} className="category-card">
              <div className="category-icon">{cat.icon}</div>
              <p className="category-name">{cat.name}</p>
              <span className="category-link">View articles</span>
            </a>
          ))}
        </div>

        <h2 className="section-title">Latest Stories</h2>
        {loading ? (
          <div className="loading">Loading stories...</div>
        ) : posts.length === 0 ? (
          <div className="loading">No stories found</div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <a
                key={post._id}
                href={`/article/${post.slug}`}
                className="post-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {post.featuredImage && (
                  <img src={post.featuredImage} alt={post.title} className="post-image" />
                )}
                <div className="post-content">
                  <span className="post-category">{post.category}</span>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt || post.content?.slice(0, 100)}</p>
                  <div className="post-meta">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;