import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { categoriesAPI } from '../../utils/api';
import { PanelHeader, Badge, ActionBtn, confirmToast, LoadingBlock, EmptyBlock, inputStyle, labelStyle } from '../../components/admin/AdminUI';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'active' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data.categories);
    } catch (error) {
      console.error('Fetch categories error:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => { setEditing(null); setForm({ name: '', description: '', status: 'active' }); setShowForm(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', status: cat.status }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading(editing ? 'Updating category...' : 'Creating category...');
    try {
      if (editing) await categoriesAPI.update(editing._id, form);
      else await categoriesAPI.create(form);
      toast.success(editing ? 'Category updated!' : 'Category created!', { id: tid });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category', { id: tid });
    }
  };

  const handleDelete = (cat) => confirmToast(`Delete "${cat.name}"?`, 'This does not delete stories already in this category.', async () => {
    const tid = toast.loading('Deleting...');
    try {
      await categoriesAPI.delete(cat._id);
      toast.success('Category deleted!', { id: tid });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete', { id: tid });
    }
  });

  const filtered = categories.filter(c => !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PanelHeader
        title="Categories"
        description="Organize content with categories and subcategories."
        action={<button onClick={openNew} className="ink-btn ink-btn-stamp"><Plus size={15} /> Add Category</button>}
      />

      {showForm && (
        <div className="ink-card" style={{ padding: 22, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>{editing ? 'Edit Category' : 'New Category'}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="ink-btn ink-btn-stamp">{editing ? 'Update' : 'Create'} Category</button>
            </div>
          </form>
        </div>
      )}

      <div className="ink-card" style={{ padding: 20 }}>
        <div style={{ position: 'relative', width: 240, marginBottom: 16 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
          <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 32 }} />
        </div>

        {loading ? <LoadingBlock label="Loading categories..." /> : filtered.length === 0 ? <EmptyBlock label="No categories yet." /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                  {['Category', 'Stories', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className="ink-mono" style={{ textAlign: i === 0 ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(cat => (
                  <tr key={cat._id} style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-ink)', margin: 0 }}>{cat.name}</p>
                      {cat.description && <p style={{ fontSize: 12, color: 'var(--ink-ink-soft)', margin: '3px 0 0' }}>{cat.description}</p>}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{cat.storyCount || 0}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={cat.status === 'active' ? 'positive' : 'neutral'}>{cat.status}</Badge></td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <ActionBtn icon={<Edit2 size={14} />} onClick={() => openEdit(cat)} title="Edit" tone="positive" />
                        <ActionBtn icon={<Trash2 size={14} />} onClick={() => handleDelete(cat)} title="Delete" tone="danger" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;