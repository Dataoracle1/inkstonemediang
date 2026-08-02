import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TrendingPost = ({ post, rank }) => {
  const { _id, slug, title, image, category, createdAt } = post;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const postUrl = `/news/${slug || _id}`;

  return (
    <Link to={postUrl} className="ink-story" style={{ padding: '10px 0' }}>
      <span className="ink-idx">{String(rank).padStart(2, '0')}</span>
      <div className="ink-body" style={{ minWidth: 0, flex: 1, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {image && (
          <div style={{ width: 56, height: 56, flexShrink: 0, overflow: 'hidden', border: '1px solid var(--ink-rule)' }}>
            <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <span className="ink-mono ink-cat" style={{ fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--ink-wire-bright)' }}>
            {category}
          </span>
          <h4 style={{ fontSize: 14, margin: '4px 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {title}
          </h4>
          <span className="ink-mono" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--ink-ink-soft)' }}>
            <Clock size={11} />
            {timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TrendingPost;