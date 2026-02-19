

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, Heart, LogOut, BarChart3, FileText, Users, Save, X, ExternalLink, Video, UserPlus, Key, Copy, Check, Shield, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsAPI, adminAPI } from '../utils/api';
import ContactsManagement from '../components/Contactsmanagement';
import { contactsAPI } from '../utils/contactAPI';
import RichTextEditor from '../components/RichTextEditor';

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
  const [formData, setFormData] = useState({
    title: '', content: '', excerpt: '', image: '', category: 'Breaking News',
    videoUrl: '', videoLink: '', tags: '', status: 'published', isFeatured: false, isTrending: false,
  });
  const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [inviteFormData, setInviteFormData] = useState({ role: 'admin', expiresInDays: 7, isSingleUse: true, maxUses: 1, note: '' });

  // ── Dark mode sync with Navbar ──
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // ── Color tokens ──
  const c = {
    pageBg:      isDark ? '#0f172a' : '#f8fafc',
    cardBg:      isDark ? '#1e293b' : 'white',
    cardBorder:  isDark ? '#334155' : '#f3f4f6',
    headingColor: isDark ? '#f1f5f9' : '#0f1a12',
    bodyText:    isDark ? '#cbd5e1' : '#374151',
    mutedText:   isDark ? '#94a3b8' : '#6b7280',
    inputBg:     isDark ? '#0f172a' : 'white',
    inputBorder: isDark ? '#334155' : '#e5e7eb',
    inputColor:  isDark ? '#f1f5f9' : '#111827',
    formBg:      isDark ? '#0f2820' : '#f0fdf4',
    formBorder:  isDark ? 'rgba(22,163,74,.3)' : '#dcfce7',
    tableBorder: isDark ? '#1e293b' : '#f3f4f6',
    tableHover:  isDark ? '#243447' : '#f9fafb',
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: `1.5px solid ${c.inputBorder}`,
    borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', transition: '.2s', background: c.inputBg, color: c.inputColor, boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: c.bodyText, marginBottom: 6 };

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };
  const handleContentChange = (value) => setFormData({ ...formData, content: value });

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

  // ── Reusable confirm toast (replaces window.confirm) ──
  const confirmToast = (title, sub, onConfirm, confirmLabel = 'Delete', danger = true) => {
    toast((t) => (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: 15, color: '#111' }}>{title}</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>{sub}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={async () => { toast.dismiss(t.id); await onConfirm(); }}
            style={{ flex: 1, padding: '8px', background: danger ? '#ef4444' : '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            {confirmLabel}
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            style={{ flex: 1, padding: '8px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center', style: { background: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: '0 8px 32px rgba(0,0,0,.18)', minWidth: 260 } });
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
    toast.success('Logged out! 👋');
    setTimeout(() => navigate('/admin/login'), 500);
  }, 'Logout', false);

  const resetForm = () => {
    setFormData({ title: '', content: '', excerpt: '', image: '', category: 'Breaking News', videoUrl: '', videoLink: '', tags: '', status: 'published', isFeatured: false, isTrending: false });
    setEditingPost(null); setShowForm(false);
  };

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

  const categories = ['Breaking News', 'Finance', 'Stock Markets', 'Economy', 'Sports', 'Movies', 'Entertainment', 'Technology', 'Politics', 'Health', 'World', 'Business', 'Science', 'Other'];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super-admin': return { bg: isDark ? 'rgba(124,58,237,.2)' : '#f3e8ff', color: '#7c3aed' };
      case 'admin':       return { bg: isDark ? 'rgba(30,64,175,.2)' : '#dbeafe', color: isDark ? '#60a5fa' : '#1e40af' };
      case 'editor':      return { bg: isDark ? 'rgba(21,128,61,.2)' : '#dcfce7', color: '#15803d' };
      case 'moderator':   return { bg: isDark ? 'rgba(180,83,9,.2)' : '#fef3c7', color: '#b45309' };
      default:            return { bg: isDark ? 'rgba(55,65,81,.3)' : '#f3f4f6', color: c.bodyText };
    }
  };

  const actionBtn = (bg, hoverBg, icon, onClick, title) => (
    <button onClick={onClick} title={title}
      style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '.2s', flexShrink: 0 }}
      onMouseEnter={e => e.currentTarget.style.background = hoverBg}
      onMouseLeave={e => e.currentTarget.style.background = bg}>
      {icon}
    </button>
  );

  const tabs = [
    { id: 'posts',    label: 'All Posts',      icon: FileText },
    { id: 'contacts', label: 'Messages',        icon: Mail },
    ...(isSuperAdmin ? [{ id: 'admins', label: 'Manage Admins', icon: Users }] : []),
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: c.pageBg, minHeight: '100vh', transition: 'background .3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        * { box-sizing: border-box; }
        .dash-input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,.12) !important; }
        .dash-tr:hover td { background: ${c.tableHover}; transition: background .15s; }
        .tabs-row { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        @media (max-width: 600px) {
          .hide-sm { display: none !important; }
          .stat-value { font-size: 22px !important; }
        }
      `}</style>

      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { fontFamily: "'DM Sans', sans-serif", fontWeight: 600 },
        success: { style: { background: '#333', color: '#fff' }, iconTheme: { primary: '#16a34a', secondary: '#fff' } },
        error:   { style: { background: '#333', color: '#fff' }, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />

      {/* ── Header ── */}
      <header style={{ background: c.cardBg, boxShadow: isDark ? '0 2px 16px rgba(0,0,0,.3)' : '0 2px 12px rgba(0,0,0,.06)', position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid ${c.cardBorder}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 800, flexShrink: 0, boxShadow: '0 4px 12px rgba(22,163,74,.3)' }}>I</div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: 17, fontWeight: 800, color: c.headingColor, margin: 0, fontFamily: "'Playfair Display', serif" }}>Admin Dashboard</h1>
              <p style={{ fontSize: 12, color: c.mutedText, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Welcome, {admin?.name}
                {isSuperAdmin && <span style={{ marginLeft: 8, fontSize: 10, background: isDark ? 'rgba(124,58,237,.2)' : '#f3e8ff', color: '#7c3aed', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>Super Admin</span>}
              </p>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: c.mutedText, fontSize: 14, fontWeight: 600, transition: '.2s', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = isDark ? 'rgba(239,68,68,.1)' : '#fef2f2'; }}
            onMouseLeave={e => { e.currentTarget.style.color = c.mutedText; e.currentTarget.style.background = 'transparent'; }}>
            <LogOut size={17} />
            <span className="hide-sm">Logout</span>
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>

        {/* ── Stats Grid ── */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28, animation: 'fadeUp .4s ease' }}>
            {[
              { label: 'Total Posts',  value: stats.totalPosts,                  icon: FileText,  color: '#16a34a', bg: isDark ? 'rgba(22,163,74,.12)'  : '#f0fdf4' },
              { label: 'Total Views',  value: stats.totalViews?.toLocaleString(), icon: Eye,       color: '#3b82f6', bg: isDark ? 'rgba(59,130,246,.12)' : '#eff6ff' },
              { label: 'Total Likes',  value: stats.totalLikes?.toLocaleString(), icon: Heart,     color: '#ef4444', bg: isDark ? 'rgba(239,68,68,.12)'  : '#fef2f2' },
              { label: 'Published',    value: stats.publishedPosts,               icon: BarChart3,  color: '#16a34a', bg: isDark ? 'rgba(22,163,74,.12)'  : '#f0fdf4' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{ background: c.cardBg, borderRadius: 16, padding: '20px 24px', border: `1px solid ${c.cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,.2)' : '0 2px 12px rgba(0,0,0,.06)', transition: '.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,.3)' : '0 8px 24px rgba(0,0,0,.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,.2)' : '0 2px 12px rgba(0,0,0,.06)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 12, color: c.mutedText, fontWeight: 600, margin: '0 0 6px' }}>{stat.label}</p>
                      <p className="stat-value" style={{ fontSize: 28, fontWeight: 800, color: c.headingColor, margin: 0, fontFamily: "'Playfair Display',serif" }}>{stat.value}</p>
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} color={stat.color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Main Card ── */}
        <div style={{ background: c.cardBg, borderRadius: 20, padding: '24px', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,.25)' : '0 4px 20px rgba(0,0,0,.07)', border: `1px solid ${c.cardBorder}` }}>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: `2px solid ${c.tableBorder}`, flexWrap: 'wrap', gap: 10 }}>
            <div className="tabs-row" style={{ display: 'flex', gap: 6 }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: active ? '#16a34a' : isDark ? '#0f172a' : '#f9fafb', color: active ? 'white' : c.mutedText, border: 'none', borderRadius: '10px 10px 0 0', cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: '.2s', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', borderBottom: active ? '3px solid #16a34a' : 'none' }}
                    onMouseEnter={e => !active && (e.currentTarget.style.background = isDark ? '#1e293b' : '#f3f4f6')}
                    onMouseLeave={e => !active && (e.currentTarget.style.background = isDark ? '#0f172a' : '#f9fafb')}>
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {activeTab === 'posts' && (
              <button onClick={() => { resetForm(); setShowForm(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(22,163,74,.3)', transition: '.2s', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <Plus size={16} /> New Post
              </button>
            )}
          </div>

          {/* ── Posts Tab ── */}
          {activeTab === 'posts' && (
            <div>
              {showForm && (
                <div style={{ marginBottom: 28, padding: 24, border: `2px solid ${c.formBorder}`, borderRadius: 20, background: c.formBg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: c.headingColor, margin: 0, fontFamily: "'Playfair Display',serif" }}>
                      {editingPost ? '✏️ Edit Post' : '✨ Create New Post'}
                    </h3>
                    <button onClick={resetForm} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: isDark ? '#1e293b' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: c.mutedText }}>
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Post title..." className="dash-input" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Category *</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} required className="dash-input" style={inputStyle}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="dash-input" style={inputStyle}>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Image URL *</label>
                        <input type="url" name="image" value={formData.image} onChange={handleInputChange} required placeholder="https://example.com/image.jpg" className="dash-input" style={inputStyle} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Excerpt</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={2} placeholder="Short summary (auto-generated if empty)" className="dash-input" style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Content *</label>
                        <RichTextEditor value={formData.content} onChange={handleContentChange} placeholder="Write your content..." />
                      </div>
                      <div>
                        <label style={labelStyle}>Video URL (YouTube/Vimeo)</label>
                        <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://youtube.com/..." className="dash-input" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Video External Link</label>
                        <input type="url" name="videoLink" value={formData.videoLink} onChange={handleInputChange} placeholder="https://..." className="dash-input" style={inputStyle} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Tags (comma-separated)</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="finance, stocks, economy" className="dash-input" style={inputStyle} />
                      </div>
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        {[['isFeatured', 'Featured Post'], ['isTrending', 'Trending Post']].map(([key, lbl]) => (
                          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: c.bodyText }}>
                            <input type="checkbox" name={key} checked={formData[key]} onChange={handleInputChange} style={{ width: 18, height: 18, accentColor: '#16a34a', cursor: 'pointer' }} />
                            {lbl}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                      <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(22,163,74,.3)', fontFamily: "'DM Sans', sans-serif" }}>
                        <Save size={17} /> {editingPost ? 'Update Post' : 'Publish Post'}
                      </button>
                      <button type="button" onClick={resetForm} style={{ padding: '12px 24px', background: c.inputBg, color: c.bodyText, border: `1.5px solid ${c.inputBorder}`, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <div style={{ width: 44, height: 44, border: '3px solid rgba(22,163,74,.2)', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 12px' }} />
                  <p style={{ color: c.mutedText, fontSize: 14 }}>Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
                  <p style={{ fontSize: 15, color: c.mutedText, fontWeight: 600 }}>No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${c.tableBorder}` }}>
                        {['Title', 'Category', 'Views', 'Likes', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ textAlign: h === 'Title' ? 'left' : 'center', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: c.mutedText, textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map(post => (
                        <tr key={post._id} className="dash-tr" style={{ borderBottom: `1px solid ${c.tableBorder}` }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
                              <img src={post.image} alt={post.title} style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: c.headingColor, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{post.title}</p>
                                <p style={{ fontSize: 11, color: c.mutedText, margin: '3px 0 0' }}>{new Date(post.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', background: isDark ? 'rgba(22,163,74,.15)' : '#dcfce7', color: '#15803d', borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{post.category}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: c.bodyText }}>{post.views}</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: c.bodyText }}>{post.likes}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', background: post.status === 'published' ? (isDark ? 'rgba(22,163,74,.15)' : '#dcfce7') : post.status === 'draft' ? (isDark ? 'rgba(180,83,9,.2)' : '#fef3c7') : (isDark ? 'rgba(55,65,81,.3)' : '#f3f4f6'), color: post.status === 'published' ? '#15803d' : post.status === 'draft' ? '#b45309' : c.mutedText, borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                              {post.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                              {actionBtn(isDark ? 'rgba(59,130,246,.12)' : '#eff6ff', isDark ? 'rgba(59,130,246,.25)' : '#dbeafe', <Eye size={15} color="#3b82f6" />, () => window.open(`/news/${post._id}`, '_blank'), 'View')}
                              {actionBtn(isDark ? 'rgba(22,163,74,.12)'  : '#f0fdf4', isDark ? 'rgba(22,163,74,.25)'  : '#dcfce7', <Edit2 size={15} color="#16a34a" />, () => handleEdit(post), 'Edit')}
                              {actionBtn(isDark ? 'rgba(239,68,68,.12)'  : '#fef2f2', isDark ? 'rgba(239,68,68,.25)'  : '#fee2e2', <Trash2 size={15} color="#ef4444" />, () => handleDelete(post._id), 'Delete')}
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

          {/* ── Contacts Tab ── */}
          {activeTab === 'contacts' && <ContactsManagement contactsAPI={contactsAPI} />}

          {/* ── Admins Tab ── */}
          {activeTab === 'admins' && isSuperAdmin && (
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <button onClick={() => setShowAdminForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(22,163,74,.3)', fontFamily: "'DM Sans', sans-serif" }}>
                  <UserPlus size={16} /> Create Admin
                </button>
                <button onClick={() => setShowInviteForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: c.inputBg, color: c.bodyText, border: `1.5px solid ${c.inputBorder}`, borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                  <Key size={16} /> Generate Invite
                </button>
              </div>

              {showAdminForm && (
                <div style={{ marginBottom: 20, padding: 22, border: `2px solid ${c.formBorder}`, borderRadius: 18, background: c.formBg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: c.headingColor, fontFamily: "'Playfair Display', serif" }}>Create New Admin</h3>
                    <button onClick={() => setShowAdminForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.mutedText }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                    {[['Name', 'text', 'name'], ['Email', 'email', 'email'], ['Password', 'password', 'password']].map(([lbl, type, key]) => (
                      <div key={key}>
                        <label style={labelStyle}>{lbl} *</label>
                        <input type={type} value={adminFormData[key]} onChange={e => setAdminFormData({ ...adminFormData, [key]: e.target.value })} required className="dash-input" style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label style={labelStyle}>Role *</label>
                      <select value={adminFormData.role} onChange={e => setAdminFormData({ ...adminFormData, role: e.target.value })} className="dash-input" style={inputStyle}>
                        <option value="admin">Admin</option><option value="editor">Editor</option><option value="moderator">Moderator</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <button type="submit" style={{ padding: '10px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Create Admin</button>
                    </div>
                  </form>
                </div>
              )}

              {showInviteForm && (
                <div style={{ marginBottom: 20, padding: 22, border: `2px solid ${c.formBorder}`, borderRadius: 18, background: c.formBg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: c.headingColor, fontFamily: "'Playfair Display', serif" }}>Generate Invite Code</h3>
                    <button onClick={() => setShowInviteForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.mutedText }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleGenerateInvite} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Role</label>
                        <select value={inviteFormData.role} onChange={e => setInviteFormData({ ...inviteFormData, role: e.target.value })} className="dash-input" style={inputStyle}>
                          <option value="admin">Admin</option><option value="editor">Editor</option><option value="moderator">Moderator</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Expires (Days)</label>
                        <input type="number" min={1} max={365} value={inviteFormData.expiresInDays} onChange={e => setInviteFormData({ ...inviteFormData, expiresInDays: parseInt(e.target.value) })} className="dash-input" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Max Uses</label>
                        <input type="number" min={1} max={100} value={inviteFormData.maxUses} disabled={inviteFormData.isSingleUse} onChange={e => setInviteFormData({ ...inviteFormData, maxUses: parseInt(e.target.value) })} className="dash-input" style={{ ...inputStyle, opacity: inviteFormData.isSingleUse ? .5 : 1 }} />
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: c.bodyText }}>
                      <input type="checkbox" checked={inviteFormData.isSingleUse} onChange={e => setInviteFormData({ ...inviteFormData, isSingleUse: e.target.checked, maxUses: e.target.checked ? 1 : inviteFormData.maxUses })} style={{ width: 17, height: 17, accentColor: '#16a34a' }} />
                      Single Use Only
                    </label>
                    <div>
                      <label style={labelStyle}>Note (Optional)</label>
                      <input type="text" value={inviteFormData.note} onChange={e => setInviteFormData({ ...inviteFormData, note: e.target.value })} placeholder="For marketing team..." className="dash-input" style={inputStyle} />
                    </div>
                    <button type="submit" style={{ padding: '10px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", alignSelf: 'flex-start' }}>Generate Code</button>
                  </form>
                </div>
              )}

              {/* Admins Table */}
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14, color: c.headingColor, fontFamily: "'Playfair Display', serif" }}>All Admins ({admins.length})</h3>
              <div style={{ overflowX: 'auto', marginBottom: 32 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${c.tableBorder}` }}>
                      {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ textAlign: h === 'Name' || h === 'Email' ? 'left' : 'center', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: c.mutedText, textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(adminUser => {
                      const rb = getRoleBadgeColor(adminUser.role);
                      return (
                        <tr key={adminUser._id} className="dash-tr" style={{ borderBottom: `1px solid ${c.tableBorder}` }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{adminUser.name[0].toUpperCase()}</div>
                              <span style={{ fontWeight: 600, fontSize: 13, color: c.headingColor }}>{adminUser.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px', fontSize: 13, color: c.bodyText }}>{adminUser.email}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', background: rb.bg, color: rb.color, borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{adminUser.role}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', background: adminUser.isActive ? (isDark ? 'rgba(22,163,74,.15)' : '#dcfce7') : (isDark ? 'rgba(239,68,68,.15)' : '#fee2e2'), color: adminUser.isActive ? '#15803d' : '#dc2626', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                              {adminUser.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                              {adminUser._id !== admin.id && adminUser.role !== 'super-admin' ? (
                                <>
                                  {actionBtn(adminUser.isActive ? (isDark ? 'rgba(22,163,74,.12)' : '#f0fdf4') : (isDark ? '#1e293b' : '#f3f4f6'), adminUser.isActive ? (isDark ? 'rgba(22,163,74,.25)' : '#dcfce7') : (isDark ? '#334155' : '#e5e7eb'), <Shield size={15} color={adminUser.isActive ? '#16a34a' : '#9ca3af'} />, () => handleUpdateAdmin(adminUser._id, { isActive: !adminUser.isActive }), adminUser.isActive ? 'Deactivate' : 'Activate')}
                                  {actionBtn(isDark ? 'rgba(239,68,68,.12)' : '#fef2f2', isDark ? 'rgba(239,68,68,.25)' : '#fee2e2', <Trash2 size={15} color="#ef4444" />, () => handleDeleteAdmin(adminUser._id), 'Delete')}
                                </>
                              ) : (
                                <span style={{ fontSize: 11, color: c.mutedText }}>You</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Invite Codes Table */}
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14, color: c.headingColor, fontFamily: "'Playfair Display', serif" }}>Invite Codes ({inviteCodes.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${c.tableBorder}` }}>
                      {['Code', 'Role', 'Status', 'Uses', 'Expires', 'Actions'].map(h => (
                        <th key={h} style={{ textAlign: h === 'Code' ? 'left' : 'center', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: c.mutedText, textTransform: 'uppercase', letterSpacing: .5, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inviteCodes.map(invite => {
                      const rb = getRoleBadgeColor(invite.role);
                      const isExpired = new Date(invite.expiresAt) < new Date();
                      const s = {
                        label: invite.isRevoked ? 'Revoked' : invite.isUsed ? 'Used' : isExpired ? 'Expired' : 'Active',
                        bg:    invite.isRevoked ? (isDark ? 'rgba(239,68,68,.15)' : '#fee2e2') : invite.isUsed ? (isDark ? '#1e293b' : '#f3f4f6') : isExpired ? (isDark ? 'rgba(180,83,9,.2)' : '#fef3c7') : (isDark ? 'rgba(22,163,74,.15)' : '#dcfce7'),
                        color: invite.isRevoked ? '#dc2626' : invite.isUsed ? c.mutedText : isExpired ? '#b45309' : '#15803d',
                      };
                      return (
                        <tr key={invite._id} className="dash-tr" style={{ borderBottom: `1px solid ${c.tableBorder}` }}>
                          <td style={{ padding: '12px' }}>
                            <code style={{ background: isDark ? '#0f172a' : '#f3f4f6', color: c.headingColor, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: `1px solid ${c.inputBorder}` }}>{invite.code}</code>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', background: rb.bg, color: rb.color, borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{invite.role}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', background: s.bg, color: s.color, borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, color: c.bodyText }}>{invite.usageCount} / {invite.maxUses}</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: 12, color: c.mutedText, whiteSpace: 'nowrap' }}>{new Date(invite.expiresAt).toLocaleDateString()}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                              {actionBtn(isDark ? 'rgba(59,130,246,.12)' : '#eff6ff', isDark ? 'rgba(59,130,246,.25)' : '#dbeafe', copiedCode === invite.code ? <Check size={15} color="#16a34a" /> : <Copy size={15} color="#3b82f6" />, () => handleCopyInviteLink(invite.code), 'Copy Link')}
                              {!invite.isRevoked && actionBtn(isDark ? 'rgba(239,68,68,.12)' : '#fef2f2', isDark ? 'rgba(239,68,68,.25)' : '#fee2e2', <X size={15} color="#ef4444" />, () => handleRevokeInvite(invite._id), 'Revoke')}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;