import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { categoriesAPI } from '../utils/api';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll?.() || { data: { data: [] } };
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCat.trim()) return;
    try {
      await categoriesAPI.create?.({ name: newCat });
      setNewCat('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoriesAPI.delete?.(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <style>{`
        .cat-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .cat-input-group { display: flex; gap: 12px; margin-bottom: 32px; }
        .cat-input { flex: 1; padding: 10px 14px; border: 1px solid #e8e4dd; border-radius: 4px; font-size: 14px; font-family: inherit; }
        .cat-btn { padding: 10px 20px; background: #C4422F; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .cat-btn:hover { opacity: 0.9; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .cat-card { background: white; border: 1px solid #e8e4dd; border-radius: 8px; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
        .cat-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .cat-name { font-weight: 600; color: #071A33; }
        .cat-actions { display: flex; gap: 8px; }
        .cat-action-btn { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #071A33; }
        .cat-action-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <h1 className="cat-header">Categories Management</h1>

      <div className="cat-input-group">
        <input
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name..."
          className="cat-input"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} className="cat-btn">
          <Plus size={16} /> Add
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading...</div>
      ) : (
        <div className="cat-grid">
          {categories.length > 0 ? categories.map((cat) => (
            <div key={cat._id} className="cat-card">
              <span className="cat-name">{cat.name || cat}</span>
              <div className="cat-actions">
                <button className="cat-action-btn"><Edit2 size={14} /></button>
                <button className="cat-action-btn" onClick={() => handleDelete(cat._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )) : <div style={{ padding: 40, color: '#64748B' }}>No categories</div>}
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;