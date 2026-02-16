

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Eye, Heart, MessageSquare, LogOut, 
  BarChart3, FileText, Users, Save, X, ExternalLink, Video,
  UserPlus, Key, Copy, Check, Shield, Mail, User as UserIcon
} from 'lucide-react';
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
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'Breaking News',
    videoUrl: '',
    videoLink: '',
    tags: '',
    status: 'published',
    isFeatured: false,
    isTrending: false,
  });

  
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const [inviteFormData, setInviteFormData] = useState({
    role: 'admin',
    expiresInDays: 7,
    isSingleUse: true,
    maxUses: 1,
    note: '',
  });

  useEffect(() => {
    fetchPosts();
    fetchStats();
    if (isSuperAdmin) {
      fetchAdmins();
      fetchInviteCodes();
    }
  }, [isSuperAdmin]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll({ limit: 100 });
      setPosts(response.data.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await postsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await adminAPI.getAll();
      setAdmins(response.data.data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admins');
    }
  };

  const fetchInviteCodes = async () => {
    try {
      const response = await adminAPI.getInviteCodes();
      setInviteCodes(response.data.data.inviteCodes);
    } catch (error) {
      console.error('Error fetching invite codes:', error);
      toast.error('Failed to load invite codes');
    }
  };

 
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

 
  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    const loadingToast = toast.loading(editingPost ? 'Updating post...' : 'Publishing post...');

    try {
      if (editingPost) {
        await postsAPI.update(editingPost._id, postData);
        toast.success('Post updated successfully!', { id: loadingToast });
      } else {
        await postsAPI.create(postData);
        toast.success('Post published successfully!', { id: loadingToast });
      }
      
      resetForm();
      fetchPosts();
      fetchStats();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(
        'Failed to save post: ' + (error.response?.data?.message || error.message),
        { id: loadingToast }
      );
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      image: post.image,
      category: post.category,
      videoUrl: post.videoUrl || '',
      videoLink: post.videoLink || '',
      tags: post.tags?.join(', ') || '',
      status: post.status,
      isFeatured: post.isFeatured || false,
      isTrending: post.isTrending || false,
    });
    setShowForm(true);
    toast.success('Post loaded for editing');
  };


const handleDelete = async (id) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Delete this post?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting post...');
              try {
                await postsAPI.delete(id);
                toast.success('Post deleted successfully!', { id: loadingToast });
                fetchPosts();
                fetchStats();
              } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Failed to delete post', { id: loadingToast });
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }
    }
  );
};


  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image: '',
      category: 'Breaking News',
      videoUrl: '',
      videoLink: '',
      tags: '',
      status: 'published',
      isFeatured: false,
      isTrending: false,
    });
    setEditingPost(null);
    setShowForm(false);
  };

 
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating admin...');

    try {
      await adminAPI.createAdmin(adminFormData);
      toast.success('Admin created successfully!', { id: loadingToast });
      setShowAdminForm(false);
      setAdminFormData({ name: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
    } catch (error) {
      toast.error(
        'Error: ' + (error.response?.data?.message || 'Failed to create admin'),
        { id: loadingToast }
      );
    }
  };

  const handleUpdateAdmin = async (adminId, updates) => {
    const loadingToast = toast.loading('Updating admin...');

    try {
      await adminAPI.updateAdmin(adminId, updates);
      toast.success('Admin updated successfully!', { id: loadingToast });
      fetchAdmins();
    } catch (error) {
      toast.error(
        'Error: ' + (error.response?.data?.message || 'Failed to update admin'),
        { id: loadingToast }
      );
    }
  };


const handleDeleteAdmin = async (adminId) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Delete this admin?</p>
        <p className="text-sm text-gray-600">This will revoke their access immediately.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting admin...');
              try {
                await adminAPI.deleteAdmin(adminId);
                toast.success('Admin deleted successfully!', { id: loadingToast });
                fetchAdmins();
              } catch (error) {
                toast.error(
                  error.response?.data?.message || 'Failed to delete admin',
                  { id: loadingToast }
                );
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }
    }
  );
};


  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Generating invite code...');

    try {
      const response = await adminAPI.generateInvite(inviteFormData);
      toast.success('Invite code generated successfully!', { id: loadingToast });
      setShowInviteForm(false);
      setInviteFormData({
        role: 'admin',
        expiresInDays: 7,
        isSingleUse: true,
        maxUses: 1,
        note: '',
      });
      fetchInviteCodes();
    } catch (error) {
      toast.error(
        'Error: ' + (error.response?.data?.message || 'Failed to generate invite'),
        { id: loadingToast }
      );
    }
  };

  const handleCopyInviteLink = (code) => {
    const link = `${window.location.origin}/admin/signup?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };


  
const handleRevokeInvite = async (id) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Revoke this invite code?</p>
        <p className="text-sm text-gray-600">It will no longer be usable.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Revoking invite...');
              try {
                await adminAPI.revokeInvite(id);
                toast.success('Invite code revoked!', { id: loadingToast });
                fetchInviteCodes();
              } catch (error) {
                toast.error(
                  error.response?.data?.message || 'Failed to revoke invite',
                  { id: loadingToast }
                );
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition"
          >
            Revoke
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }
    }
  );
};


  
const handleLogout = () => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Logout?</p>
        <p className="text-sm text-gray-600">You'll need to login again.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              logout();
              toast.success('Logged out successfully! 👋');
              setTimeout(() => navigate('/admin/login'), 500);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }
    }
  );
};

  const categories = [
    'Breaking News', 'Finance', 'Stock Markets', 'Economy',
    'Sports', 'Movies', 'Entertainment', 'Technology',
    'Politics', 'Health', 'World', 'Business', 'Science', 'Other'
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super-admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'admin': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'editor': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'moderator': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

    
      <header className="bg-white dark:bg-dark-800 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {admin?.name} 
                  {isSuperAdmin && <span className="ml-2 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded">Super Admin</span>}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
       
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                  <p className="text-3xl font-bold">{stats.totalPosts}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="text-primary-500" size={24} />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="text-blue-500" size={24} />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-3xl font-bold">{stats.totalLikes.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Heart className="text-red-500" size={24} />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-3xl font-bold">{stats.publishedPosts}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-green-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card p-6">
         
          <div className="flex items-center justify-between mb-6 border-b dark:border-dark-700">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 rounded-t-lg font-medium transition ${
                  activeTab === 'posts'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                <FileText size={16} className="inline mr-2" />
                All Posts
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-4 py-2 rounded-t-lg font-medium transition ${
                  activeTab === 'contacts'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                <Mail size={16} className="inline mr-2" />
                Messages
              </button>
              {isSuperAdmin && (
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`px-4 py-2 rounded-t-lg font-medium transition ${
                    activeTab === 'admins'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  <Users size={16} className="inline mr-2" />
                  Manage Admins
                </button>
              )}
            </div>
            {activeTab === 'posts' && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create New Post</span>
              </button>
            )}
          </div>

        
          {activeTab === 'posts' && (
            <div>
             
              {showForm && (
                <div className="mb-8 p-6 border-2 border-primary-200 dark:border-primary-800 rounded-lg bg-primary-50/50 dark:bg-primary-900/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-heading font-bold">
                      {editingPost ? 'Edit Post' : 'Create New Post'}
                    </h3>
                    <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="input"
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Image URL *</label>
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Excerpt (Optional)</label>
                        <textarea
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleInputChange}
                          className="textarea"
                          rows="2"
                          placeholder="Short summary (auto-generated if empty)"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Content *</label>
                        <RichTextEditor
                          value={formData.content}
                          onChange={handleContentChange}
                          placeholder="Write your content here..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Video size={16} className="inline mr-1" />
                          Video URL (YouTube/Vimeo)
                        </label>
                        <input
                          type="url"
                          name="videoUrl"
                          value={formData.videoUrl}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <ExternalLink size={16} className="inline mr-1" />
                          Video External Link
                        </label>
                        <input
                          type="url"
                          name="videoLink"
                          value={formData.videoLink}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="https://... (for 'Watch Full Video' button)"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="finance, stocks, economy"
                        />
                      </div>

                      <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium">Featured Post</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isTrending"
                            checked={formData.isTrending}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium">Trending Post</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button type="submit" className="btn-primary flex items-center space-x-2">
                        <Save size={20} />
                        <span>{editingPost ? 'Update Post' : 'Publish Post'}</span>
                      </button>
                      <button type="button" onClick={resetForm} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

           
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-dark-700">
                        <th className="text-left py-3 px-4 font-semibold">Title</th>
                        <th className="text-left py-3 px-4 font-semibold">Category</th>
                        <th className="text-center py-3 px-4 font-semibold">Views</th>
                        <th className="text-center py-3 px-4 font-semibold">Likes</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post._id} className="border-b dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium line-clamp-1">{post.title}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="badge badge-primary text-xs">{post.category}</span>
                          </td>
                          <td className="py-3 px-4 text-center">{post.views}</td>
                          <td className="py-3 px-4 text-center">{post.likes}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`badge text-xs ${
                              post.status === 'published'
                                ? 'badge-success'
                                : post.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => window.open(`/news/${post._id}`, '_blank')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                                title="View"
                              >
                                <Eye size={18} className="text-blue-500" />
                              </button>
                              <button
                                onClick={() => handleEdit(post)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                                title="Edit"
                              >
                                <Edit2 size={18} className="text-primary-500" />
                              </button>
                              <button
                                onClick={() => handleDelete(post._id)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                                title="Delete"
                              >
                                <Trash2 size={18} className="text-red-500" />
                              </button>
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

          {activeTab === 'contacts' && (
            <ContactsManagement contactsAPI={contactsAPI} />
          )}

          {activeTab === 'admins' && isSuperAdmin && (
            <div>
             
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setShowAdminForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus size={20} />
                  <span>Create Admin Directly</span>
                </button>
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Key size={20} />
                  <span>Generate Invite Code</span>
                </button>
              </div>

              {showAdminForm && (
                <div className="mb-6 p-6 border-2 border-primary-200 dark:border-primary-800 rounded-lg bg-primary-50/50 dark:bg-primary-900/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Create New Admin</h3>
                    <button onClick={() => setShowAdminForm(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          value={adminFormData.name}
                          onChange={(e) => setAdminFormData({...adminFormData, name: e.target.value})}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          value={adminFormData.email}
                          onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Password *</label>
                        <input
                          type="password"
                          value={adminFormData.password}
                          onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                          className="input"
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Role *</label>
                        <select
                          value={adminFormData.role}
                          onChange={(e) => setAdminFormData({...adminFormData, role: e.target.value})}
                          className="input"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn-primary">Create Admin</button>
                  </form>
                </div>
              )}

              {showInviteForm && (
                <div className="mb-6 p-6 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50/50 dark:bg-green-900/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Generate Invite Code</h3>
                    <button onClick={() => setShowInviteForm(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleGenerateInvite} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Role *</label>
                        <select
                          value={inviteFormData.role}
                          onChange={(e) => setInviteFormData({...inviteFormData, role: e.target.value})}
                          className="input"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Expires In (Days)</label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={inviteFormData.expiresInDays}
                          onChange={(e) => setInviteFormData({...inviteFormData, expiresInDays: parseInt(e.target.value)})}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Uses</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={inviteFormData.maxUses}
                          onChange={(e) => setInviteFormData({...inviteFormData, maxUses: parseInt(e.target.value)})}
                          className="input"
                          disabled={inviteFormData.isSingleUse}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inviteFormData.isSingleUse}
                          onChange={(e) => setInviteFormData({...inviteFormData, isSingleUse: e.target.checked, maxUses: e.target.checked ? 1 : inviteFormData.maxUses})}
                          className="w-5 h-5"
                        />
                        <span className="text-sm">Single Use Only</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                      <input
                        type="text"
                        value={inviteFormData.note}
                        onChange={(e) => setInviteFormData({...inviteFormData, note: e.target.value})}
                        className="input"
                        placeholder="For marketing team..."
                      />
                    </div>
                    <button type="submit" className="btn-primary">Generate Code</button>
                  </form>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">All Admins ({admins.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-dark-700">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-center py-3 px-4 font-semibold">Role</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Last Login</th>
                        <th className="text-center py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((adminUser) => (
                        <tr key={adminUser._id} className="border-b dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {adminUser.name[0].toUpperCase()}
                              </div>
                              <span className="font-medium">{adminUser.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{adminUser.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`badge text-xs ${getRoleBadgeColor(adminUser.role)}`}>
                              {adminUser.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`badge text-xs ${adminUser.isActive ? 'badge-success' : 'badge-danger'}`}>
                              {adminUser.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-sm">
                            {adminUser.lastLogin ? new Date(adminUser.lastLogin).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center space-x-2">
                              {adminUser._id !== admin.id && adminUser.role !== 'super-admin' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateAdmin(adminUser._id, { isActive: !adminUser.isActive })}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                                    title={adminUser.isActive ? 'Deactivate' : 'Activate'}
                                  >
                                    <Shield size={18} className={adminUser.isActive ? 'text-green-500' : 'text-gray-400'} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAdmin(adminUser._id)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} className="text-red-500" />
                                  </button>
                                </>
                              )}
                              {adminUser._id === admin.id && (
                                <span className="text-xs text-gray-500">You</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Invite Codes ({inviteCodes.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-dark-700">
                        <th className="text-left py-3 px-4 font-semibold">Code</th>
                        <th className="text-center py-3 px-4 font-semibold">Role</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Uses</th>
                        <th className="text-center py-3 px-4 font-semibold">Expires</th>
                        <th className="text-center py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inviteCodes.map((invite) => (
                        <tr key={invite._id} className="border-b dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                          <td className="py-3 px-4">
                            <code className="text-sm bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded">{invite.code}</code>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`badge text-xs ${getRoleBadgeColor(invite.role)}`}>
                              {invite.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {invite.isRevoked ? (
                              <span className="badge badge-danger text-xs">Revoked</span>
                            ) : invite.isUsed ? (
                              <span className="badge bg-gray-100 text-gray-700 text-xs">Used</span>
                            ) : new Date(invite.expiresAt) < new Date() ? (
                              <span className="badge bg-yellow-100 text-yellow-700 text-xs">Expired</span>
                            ) : (
                              <span className="badge badge-success text-xs">Active</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-sm">
                            {invite.usageCount} / {invite.maxUses}
                          </td>
                          <td className="py-3 px-4 text-center text-sm">
                            {new Date(invite.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleCopyInviteLink(invite.code)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                                title="Copy Signup Link"
                              >
                                {copiedCode === invite.code ? (
                                  <Check size={18} className="text-green-500" />
                                ) : (
                                  <Copy size={18} className="text-blue-500" />
                                )}
                              </button>
                              {!invite.isRevoked && (
                                <button
                                  onClick={() => handleRevokeInvite(invite._id)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                                  title="Revoke"
                                >
                                  <X size={18} className="text-red-500" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;