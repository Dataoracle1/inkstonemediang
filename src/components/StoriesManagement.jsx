import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

const StoriesManagement = () => {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setError('');
      const response = await api.get(`/posts?page=${page}&limit=20&status=published`);
      setPosts(response.data.data.posts);
      setTotal(response.data.data.pagination.total);
    } catch (err) {
      setError('Failed to load stories');
    }
    setLoading(false);
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete story');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: isDark ? '#0f1419' : '#ffffff', transition: 'all 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: isDark ? '#fff' : '#000' }}>
        Stories Management
      </h2>

      {error && (
        <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: isDark ? '#999' : '#666' }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: isDark ? '#999' : '#666', padding: '40px' }}>
          No stories published yet
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid #333' : '1px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: isDark ? '#999' : '#666', fontWeight: 600 }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: isDark ? '#999' : '#666', fontWeight: 600 }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: isDark ? '#999' : '#666', fontWeight: 600 }}>Views</th>
                  <th style={{ textAlign: 'center', padding: '12px', color: isDark ? '#999' : '#666', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: isDark ? '1px solid #333' : '1px solid #ddd' }}>
                    <td style={{ padding: '12px', color: isDark ? '#aaa' : '#666' }}>{post.title.substring(0, 50)}...</td>
                    <td style={{ padding: '12px', color: isDark ? '#aaa' : '#666' }}>{post.category}</td>
                    <td style={{ padding: '12px', color: isDark ? '#aaa' : '#666' }}>{post.views}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => deletePost(post._id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: page === 1 ? '#ccc' : '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ padding: '8px 16px', color: isDark ? '#fff' : '#000' }}>
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 20 >= total}
              style={{
                padding: '8px 16px',
                backgroundColor: page * 20 >= total ? '#ccc' : '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: page * 20 >= total ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StoriesManagement;