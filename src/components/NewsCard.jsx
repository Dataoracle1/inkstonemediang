import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, MessageCircle } from 'lucide-react';

const ImageFallback = ({ category }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'var(--ink-wire)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#eeeadf',
    fontSize: 18,
    fontWeight: 600,
    minHeight: 120,
  }}>
    {(category || 'NEWS')[0]}
  </div>
);

const NewsCard = ({ post, featured = false }) => {
  const [imageBroken, setImageBroken] = React.useState(!post.image);

  const truncate = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (featured) {
    return (
      <Link
        to={`/news/${post.slug}`}
        style={{ textDecoration: 'none' }}
      >
        <article className="ink-card" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          padding: 28,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--ink-shadow-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <style>{`
            @media (max-width: 768px) {
              .ink-featured-card {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          <div className="ink-featured-card">
            <div style={{ background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)', overflow: 'hidden' }}>
              {!imageBroken ? (
                <img
                  src={post.image}
                  alt={post.title}
                  onError={() => setImageBroken(true)}
                  style={{
                    width: '100%',
                    height: 280,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                <ImageFallback category={post.category} />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="ink-stamp-badge" style={{ marginBottom: 12, display: 'inline-block' }}>
                {post.category}
              </span>
              <h2 className="ink-serif" style={{
                fontSize: 'clamp(20px, 3vw, 32px)',
                fontWeight: 600,
                marginBottom: 12,
                lineHeight: 1.2,
                color: 'var(--ink-ink)',
              }}>
                {post.title}
              </h2>
              <p style={{
                fontSize: 14,
                color: 'var(--ink-ink-soft)',
                lineHeight: 1.6,
                marginBottom: 16,
              }}>
                {truncate(post.excerpt || post.content, 150)}
              </p>
            </div>

            <div className="ink-mono" style={{
              display: 'flex',
              gap: 16,
              fontSize: 12,
              color: 'var(--ink-ink-soft)',
              flexWrap: 'wrap',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} />
                {formatDate(post.createdAt)}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={13} />
                {post.views || 0} views
              </span>
              {post.commentCount > 0 && (
                <>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageCircle size={13} />
                    {post.commentCount}
                  </span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      to={`/news/${post.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <article className="ink-card" style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderBottom: '1px solid var(--ink-rule)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--ink-shadow-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        <style>{`
          @media (max-width: 640px) {
            .ink-card-image {
              width: 60px !important;
              height: 60px !important;
            }
            
            .ink-card-content {
              flex: 1 !important;
            }
            
            .ink-card-title {
              font-size: 14px !important;
            }
            
            .ink-card-meta {
              font-size: 10px !important;
              gap: 8px !important;
            }
          }
        `}</style>

        <div className="ink-card-image" style={{
          flexShrink: 0,
          width: 88,
          height: 88,
          background: 'var(--ink-paper-dim)',
          border: '1px solid var(--ink-rule)',
          overflow: 'hidden',
        }}>
          {!imageBroken ? (
            <img
              src={post.image}
              alt={post.title}
              onError={() => setImageBroken(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <ImageFallback category={post.category} />
          )}
        </div>

        <div className="ink-card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p className="ink-stamp-badge ink-mono" style={{
              margin: 0,
              marginBottom: 6,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#c83232',
            }}>
              {post.category}
            </p>
            <h3 className="ink-card-title ink-serif" style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: 600,
              margin: 0,
              marginBottom: 8,
              lineHeight: 1.3,
              color: 'var(--ink-ink)',
            }}>
              {post.title}
            </h3>
            <p style={{
              fontSize: 'clamp(12px, 1.5vw, 13px)',
              color: 'var(--ink-ink-soft)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {truncate(post.excerpt || post.content, 80)}
            </p>
          </div>

          <div className="ink-card-meta ink-mono" style={{
            display: 'flex',
            gap: 12,
            fontSize: 11,
            color: 'var(--ink-ink-soft)',
            marginTop: 8,
            flexWrap: 'wrap',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={11} />
              {formatDate(post.createdAt)}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={11} />
              {post.views || 0}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;