import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Search } from 'lucide-react';
import { postsAPI } from '../utils/api';

const StoriesManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll({ limit: 50 });
      const data = response.data.data?.posts || response.data.posts || response.data || [];
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsAPI.delete(id);
      setPosts(posts.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <style>{`
        .stories-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .stories-title { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #C4422F; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px; transition: opacity .15s; }
        .add-btn:hover { opacity: 0.9; }
        .search-box { margin-bottom: 24px; display: flex; gap: 12px; }
        .search-input { flex: 1; padding: 10px 14px; border: 1px solid #e8e4dd; border-radius: 4px; font-size: 14px; font-family: inherit; }
        .stories-table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden; }
        .stories-table th { background: #F1F3F5; padding: 14px; text-align: left; font-weight: 600; font-size: 12px; font-family: "IBM Plex Mono", monospace; letter-spacing: .08em; text-transform: uppercase; color: #64748B; border-bottom: 1px solid #e8e4dd; }
        .stories-table td { padding: 14px; border-bottom: 1px solid #e8e4dd; }
        .stories-table tr:hover { background: #FAF9F6; }
        .story-title { font-weight: 600; color: #071A33; }
        .story-meta { font-size: 12px; color: #64748B; font-family: "IBM Plex Mono", monospace; }
        .actions { display: flex; gap: 8px; }
        .action-btn { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #071A33; transition: all .15s; }
        .action-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <div className="stories-header">
        <h1 className="stories-title">Stories Management</h1>
        <button className="add-btn">
          <Plus size={16} /> Add New Story
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stories..."
          className="search-input"
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>Loading stories...</div>
      ) : filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>No stories found</div>
      ) : (
        <table className="stories-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Views</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post._id}>
                <td>
                  <div className="story-title">{post.title}</div>
                  <div className="story-meta">{post.slug}</div>
                </td>
                <td>{post.category}</td>
                <td>{post.views || 0}</td>
                <td><span style={{ background: '#e8f5e9', color: '#22c55e', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Published</span></td>
                <td className="story-meta">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button className="action-btn" title="View"><Eye size={16} /></button>
                    <button className="action-btn" title="Edit"><Edit2 size={16} /></button>
                    <button className="action-btn" onClick={() => handleDelete(post._id)} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StoriesManagement;