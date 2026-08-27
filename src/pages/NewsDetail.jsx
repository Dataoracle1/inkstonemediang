import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Calendar, Eye, Heart, Share2, ArrowLeft, MessageCircle } from 'lucide-react';
import { postsAPI } from '../utils/api';
import CommentSection from '../components/CommentSection';
import TrendingPost from '../components/TrendingPost';
import AdSenseAd from '../components/AdSenseAd';
import { formatDistanceToNow } from 'date-fns';
import { trackPageView } from '../utils/analytics';

const NewsDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => { fetchPost(); fetchTrending(); }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getOne(slug);
      setPost(response.data.data.post);
      trackPageView(location.pathname, response.data.data.post._id);
      const userIdentifier = localStorage.getItem('userIdentifier');
      if (userIdentifier && response.data.data.post.likedBy?.includes(userIdentifier)) {
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await postsAPI.getTrending(5);
      const data = response.data.data?.posts || response.data.posts || response.data || [];
      setTrendingPosts(data);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await postsAPI.like(post._id);
      setPost({ ...post, likes: response.data.data.likes });
      setHasLiked(response.data.data.hasLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) {
    return (
      <div style={{ background: '#FAF9F6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, border: '3px solid #e8e4dd', borderTopColor: '#C4422F', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ background: '#FAF9F6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 600, color: '#071A33', marginBottom: 16 }}>Story not found</h2>
          <Link to="/" style={{ background: '#C4422F', color: 'white', padding: '10px 20px', borderRadius: 4, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={16} /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const embedUrl = getYouTubeEmbedUrl(post.videoUrl);

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      <style>{`
        .article-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 18px;
          box-sizing: border-box;
        }
        .article-header {
          padding: 40px 0;
          border-bottom: 1px solid #e8e4dd;
        }
        .article-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #C4422F;
          text-decoration: none;
          font-family: "IBM Plex Mono", monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .article-back:hover { color: #071A33; }
        .article-category {
          font-family: "IBM Plex Mono", monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #C4422F;
          margin-bottom: 12px;
        }
        .article-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(28px, 5vw, 52px);
          font-weight: 700;
          color: #071A33;
          margin: 0 0 16px;
          line-height: 1.2;
        }
        .article-excerpt {
          font-size: 18px;
          color: #64748B;
          line-height: 1.6;
          margin: 0 0 24px;
          max-width: 800px;
        }
        .article-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          font-family: "IBM Plex Mono", monospace;
          font-size: 12px;
          color: #64748B;
          margin-bottom: 24px;
        }
        .article-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .article-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 1px solid #e8e4dd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          color: #071A33;
          transition: all .15s;
          text-decoration: none;
        }
        .action-btn:hover {
          background: #071A33;
          color: white;
          border-color: #071A33;
        }
        .action-btn.active {
          background: #C4422F;
          color: white;
          border-color: #C4422F;
        }
        .article-content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          padding: 40px 0;
        }
        .article-content {
          font-size: 16px;
          line-height: 1.8;
          color: #17202A;
        }
        .article-content h2,
        .article-content h3 {
          font-family: "Playfair Display", serif;
          color: #071A33;
          margin: 32px 0 16px;
          font-weight: 700;
        }
        .article-content h2 { font-size: 28px; }
        .article-content h3 { font-size: 22px; }
        .article-content p {
          margin: 0 0 16px;
        }
        .article-content img,
        .article-content iframe {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 24px 0;
        }
        .article-content blockquote {
          border-left: 4px solid #C4422F;
          padding: 16px 20px;
          margin: 24px 0;
          background: #F1F3F5;
          font-style: italic;
          color: #64748B;
        }
        .article-featured-image {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          border-radius: 8px;
          margin: 24px 0;
        }
        .article-sidebar {
          position: sticky;
          top: 20px;
        }
        .sidebar-card {
          background: white;
          border: 1px solid #e8e4dd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .sidebar-title {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          color: #071A33;
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #C4422F;
        }
        @media (max-width: 1024px) {
          .article-content-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .article-sidebar { position: static; }
        }
        @media (max-width: 640px) {
          .article-header { padding: 24px 0; }
          .article-title { font-size: 24px; }
          .article-excerpt { font-size: 16px; }
          .article-meta { flex-direction: column; gap: 12px; }
          .article-actions { flex-direction: column; }
          .action-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* HEADER */}
      <div className="article-container">
        <div className="article-header">
          <Link to="/" className="article-back"><ArrowLeft size={14} /> Back to Home</Link>
          <div className="article-category">{post.category}</div>
          <h1 className="article-title">{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
          
          <div className="article-meta">
            <div className="article-meta-item">
              <Calendar size={14} /> {timeAgo}
            </div>
            <div className="article-meta-item">
              <Eye size={14} /> {post.views || 0} views
            </div>
            <div className="article-meta-item">
              ⏱️ {Math.ceil((post.content?.length || 1000) / 200)} min read
            </div>
          </div>

          <div className="article-actions">
            <button className={`action-btn ${hasLiked ? 'active' : ''}`} onClick={handleLike}>
              <Heart size={16} /> {post.likes || 0} Likes
            </button>
            <button className="action-btn" onClick={handleShare}>
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED IMAGE */}
      {post.image && (
        <div className="article-container">
          <img src={post.image} alt={post.title} className="article-featured-image" />
        </div>
      )}

      {/* CONTENT */}
      <div className="article-container">
        <div className="article-content-grid">
          <div>
            {/* ADENSE AD TOP */}
            <div style={{ marginBottom: 32 }}>
              <AdSenseAd />
            </div>

            {/* HTML CONTENT */}
            <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* YOUTUBE EMBED */}
            {embedUrl && (
              <div style={{ margin: '32px 0' }}>
                <iframe
                  width="100%"
                  height="400"
                  src={embedUrl}
                  title={post.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 8 }}
                />
              </div>
            )}

            {/* ADSENSE AD BOTTOM */}
            <div style={{ margin: '32px 0' }}>
              <AdSenseAd />
            </div>

            {/* COMMENTS */}
            <div style={{ marginTop: 40 }}>
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="article-sidebar">
            {/* TRENDING */}
            {trendingPosts.length > 0 && (
              <div className="sidebar-card">
                <h3 className="sidebar-title">Trending Now</h3>
                <div>
                  {trendingPosts.map((trendPost, i) => (
                    <TrendingPost key={trendPost._id} post={trendPost} rank={i + 1} />
                  ))}
                </div>
              </div>
            )}

            {/* RELATED POSTS */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Related Stories</h3>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                More stories in <strong>{post.category}</strong>
              </p>
            </div>

            {/* NEWSLETTER */}
            <div className="sidebar-card" style={{ background: '#071A33', color: '#eeeadf', border: 'none' }}>
              <h3 className="sidebar-title" style={{ color: '#eeeadf', borderBottomColor: '#C4422F' }}>Subscribe</h3>
              <p style={{ fontSize: 13, margin: '0 0 12px', lineHeight: 1.6 }}>
                Get our latest stories delivered daily.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="email" placeholder="your@email.com" style={{ padding: '10px 12px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(238,234,223,.2)', borderRadius: 4, color: '#eeeadf', fontSize: 12 }} required />
                <button type="submit" style={{ background: '#C4422F', color: 'white', padding: '10px 12px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;