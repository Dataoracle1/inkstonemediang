import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { postsAPI } from '../../utils/api';
import { Badge, ActionBtn, confirmToast, LoadingBlock, EmptyBlock, inputStyle } from '../../components/admin/AdminUI';

// Note: the storyboard reference showed a "Pending" tab, but the Post
// model's real status values are draft / published / archived / scheduled
// — there's no "pending review" workflow state in the backend. Using the
// real values here rather than a fake tab with nothing behind it.
const TABS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Draft' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'archived', label: 'Archived' },
];

const StoriesManagement = ({ onEdit, onNew }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchPosts(); }, [tab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (tab !== 'all') params.status = tab;
      const res = await postsAPI.getAll(params);
      setPosts(res.data.data.posts);
    } catch (error) {
      console.error('Fetch posts error:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, title) => confirmToast(`Delete "${title}"?`, 'This action cannot be undone.', async () => {
    const tid = toast.loading('Deleting...');
    try {
      await postsAPI.delete(id);
      toast.success('Story deleted!', { id: tid });
      fetchPosts();
    } catch {
      toast.error('Failed to delete', { id: tid });
    }
  });

  const filtered = posts.filter(p => !search.trim() || p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 4px' }}>Stories</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', margin: 0 }}>Create, edit, organize, and manage all your stories.</p>
        </div>
        <button onClick={onNew} className="ink-btn ink-btn-stamp">
          <Plus size={15} /> Add New Story
        </button>
      </div>

      <div className="ink-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="ink-mono"
                style={{
                  padding: '8px 14px', border: '1px solid var(--ink-rule)', cursor: 'pointer', fontSize: 11,
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em',
                  background: tab === t.id ? 'var(--ink-ink)' : 'transparent',
                  color: tab === t.id ? 'var(--ink-paper)' : 'var(--ink-ink-soft)',
                }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
            <input type="text" placeholder="Search stories..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 32 }} />
          </div>
        </div>

        {loading ? (
          <LoadingBlock label="Loading stories..." />
        ) : filtered.length === 0 ? (
          <EmptyBlock label="No stories found in this view." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                  {['Title', 'Category', 'Views', 'Likes', 'Status', 'Actions'].map(h => (
                    <th key={h} className="ink-mono" style={{ textAlign: h === 'Title' ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post._id} style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
                        <img src={post.image} alt={post.title} style={{ width: 44, height: 44, objectFit: 'cover', border: '1px solid var(--ink-rule)', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{post.title}</p>
                          <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '3px 0 0' }}>{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone="positive">{post.category}</Badge></td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--ink-ink-soft)' }}>{post.views}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--ink-ink-soft)' }}>{post.likes}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <Badge tone={post.status === 'published' ? 'positive' : post.status === 'draft' ? 'warn' : 'neutral'}>{post.status}</Badge>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <ActionBtn icon={<Eye size={14} />} onClick={() => window.open(`/news/${post.slug || post._id}`, '_blank')} title="View" />
                        <ActionBtn icon={<Edit2 size={14} />} onClick={() => onEdit(post._id)} title="Edit" tone="positive" />
                        <ActionBtn icon={<Trash2 size={14} />} onClick={() => handleDelete(post._id, post.title)} title="Delete" tone="danger" />
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

export default StoriesManagement;