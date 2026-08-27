import React, { useState, useEffect } from 'react';
import { postsAPI } from '../utils/api';
import NewsCard from './NewsCard';

const RelatedArticles = ({ category, currentArticleId, limit = 3 }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await postsAPI.getAll({
          category,
          limit: limit + 1,
        });
        const posts = response.data.data?.posts || response.data.posts || response.data || [];
        const filtered = posts
          .filter((p) => p._id !== currentArticleId)
          .slice(0, limit);
        setRelatedPosts(filtered);
      } catch (error) {
        console.error('Error fetching related articles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchRelated();
  }, [category, currentArticleId, limit]);

  if (loading || relatedPosts.length === 0) return null;

  return (
    <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--ink-rule)' }}>
      <h3 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: 'var(--ink-ink)' }}>
        Related in {category}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
        {relatedPosts.map((post) => (
          <NewsCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;