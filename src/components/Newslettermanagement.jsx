import React, { useState, useEffect } from 'react';
import { Send, Users, Mail, TrendingUp, CheckCircle, XCircle, Search, Plus } from 'lucide-react';
import { newsletterAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const NewsletterManagement = () => {
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showToast } = useToast();
  const { admin } = useAuth();

  
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [availablePosts, setAvailablePosts] = useState([]);
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    preheader: '',
    targetFrequency: 'all'
  });

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers();
    } else if (activeTab === 'campaigns') {
      fetchCampaigns();
    }
  }, [activeTab]);

  useEffect(() => {
    if (showCreateForm) {
      fetchAvailablePosts();
    }
  }, [showCreateForm]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getSubscribers();
      setSubscribers(response.data.data.subscribers);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      showToast('Failed to fetch subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getCampaigns();
      setCampaigns(response.data.data.newsletters);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showToast('Failed to fetch campaigns', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=20&status=published');
      const data = await response.json();
      setAvailablePosts(data.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();

    if (selectedPosts.length === 0) {
      showToast('Please select at least one post', 'error');
      return;
    }

    try {
      const response = await newsletterAPI.sendNewsletter({
        subject: newsletterForm.subject,
        preheader: newsletterForm.preheader,
        postIds: selectedPosts,
        targetAudience: {
          frequency: newsletterForm.targetFrequency
        }
      });

      showToast(response.data.message || 'Newsletter sent successfully! 🎉', 'success');
      setShowCreateForm(false);
      setNewsletterForm({ subject: '', preheader: '', targetFrequency: 'all' });
      setSelectedPosts([]);
      setActiveTab('campaigns');
    } catch (error) {
      console.error('Error sending newsletter:', error);
      showToast(error.response?.data?.message || 'Failed to send newsletter', 'error');
    }
  };

  const togglePostSelection = (postId) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
    
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Mail className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribed</p>
                <p className="text-3xl font-bold">{stats.unsubscribed}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

   
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'subscribers'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Subscribers
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'campaigns'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Campaigns
          </button>
        </div>

        {activeTab === 'campaigns' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Newsletter</span>
          </button>
        )}
      </div>

     
      {showCreateForm && activeTab === 'campaigns' && (
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-heading font-bold mb-4">Create Newsletter</h3>
          <form onSubmit={handleSendNewsletter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject Line *</label>
              <input
                type="text"
                value={newsletterForm.subject}
                onChange={(e) => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                className="input"
                placeholder="Your weekly digest from INKSTONE MEDIA"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preheader Text (Preview)</label>
              <input
                type="text"
                value={newsletterForm.preheader}
                onChange={(e) => setNewsletterForm({ ...newsletterForm, preheader: e.target.value })}
                className="input"
                placeholder="Breaking news, sports, and entertainment updates..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <select
                value={newsletterForm.targetFrequency}
                onChange={(e) => setNewsletterForm({ ...newsletterForm, targetFrequency: e.target.value })}
                className="input"
              >
                <option value="all">All Subscribers</option>
                <option value="daily">Daily Digest Subscribers</option>
                <option value="weekly">Weekly Digest Subscribers</option>
                <option value="monthly">Monthly Digest Subscribers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Posts ({selectedPosts.length} selected)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-dark-700 rounded-lg p-3">
                {availablePosts.map(post => (
                  <div
                    key={post._id}
                    onClick={() => togglePostSelection(post._id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                      selectedPosts.includes(post._id)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-dark-700 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{post.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{post.category}</p>
                      </div>
                      {selectedPosts.includes(post._id) && (
                        <CheckCircle className="text-primary-500 flex-shrink-0" size={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <Send size={18} />
                <span>Send Newsletter</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

     
      {activeTab === 'subscribers' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-bold">Subscribers List</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-dark-700">
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Subscribed</th>
                    <th className="text-center py-3 px-4 font-semibold">Emails Sent</th>
                    <th className="text-center py-3 px-4 font-semibold">Open Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map(sub => (
                    <tr key={sub._id} className="border-b dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                      <td className="py-3 px-4">{sub.email}</td>
                      <td className="py-3 px-4">{sub.name || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`badge text-xs ${
                          sub.status === 'active'
                            ? 'badge-success'
                            : sub.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">{sub.emailsSent}</td>
                      <td className="py-3 px-4 text-center">{sub.openRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

     
      {activeTab === 'campaigns' && !showCreateForm && (
        <div className="card p-6">
          <h3 className="text-xl font-heading font-bold mb-6">Newsletter Campaigns</h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No newsletters sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div key={campaign._id} className="border border-gray-200 dark:border-dark-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{campaign.subject}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Sent {new Date(campaign.sentAt || campaign.createdAt).toLocaleDateString()} • 
                        {campaign.stats.totalSent} recipients
                      </p>
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        <span>📧 {campaign.stats.delivered} delivered</span>
                        <span>📖 {campaign.stats.opened} opened ({campaign.openRate}%)</span>
                        <span>🔗 {campaign.stats.clicked} clicked ({campaign.clickRate}%)</span>
                      </div>
                    </div>
                    <span className={`badge ${
                      campaign.status === 'sent'
                        ? 'badge-success'
                        : campaign.status === 'sending'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;