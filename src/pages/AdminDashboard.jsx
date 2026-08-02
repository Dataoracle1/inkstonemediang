import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, Heart, LogOut, BarChart3, FileText, Users, Save, X, UserPlus, Key, Copy, Check, Shield, Mail, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsAPI, adminAPI } from '../utils/api';
import ContactsManagement from '../components/Contactsmanagement';
import { contactsAPI } from '../utils/contactAPI';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';
import AdminCommentsManagement from '../components/Admincommentsmanagement';
import NewsletterManagement from '../components/Newslettermanagement';

const CATEGORIES = ['Breaking News', 'Finance', 'Stock Markets', 'Economy', 'Sports', 'Movies', 'Entertainment', 'Technology', 'Politics', 'Health', 'World', 'Business', 'Science', 'Other'];

const EMPTY_POST = {
  title: '', content: '', excerpt: '', image: '', category: 'Breaking News',
  videoUrl: '', videoLink: '', tags: '', status: 'published', isFeatured: false, isTrending: false,
};

// ── Shared small pieces ───────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--ink-rule)', borderRadius: 2,
  fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", outline: 'none', transition: '.15s',
  background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', boxSizing: 'border-box',
};
const labelStyle = { display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '.06em' };

const Badge = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: { color: 'var(--ink-ink-soft)', border: 'var(--ink-rule)' },
    positive: { color: 'var(--ink-wire-bright)', border: 'var(--ink-wire-bright)' },
    warn: { color: '#b45309', border: '#b4530966' },
    danger: { color: 'var(--ink-stamp)', border: 'var(--ink-stamp)' },
    accent: { color: 'var(--ink-stamp)', border: 'var(--ink-stamp)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span className="ink-mono" style={{ padding: '3px 9px', border: `1px solid ${t.border}`, color: t.color, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
};

const ActionBtn = ({ icon, onClick, title, tone = 'neutral' }) => {
  const color = tone === 'danger' ? 'var(--ink-stamp)' : tone === 'positive' ? 'var(--ink-wire-bright)' : 'var(--ink-ink-soft)';
  return (
    <button onClick={onClick} title={title}
      style={{ width: 30, height: 30, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color, flexShrink: 0, transition: '.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-rule)'; }}>
      {icon}
    </button>
  );
};

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="ink-card" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</p>
      <p className="ink-serif stat-value" style={{ fontSize: 26, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>{value ?? '—'}</p>
    </div>
    <div style={{ width: 42, height: 42, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={19} color="var(--ink-stamp)" />
    </div>
  </div>
);

const Section = ({ title, children, action }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

// ── Reusable confirm toast (replaces window.confirm) ──
const confirmToast = (title, sub, onConfirm, confirmLabel = 'Delete', danger = true) => {
  toast.custom((t) => (
    <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', padding: '18px 20px', minWidth: 280, boxShadow: '0 8px 32px rgba(0,0,0,.18)', fontFamily: "'Source Sans 3', sans-serif" }}>
      <p className="ink-serif" style={{ fontWeight: 600, margin: '0 0 4px', fontSize: 16, color: 'var(--ink-ink)' }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', margin: '0 0 14px' }}>{sub}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={async () => { toast.dismiss(t.id); await onConfirm(); }} className="ink-btn"
          style={{ flex: 1, justifyContent: 'center', background: danger ? 'var(--ink-stamp)' : 'var(--ink-wire-bright)', color: '#fff', padding: '9px' }}>
          {confirmLabel}
        </button>
        <button onClick={() => toast.dismiss(t.id)} className="ink-btn" style={{ flex: 1, justifyContent: 'center', padding: '9px' }}>
          Cancel
        </button>
      </div>
    </div>
  ), { duration: Infinity, position: 'top-center' });
};

// ── Post editor form ─────────────────────────────────────────────────────
const PostForm = ({ formData, setFormData, editingPost, onSubmit, onCancel }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleContentChange = (value) => setFormData(prev => ({ ...prev, content: value }));
  const handleTagsGenerated = (generatedTags) => setFormData(prev => ({ ...prev, tags: generatedTags.join(', ') }));
  const handleImageChange = (url) => setFormData(prev => ({ ...prev, image: url }));

  return (
    <div className="ink-card" style={{ marginBottom: 28, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 className="ink-serif" style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h3>
        <button onClick={onCancel} style={{ width: 30, height: 30, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}>
          <X size={16} />
        </button>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Post title..." style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required style={inputStyle}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <ImageUploader value={formData.image} onChange={handleImageChange} label="Featured Image" required />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Excerpt</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={2} placeholder="Short summary (auto-generated if empty)" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Content *</label>
            <RichTextEditor value={formData.content} onChange={handleContentChange} placeholder="Write your content..." onTagsGenerated={handleTagsGenerated} />
          </div>

          <div>
            <label style={labelStyle}>Video URL (YouTube/Vimeo)</label>
            <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://youtube.com/..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Video External Link</label>
            <input type="url" name="videoLink" value={formData.videoLink} onChange={handleInputChange} placeholder="https://..." style={inputStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="finance, stocks, economy" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['isFeatured', 'Featured Post'], ['isTrending', 'Trending Post']].map(([key, lbl]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-ink-soft)' }}>
                <input type="checkbox" name={key} checked={formData[key]} onChange={handleInputChange} style={{ width: 16, height: 16, accentColor: 'var(--ink-stamp)', cursor: 'pointer' }} />
                {lbl}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
          <button type="submit" className="ink-btn ink-btn-stamp" style={{ padding: '11px 24px' }}>
            <Save size={16} /> {editingPost ? 'Update Post' : 'Publish Post'}
          </button>
          <button type="button" onClick={onCancel} className="ink-btn" style={{ padding: '11px 20px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { admin, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [inviteCodes, setInviteCodes] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(EMPTY_POST);
  const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [inviteFormData, setInviteFormData] = useState({ role: 'admin', expiresInDays: 7, isSingleUse: true, maxUses: 1, note: '' });

  useEffect(() => {
    fetchPosts(); fetchStats();
    if (isSuperAdmin) { fetchAdmins(); fetchInviteCodes(); }
  }, [isSuperAdmin]);

  const fetchPosts = async () => {
    try { setLoading(true); const r = await postsAPI.getAll({ limit: 100 }); setPosts(r.data.data.posts); }
    catch { toast.error('Failed to load posts'); } finally { setLoading(false); }
  };
  const fetchStats = async () => {
    try { const r = await postsAPI.getStats(); setStats(r.data.data); } catch { toast.error('Failed to load statistics'); }
  };
  const fetchAdmins = async () => {
    try { const r = await adminAPI.getAll(); setAdmins(r.data.data.admins); } catch { toast.error('Failed to load admins'); }
  };
  const fetchInviteCodes = async () => {
    try { const r = await adminAPI.getInviteCodes(); setInviteCodes(r.data.data.inviteCodes); } catch { toast.error('Failed to load invite codes'); }
  };

  const resetForm = () => { setFormData(EMPTY_POST); setEditingPost(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) };
    const tid = toast.loading(editingPost ? 'Updating post...' : 'Publishing post...');
    try {
      if (editingPost) await postsAPI.update(editingPost._id, postData);
      else await postsAPI.create(postData);
      toast.success(editingPost ? 'Post updated!' : 'Post published!', { id: tid });
      resetForm(); fetchPosts(); fetchStats();
    } catch (err) { toast.error('Failed: ' + (err.response?.data?.message || err.message), { id: tid }); }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title, content: post.content, excerpt: post.excerpt || '', image: post.image,
      category: post.category, videoUrl: post.videoUrl || '', videoLink: post.videoLink || '',
      tags: post.tags?.join(', ') || '', status: post.status,
      isFeatured: post.isFeatured || false, isTrending: post.isTrending || false,
    });
    setShowForm(true);
    toast.success('Post loaded for editing');
  };

  const handleDelete = (id) => confirmToast('Delete this post?', 'This action cannot be undone.', async () => {
    const tid = toast.loading('Deleting...');
    try { await postsAPI.delete(id); toast.success('Post deleted!', { id: tid }); fetchPosts(); fetchStats(); }
    catch { toast.error('Failed to delete', { id: tid }); }
  });

  const handleDeleteAdmin = (adminId) => confirmToast('Delete this admin?', 'Access will be revoked immediately.', async () => {
    const tid = toast.loading('Deleting...');
    try { await adminAPI.deleteAdmin(adminId); toast.success('Admin deleted!', { id: tid }); fetchAdmins(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed', { id: tid }); }
  });

  const handleRevokeInvite = (id) => confirmToast('Revoke invite code?', 'It will no longer be usable.', async () => {
    const tid = toast.loading('Revoking...');
    try { await adminAPI.revokeInvite(id); toast.success('Invite revoked!', { id: tid }); fetchInviteCodes(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed', { id: tid }); }
  }, 'Revoke');

  const handleLogout = () => confirmToast('Logout?', "You'll need to login again to access the dashboard.", async () => {
    logout();
    toast.success('Logged out!');
    setTimeout(() => navigate('/admin/login'), 500);
  }, 'Logout', false);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Creating admin...');
    try {
      await adminAPI.createAdmin(adminFormData);
      toast.success('Admin created!', { id: tid });
      setShowAdminForm(false); setAdminFormData({ name: '', email: '', password: '', role: 'admin' }); fetchAdmins();
    } catch (err) { toast.error('Error: ' + (err.response?.data?.message || 'Failed'), { id: tid }); }
  };

  const handleUpdateAdmin = async (adminId, updates) => {
    const tid = toast.loading('Updating...');
    try { await adminAPI.updateAdmin(adminId, updates); toast.success('Updated!', { id: tid }); fetchAdmins(); }
    catch { toast.error('Failed to update', { id: tid }); }
  };

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Generating...');
    try {
      await adminAPI.generateInvite(inviteFormData);
      toast.success('Invite code generated!', { id: tid });
      setShowInviteForm(false);
      setInviteFormData({ role: 'admin', expiresInDays: 7, isSingleUse: true, maxUses: 1, note: '' });
      fetchInviteCodes();
    } catch (err) { toast.error('Error: ' + (err.response?.data?.message || 'Failed'), { id: tid }); }
  };

  const handleCopyInviteLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/admin/signup?code=${code}`);
    setCopiedCode(code); toast.success('Link copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const roleTone = (role) => role === 'super-admin' ? 'accent' : role === 'editor' ? 'positive' : role === 'moderator' ? 'warn' : 'neutral';

  const tabs = [
    { id: 'posts', label: 'All Posts', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'newsletter', label: 'Newsletter', icon: Send },
    { id: 'contacts', label: 'Messages', icon: Mail },
    ...(isSuperAdmin ? [{ id: 'admins', label: 'Manage Admins', icon: Users }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-paper)' }}>
      <style>{`
        .dash-input:focus { border-color: var(--ink-stamp) !important; }
        .dash-tr:hover td { background: var(--ink-paper-dim); }
        .tabs-row { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        @keyframes ink-spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .hide-sm { display: none !important; }
          .stat-value { font-size: 20px !important; }
        }
      `}</style>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* ── Header ── */}
      <header style={{ background: 'var(--ink-wire)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '3px solid var(--ink-ink)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div className="ink-serif" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.02em', color: 'var(--ink-stamp)', marginBottom: 3 }}>
              SYD<em style={{ fontStyle: 'italic' }}>LINES</em>
            </div>
            <h1 className="ink-serif" style={{ fontSize: 19, fontWeight: 600, color: '#eeeadf', margin: 0 }}>
              Admin Dashboard
            </h1>
            <p className="ink-mono" style={{ fontSize: 11, color: 'rgba(238,234,223,.65)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Welcome, {admin?.name}
              {isSuperAdmin && <span style={{ marginLeft: 8, color: 'var(--ink-stamp)', fontWeight: 700 }}>SUPER ADMIN</span>}
            </p>
          </div>
          <button onClick={handleLogout} className="ink-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: 'transparent', border: '1px solid rgba(238,234,223,.25)', cursor: 'pointer', color: 'rgba(238,234,223,.8)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', flexShrink: 0 }}>
            <LogOut size={15} />
            <span className="hide-sm">Logout</span>
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* ── Stats Grid ── */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
            <StatCard label="Total Posts" value={stats.totalPosts} icon={FileText} />
            <StatCard label="Total Views" value={stats.totalViews?.toLocaleString()} icon={Eye} />
            <StatCard label="Total Likes" value={stats.totalLikes?.toLocaleString()} icon={Heart} />
            <StatCard label="Published" value={stats.publishedPosts} icon={BarChart3} />
          </div>
        )}

        {/* ── Main Card ── */}
        <div className="ink-card" style={{ padding: 24 }}>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--ink-rule)', flexWrap: 'wrap', gap: 10, paddingBottom: 0 }}>
            <div className="tabs-row" style={{ display: 'flex', gap: 4 }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="ink-mono"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
                      background: 'transparent', color: active ? 'var(--ink-stamp)' : 'var(--ink-ink-soft)',
                      border: 'none', borderBottom: active ? '2px solid var(--ink-stamp)' : '2px solid transparent',
                      cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em',
                      whiteSpace: 'nowrap', marginBottom: -1,
                    }}>
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {activeTab === 'posts' && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="ink-btn ink-btn-stamp" style={{ marginBottom: 10 }}>
                <Plus size={15} /> New Post
              </button>
            )}
          </div>

          {/* ── Posts Tab ── */}
          {activeTab === 'posts' && (
            <div>
              {showForm && (
                <PostForm
                  formData={formData} setFormData={setFormData} editingPost={editingPost}
                  onSubmit={handleSubmit} onCancel={resetForm}
                />
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto 14px' }} />
                  <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                  <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', fontWeight: 600 }}>No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                        {['Title', 'Category', 'Views', 'Likes', 'Status', 'Actions'].map(h => (
                          <th key={h} className="ink-mono" style={{ textAlign: h === 'Title' ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map(post => (
                        <tr key={post._id} className="dash-tr" style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
                              <img src={post.image} alt={post.title} style={{ width: 44, height: 44, objectFit: 'cover', border: '1px solid var(--ink-rule)', flexShrink: 0 }} />
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{post.title}</p>
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
                              <ActionBtn icon={<Edit2 size={14} />} onClick={() => handleEdit(post)} title="Edit" tone="positive" />
                              <ActionBtn icon={<Trash2 size={14} />} onClick={() => handleDelete(post._id)} title="Delete" tone="danger" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Comments Tab ── */}
          {activeTab === 'comments' && <AdminCommentsManagement />}

          {/* ── Newsletter Tab ── */}
          {activeTab === 'newsletter' && <NewsletterManagement />}

          {/* ── Contacts Tab ── */}
          {activeTab === 'contacts' && <ContactsManagement contactsAPI={contactsAPI} />}

          {/* ── Admins Tab ── */}
          {activeTab === 'admins' && isSuperAdmin && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <button onClick={() => setShowAdminForm(true)} className="ink-btn ink-btn-stamp">
                  <UserPlus size={15} /> Create Admin
                </button>
                <button onClick={() => setShowInviteForm(true)} className="ink-btn">
                  <Key size={15} /> Generate Invite
                </button>
              </div>

              {showAdminForm && (
                <div className="ink-card" style={{ marginBottom: 20, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Create New Admin</h3>
                    <button onClick={() => setShowAdminForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}><X size={18} /></button>
                  </div>
                  <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
                    {[['Name', 'text', 'name'], ['Email', 'email', 'email'], ['Password', 'password', 'password']].map(([lbl, type, key]) => (
                      <div key={key}>
                        <label style={labelStyle}>{lbl} *</label>
                        <input type={type} value={adminFormData[key]} onChange={e => setAdminFormData({ ...adminFormData, [key]: e.target.value })} required style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label style={labelStyle}>Role *</label>
                      <select value={adminFormData.role} onChange={e => setAdminFormData({ ...adminFormData, role: e.target.value })} style={inputStyle}>
                        <option value="admin">Admin</option><option value="editor">Editor</option><option value="moderator">Moderator</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <button type="submit" className="ink-btn ink-btn-stamp">Create Admin</button>
                    </div>
                  </form>
                </div>
              )}

              {showInviteForm && (
                <div className="ink-card" style={{ marginBottom: 20, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Generate Invite Code</h3>
                    <button onClick={() => setShowInviteForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}><X size={18} /></button>
                  </div>
                  <form onSubmit={handleGenerateInvite} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
                      <div>
                        <label style={labelStyle}>Role</label>
                        <select value={inviteFormData.role} onChange={e => setInviteFormData({ ...inviteFormData, role: e.target.value })} style={inputStyle}>
                          <option value="admin">Admin</option><option value="editor">Editor</option><option value="moderator">Moderator</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Expires (Days)</label>
                        <input type="number" min={1} max={365} value={inviteFormData.expiresInDays} onChange={e => setInviteFormData({ ...inviteFormData, expiresInDays: parseInt(e.target.value) })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Max Uses</label>
                        <input type="number" min={1} max={100} value={inviteFormData.maxUses} disabled={inviteFormData.isSingleUse} onChange={e => setInviteFormData({ ...inviteFormData, maxUses: parseInt(e.target.value) })} style={{ ...inputStyle, opacity: inviteFormData.isSingleUse ? .5 : 1 }} />
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-ink-soft)' }}>
                      <input type="checkbox" checked={inviteFormData.isSingleUse} onChange={e => setInviteFormData({ ...inviteFormData, isSingleUse: e.target.checked, maxUses: e.target.checked ? 1 : inviteFormData.maxUses })} style={{ width: 16, height: 16, accentColor: 'var(--ink-stamp)' }} />
                      Single Use Only
                    </label>
                    <div>
                      <label style={labelStyle}>Note (Optional)</label>
                      <input type="text" value={inviteFormData.note} onChange={e => setInviteFormData({ ...inviteFormData, note: e.target.value })} placeholder="For marketing team..." style={inputStyle} />
                    </div>
                    <button type="submit" className="ink-btn ink-btn-stamp" style={{ alignSelf: 'flex-start' }}>Generate Code</button>
                  </form>
                </div>
              )}

              <Section title={`All Admins (${admins.length})`}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                        {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                          <th key={h} className="ink-mono" style={{ textAlign: h === 'Name' || h === 'Email' ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map(adminUser => (
                        <tr key={adminUser._id} className="dash-tr" style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--ink-stamp)', flexShrink: 0 }}>{adminUser.name[0].toUpperCase()}</div>
                              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-ink)' }}>{adminUser.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{adminUser.email}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={roleTone(adminUser.role)}>{adminUser.role}</Badge></td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <Badge tone={adminUser.isActive ? 'positive' : 'danger'}>{adminUser.isActive ? 'Active' : 'Inactive'}</Badge>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                              {adminUser._id !== admin.id && adminUser.role !== 'super-admin' ? (
                                <>
                                  <ActionBtn icon={<Shield size={14} />} onClick={() => handleUpdateAdmin(adminUser._id, { isActive: !adminUser.isActive })} title={adminUser.isActive ? 'Deactivate' : 'Activate'} tone={adminUser.isActive ? 'positive' : 'neutral'} />
                                  <ActionBtn icon={<Trash2 size={14} />} onClick={() => handleDeleteAdmin(adminUser._id)} title="Delete" tone="danger" />
                                </>
                              ) : (
                                <span className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)' }}>You</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title={`Invite Codes (${inviteCodes.length})`}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                        {['Code', 'Role', 'Status', 'Uses', 'Expires', 'Actions'].map(h => (
                          <th key={h} className="ink-mono" style={{ textAlign: h === 'Code' ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {inviteCodes.map(invite => {
                        const isExpired = new Date(invite.expiresAt) < new Date();
                        const label = invite.isRevoked ? 'Revoked' : invite.isUsed ? 'Used' : isExpired ? 'Expired' : 'Active';
                        const tone = invite.isRevoked ? 'danger' : invite.isUsed ? 'neutral' : isExpired ? 'warn' : 'positive';
                        return (
                          <tr key={invite._id} className="dash-tr" style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                            <td style={{ padding: '12px' }}>
                              <code className="ink-mono" style={{ background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', padding: '4px 10px', fontSize: 11, fontWeight: 700, border: '1px solid var(--ink-rule)' }}>{invite.code}</code>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={roleTone(invite.role)}>{invite.role}</Badge></td>
                            <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={tone}>{label}</Badge></td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{invite.usageCount} / {invite.maxUses}</td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: 11, color: 'var(--ink-ink-soft)', whiteSpace: 'nowrap' }} className="ink-mono">{new Date(invite.expiresAt).toLocaleDateString()}</td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                                <ActionBtn icon={copiedCode === invite.code ? <Check size={14} /> : <Copy size={14} />} onClick={() => handleCopyInviteLink(invite.code)} title="Copy Link" tone="positive" />
                                {!invite.isRevoked && <ActionBtn icon={<X size={14} />} onClick={() => handleRevokeInvite(invite._id)} title="Revoke" tone="danger" />}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;