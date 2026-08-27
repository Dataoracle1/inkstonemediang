import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

const CategoriesManagement = () => {
  const { isDark } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.categories);
    } catch (err) {
      setError('Failed to load categories');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await api.post('/categories', formData);
      setCategories([...categories, response.data.data.category]);
      setFormData({ name: '', description: '', status: 'active' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: isDark ? '#0f1419' : '#ffffff', transition: 'all 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: isDark ? '#fff' : '#000' }}>
        Categories Management
      </h2>

      {error && (
        <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {/* Add Category Form */}
      <div style={{ backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: isDark ? '#fff' : '#000' }}>
          Add New Category
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input
            type="text"
            placeholder="Category name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{
              padding: '10px 12px',
              border: isDark ? '1px solid #444' : '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: isDark ? '#2a2f3e' : '#fff',
              color: isDark ? '#fff' : '#000',
            }}
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            style={{
              padding: '10px 12px',
              border: isDark ? '1px solid #444' : '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: isDark ? '#2a2f3e' : '#fff',
              color: isDark ? '#fff' : '#000',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Create Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: isDark ? '#999' : '#666' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              style={{
                backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                padding: '16px',
                borderRadius: '8px',
                border: isDark ? '1px solid #333' : '1px solid #ddd',
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#fff' : '#000', margin: '0 0 8px 0' }}>
                {cat.name}
              </h4>
              <p style={{ fontSize: '13px', color: isDark ? '#999' : '#666', margin: '0 0 12px 0' }}>
                {cat.description || 'No description'}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: cat.status === 'active' ? '#4caf50' : '#f44336',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {cat.status}
                </span>
                <button
                  onClick={() => deleteCategory(cat._id)}
                  style={{
                    marginLeft: 'auto',
                    padding: '4px 12px',
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;