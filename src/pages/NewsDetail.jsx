import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, Heart, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
import { postsAPI } from '../utils/api';
import CommentSection from '../components/CommentSection';
import TrendingPost from '../components/TrendingPost';
import AdSenseAd from '../components/AdSenseAd';
import { formatDistanceToNow } from 'date-fns';

const NewsDetail = () => {
  const { slug } = useParams();
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
      setTrendingPosts(response.data.data.posts);
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

  if (loading) return (
    <div style={{ background: 'var(--ink-paper)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
      <style>{`@keyframes ink-spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!post) return (
    <div style={{ background: 'var(--ink-paper)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="ink-serif" style={{ fontSize: 26, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 16 }}>Story not found</h2>
        <Link to="/" className="ink-btn ink-btn-stamp">Go Home</Link>
      </div>
    </div>
  );

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const embedUrl = getYouTubeEmbedUrl(post.videoUrl);

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .ink-share-btn {
          padding: 8px 16px; border-radius: 2px; border: 1px solid var(--ink-rule);
          background: transparent; font-size: 12px; font-weight: 600; color: var(--ink-ink-soft);
          cursor: pointer; transition: .15s; font-family: 'IBM Plex Mono', monospace; white-space: nowrap;
        }
        .ink-share-btn:hover { border-color: var(--ink-stamp); color: var(--ink-stamp); }

        .ink-article-content { font-size: 17px; line-height: 1.8; color: var(--ink-ink); font-family: 'Source Sans 3', sans-serif; }
        .ink-article-content h1 { font-size: 32px; font-weight: 600; margin: 32px 0 16px; color: var(--ink-ink); font-family: 'Fraunces',serif; }
        .ink-article-content h2 { font-size: 26px; font-weight: 600; margin: 28px 0 14px; color: var(--ink-ink); font-family: 'Fraunces',serif; }
        .ink-article-content h3 { font-size: 22px; font-weight: 600; margin: 24px 0 12px; color: var(--ink-ink); font-family: 'Fraunces',serif; }
        .ink-article-content p { margin-bottom: 16px; }
        .ink-article-content a { color: var(--ink-stamp); text-decoration: none; font-weight: 600; }
        .ink-article-content a:hover { text-decoration: underline; }
        .ink-article-content ul, .ink-article-content ol { margin: 16px 0; padding-left: 28px; }
        .ink-article-content li { margin-bottom: 8px; }
        .ink-article-content img { margin: 24px 0; max-width: 100%; height: auto; border: 1px solid var(--ink-rule); }
        .ink-article-content blockquote { border-left: 3px solid var(--ink-stamp); padding: 12px 20px; background: var(--ink-paper-dim); margin: 20px 0; font-style: italic; }
        .ink-article-content code { background: var(--ink-paper-dim); padding: 2px 6px; font-size: 15px; font-family: 'IBM Plex Mono', monospace; }

        @media (max-width: 768px) {
          .ink-detail-wrapper { padding: 0 !important; }
          .ink-detail-back { padding: 16px 18px 0 !important; margin-bottom: 16px !important; }
          .ink-two-col { grid-template-columns: 1fr !important; gap: 0 !important; }
          .ink-article-card { border-left: none !important; border-right: none !important; padding: 18px !important; }
          .ink-article-title { font-size: clamp(22px, 5vw, 32px) !important; }
          .ink-article-content { font-size: 15px !important; }
          .ink-sidebar { display: none !important; }
          .ink-comments-wrapper { padding: 0 18px 24px !important; }
          .ink-meta-bar { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .ink-two-col { grid-template-columns: 1fr !important; }
          .ink-sidebar { display: block !important; }
        }
        @media (min-width: 1025px) {
          .ink-two-col { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>

      <div className="ink-detail-wrapper" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 18px' }}>

        <div className="ink-detail-back">
          <Link to="/" className="ink-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', marginBottom: 24, color: 'var(--ink-stamp)' }}>
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="ink-two-col" style={{ display: 'grid', gap: 32 }}>

          {/* Main Article */}
          <div style={{ minWidth: 0 }}>
            <article className="ink-article-card ink-card" style={{ padding: 32 }}>

              <span className="ink-stamp-badge" style={{ marginBottom: 20, display: 'inline-block' }}>
                {post.category}
              </span>

              <h1 className="ink-article-title ink-serif" style={{ fontSize: 'clamp(24px,4vw,44px)', fontWeight: 600, marginBottom: 24, lineHeight: 1.15, color: 'var(--ink-ink)' }}>
                {post.title}
              </h1>

              <div className="ink-meta-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--ink-rule)', borderBottom: '1px solid var(--ink-rule)', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div className="ink-mono" style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ink-ink-soft)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} />{timeAgo}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={14} />{post.views} views</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={handleLike}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: hasLiked ? 'var(--ink-stamp)' : 'var(--ink-ink-soft)' }}>
                    <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
                    {post.likes}
                  </button>
                  <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}>
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {post.image && (
                <div style={{ marginBottom: 28, background: 'var(--ink-ink)', border: '1px solid var(--ink-rule)' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto', maxHeight: 480, objectFit: 'contain', display: 'block' }} />
                </div>
              )}

              {embedUrl && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', border: '1px solid var(--ink-rule)' }}>
                    <iframe src={embedUrl}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen />
                  </div>
                  {post.videoLink && (
                    <a href={post.videoLink} target="_blank" rel="noopener noreferrer"
                      className="ink-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: 'var(--ink-stamp)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                      <ExternalLink size={15} />Watch Full Video
                    </a>
                  )}
                </div>
              )}

              <div className="ink-article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              <div style={{ margin: '32px 0' }}>
                <AdSenseAd />
              </div>

              {post.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--ink-rule)' }}>
                  {post.tags.map(tag => (
                    <span key={tag} className="ink-pill" style={{ cursor: 'default' }}>#{tag}</span>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--ink-rule)' }}>
                <p className="ink-mono" style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-ink-soft)' }}>
                  Share this story:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button className="ink-share-btn" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>Facebook</button>
                  <button className="ink-share-btn" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}>Twitter</button>
                  <button className="ink-share-btn" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}>WhatsApp</button>
                  <button className="ink-share-btn" onClick={handleShare}>Copy Link</button>
                </div>
              </div>
            </article>

            <div className="ink-comments-wrapper" style={{ marginTop: 24 }}>
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="ink-sidebar">
            <div style={{ position: 'sticky', top: 16 }}>
              <div className="ink-card" style={{ padding: '24px 20px' }}>
                <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--ink-ink)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 4, height: 20, background: 'var(--ink-stamp)' }} />
                  Trending Stories
                </h3>
                <div>
                  {trendingPosts.filter(p => p._id !== post._id).slice(0, 5).map((tPost, i) => (
                    <TrendingPost key={tPost._id} post={tPost} rank={i + 1} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsDetail;