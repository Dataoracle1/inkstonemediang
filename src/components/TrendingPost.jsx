
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TrendingPost = ({ post, rank }) => {
  const { _id, slug, title, image, category, createdAt } = post;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Use slug if available, fall back to _id for older posts
  const postUrl = `/news/${slug || _id}`;

  return (
    <Link
      to={postUrl}
      className="hover:bg-gray-50 dark:hover:bg-gray-800"
      style={{ display: 'flex', gap: 12, textDecoration: 'none', transition: '.2s', padding: 12, borderRadius: 12 }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={image}
          alt={title}
          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, transition: '.3s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        />
        {rank && (
          <div style={{ position: 'absolute', top: -6, left: -6, width: 24, height: 24, borderRadius: '50%', background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, boxShadow: '0 2px 8px rgba(22,163,74,.4)' }}>
            {rank}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', letterSpacing: .5, textTransform: 'uppercase' }}>
          {category}
        </span>
        <h4
          className="text-gray-900 dark:text-gray-100"
          style={{ fontSize: 14, fontWeight: 700, marginTop: 4, marginBottom: 6, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', transition: '.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#16a34a'}
          onMouseLeave={e => e.currentTarget.style.color = ''}
        >
          {title}
        </h4>
        <span className="text-gray-400 dark:text-gray-500" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
          <Clock size={12} />
          {timeAgo}
        </span>
      </div>
    </Link>
  );
};

export default TrendingPost;