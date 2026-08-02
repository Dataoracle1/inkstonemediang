import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ post, featured = false }) => {
  const { _id, slug, title, excerpt, image, category, createdAt, views = 0, likes = 0 } = post;
  const postUrl = `/news/${slug || _id}`;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  if (featured) {
    // ── Hero block, matching the mockup's stamped hero exactly ──
    return (
      <Link to={postUrl} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          className="ink-card"
          style={{ position: 'relative', paddingBottom: 2 }}
        >
          {image && (
            <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
              <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, padding: '16px 16px 0' }}>
            <span className="ink-stamp-badge ink-live">
              <span className="ink-dot" />Live
            </span>
            <span className="ink-stamp-badge">{category}</span>
          </div>
          <h2 className="ink-serif" style={{ fontWeight: 600, fontSize: 'clamp(22px,4vw,30px)', lineHeight: 1.08, margin: '14px 16px 10px', color: 'var(--ink-ink)' }}>
            {title}
          </h2>
          {excerpt && (
            <p className="ink-serif" style={{ fontStyle: 'italic', fontWeight: 500, fontSize: 15, color: 'var(--ink-ink-soft)', margin: '0 16px 16px', lineHeight: 1.4 }}>
              {excerpt}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid var(--ink-rule)' }}>
            <span className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)', display: 'flex', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} />{timeAgo}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={11} />{views}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={11} />{likes}</span>
            </span>
            <span className="ink-btn">Read Story &rarr;</span>
          </div>
        </div>
      </Link>
    );
  }

  // ── Feed story row (numbered, mockup style) ──
  return (
    <Link to={postUrl} className="ink-story">
      {image && (
        <div style={{ width: 88, height: 88, flexShrink: 0, overflow: 'hidden', border: '1px solid var(--ink-rule)' }}>
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      <div className="ink-body" style={{ minWidth: 0, flex: 1 }}>
        <h4 style={{
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {title}
        </h4>
        <div className="ink-meta">
          <span className="ink-cat">{category}</span>
          <span>&middot;</span>
          <span>{timeAgo}</span>
          <span>&middot;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={11} />{views}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={11} />{likes}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;