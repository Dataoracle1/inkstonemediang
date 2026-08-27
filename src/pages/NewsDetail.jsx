import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

const NewsDetail = () => {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${slug}`);
        if (response.data.success) {
          setPost(response.data.data.post);
        }
      } catch (err) {
        setError('Article not found');
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#0f1419' : '#ffffff', color: isDark ? '#fff' : '#000' }}>
        Loading article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#0f1419' : '#ffffff', color: '#c33', fontSize: '18px' }}>
        ❌ {error}
      </div>
    );
  }

  return (
    <article style={{ backgroundColor: isDark ? '#0f1419' : '#ffffff', color: isDark ? '#fff' : '#000', minHeight: '100vh', padding: '40px 20px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Category Badge */}
        <div style={{ display: 'inline-block', backgroundColor: '#d32f2f', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, marginBottom: '16px' }}>
          {post.category}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.2, marginBottom: '16px', color: isDark ? '#fff' : '#000' }}>
          {post.title}
        </h1>

        {/* Meta Info */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: isDark ? '#999' : '#666', marginBottom: '24px', paddingBottom: '24px', borderBottom: isDark ? '1px solid #333' : '1px solid #ddd' }}>
          <span>By {post.author?.name || 'Anonymous'}</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.views} views</span>
        </div>

        {/* Featured Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '40px',
            }}
          />
        )}

        {/* Content */}
        <div style={{ fontSize: '16px', lineHeight: 1.8, color: isDark ? '#aaa' : '#555', marginBottom: '40px' }}>
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '16px' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            padding: '20px',
            backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
            borderRadius: '8px',
            borderTop: isDark ? '1px solid #333' : '1px solid #ddd',
            marginTop: '40px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px' }}>👍</div>
            <div style={{ fontSize: '13px', color: isDark ? '#999' : '#666' }}>Likes</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: isDark ? '#fff' : '#000' }}>{post.likes}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px' }}>💬</div>
            <div style={{ fontSize: '13px', color: isDark ? '#999' : '#666' }}>Comments</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: isDark ? '#fff' : '#000' }}>{post.commentCount || 0}</div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsDetail;