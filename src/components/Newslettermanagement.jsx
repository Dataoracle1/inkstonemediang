import React, { useState, useEffect } from 'react';
import { Send, Users, Mail, CheckCircle, XCircle, Search, Plus } from 'lucide-react';
import { newsletterAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--ink-rule)', borderRadius: 2,
  fontSize: 13, outline: 'none', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)',
  fontFamily: "'Source Sans 3', sans-serif", boxSizing: 'border-box',
};
const labelStyle = { display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '.06em' };

const Badge = ({ children, tone = 'neutral' }) => {
  const tones = { neutral: 'var(--ink-ink-soft)', positive: 'var(--ink-wire-bright)', warn: '#b45309', danger: 'var(--ink-stamp)' };
  const color = tones[tone] || tones.neutral;
  return (
    <span className="ink-mono" style={{ padding: '3px 9px', border: `1px solid ${color}`, color, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
};

const NewsletterManagement = () => {
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showToast } = useToast();

  const [selectedPosts, setSelectedPosts] = useState([]);
  const [availablePosts, setAvailablePosts] = useState([]);
  const [newsletterForm, setNewsletterForm] = useState({ subject: '', preheader: '', targetFrequency: 'all' });

  useEffect(() => {
    if (activeTab === 'subscribers') fetchSubscribers();
    else if (activeTab === 'campaigns') fetchCampaigns();
  }, [activeTab]);

  useEffect(() => { if (showCreateForm) fetchAvailablePosts(); }, [showCreateForm]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getSubscribers();
      setSubscribers(response.data.data.subscribers);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      showToast('Failed to fetch subscribers', 'error');
    } finally { setLoading(false); }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getCampaigns();
      setCampaigns(response.data.data.newsletters);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showToast('Failed to fetch campaigns', 'error');
    } finally { setLoading(false); }
  };

  const fetchAvailablePosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=20&status=published');
      const data = await response.json();
      setAvailablePosts(data.data.posts);
    } catch (error) { console.error('Error fetching posts:', error); }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (selectedPosts.length === 0) { showToast('Please select at least one post', 'error'); return; }
    try {
      const response = await newsletterAPI.sendNewsletter({
        subject: newsletterForm.subject,
        preheader: newsletterForm.preheader,
        postIds: selectedPosts,
        targetAudience: { frequency: newsletterForm.targetFrequency },
      });
      showToast(response.data.message || 'Newsletter sent successfully!', 'success');
      setShowCreateForm(false);
      setNewsletterForm({ subject: '', preheader: '', targetFrequency: 'all' });
      setSelectedPosts([]);
      setActiveTab('campaigns');
    } catch (error) {
      console.error('Error sending newsletter:', error);
      showToast(error.response?.data?.message || 'Failed to send newsletter', 'error');
    }
  };

  const togglePostSelection = (postId) => setSelectedPosts(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) || sub.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TabButton = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)} className="ink-mono"
      style={{
        padding: '9px 16px', border: '1px solid var(--ink-rule)', cursor: 'pointer', fontSize: 11,
        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em',
        background: activeTab === id ? 'var(--ink-ink)' : 'transparent',
        color: activeTab === id ? 'var(--ink-paper)' : 'var(--ink-ink-soft)',
      }}>
      {label}
    </button>
  );

  return (
    <div>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Subscribers', value: stats.total, icon: Users },
            { label: 'Active', value: stats.active, icon: CheckCircle },
            { label: 'Pending', value: stats.pending, icon: Mail },
            { label: 'Unsubscribed', value: stats.unsubscribed, icon: XCircle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="ink-card" style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</p>
                <p className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>{value}</p>
              </div>
              <Icon size={20} color="var(--ink-stamp)" />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <TabButton id="subscribers" label="Subscribers" />
          <TabButton id="campaigns" label="Campaigns" />
        </div>
        {activeTab === 'campaigns' && (
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="ink-btn ink-btn-stamp">
            <Plus size={15} /> Create Newsletter
          </button>
        )}
      </div>

      {showCreateForm && activeTab === 'campaigns' && (
        <div className="ink-card" style={{ padding: 22, marginBottom: 20 }}>
          <h3 className="ink-serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 18, color: 'var(--ink-ink)' }}>Create Newsletter</h3>
          <form onSubmit={handleSendNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Subject Line *</label>
              <input type="text" value={newsletterForm.subject} onChange={e => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                style={inputStyle} placeholder="Your weekly digest from SYDLINES MEDIA" required />
            </div>
            <div>
              <label style={labelStyle}>Preheader Text (Preview)</label>
              <input type="text" value={newsletterForm.preheader} onChange={e => setNewsletterForm({ ...newsletterForm, preheader: e.target.value })}
                style={inputStyle} placeholder="Breaking news, sports, and entertainment updates..." />
            </div>
            <div>
              <label style={labelStyle}>Target Audience</label>
              <select value={newsletterForm.targetFrequency} onChange={e => setNewsletterForm({ ...newsletterForm, targetFrequency: e.target.value })} style={inputStyle}>
                <option value="all">All Subscribers</option>
                <option value="daily">Daily Digest Subscribers</option>
                <option value="weekly">Weekly Digest Subscribers</option>
                <option value="monthly">Monthly Digest Subscribers</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Select Posts ({selectedPosts.length} selected)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, maxHeight: 340, overflowY: 'auto', border: '1px solid var(--ink-rule)', padding: 10 }}>
                {availablePosts.map(post => {
                  const selected = selectedPosts.includes(post._id);
                  return (
                    <div key={post._id} onClick={() => togglePostSelection(post._id)}
                      style={{ padding: 10, border: `1.5px solid ${selected ? 'var(--ink-stamp)' : 'var(--ink-rule)'}`, background: selected ? 'var(--ink-stamp-dim)' : 'transparent', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <img src={post.image} alt={post.title} style={{ width: 56, height: 56, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--ink-rule)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.title}</p>
                        <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', marginTop: 4 }}>{post.category}</p>
                      </div>
                      {selected && <CheckCircle size={18} color="var(--ink-stamp)" style={{ flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="ink-btn ink-btn-stamp">
                <Send size={15} /> Send Newsletter
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="ink-btn">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="ink-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h3 className="ink-serif" style={{ fontSize: 19, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>Subscribers List</h3>
            <div style={{ position: 'relative', width: 240 }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
              <input type="text" placeholder="Search subscribers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: 34 }} />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto' }} />
              <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                    {['Email', 'Name', 'Status', 'Subscribed', 'Emails Sent', 'Open Rate'].map((h, i) => (
                      <th key={h} className="ink-mono" style={{ textAlign: i < 2 ? 'left' : 'center', padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map(sub => (
                    <tr key={sub._id} style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--ink-ink)' }}>{sub.email}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{sub.name || '-'}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <Badge tone={sub.status === 'active' ? 'positive' : sub.status === 'pending' ? 'warn' : 'danger'}>{sub.status}</Badge>
                      </td>
                      <td className="ink-mono" style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, color: 'var(--ink-ink-soft)' }}>{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{sub.emailsSent}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{sub.openRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'campaigns' && !showCreateForm && (
        <div className="ink-card" style={{ padding: 22 }}>
          <h3 className="ink-serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 20, color: 'var(--ink-ink)' }}>Newsletter Campaigns</h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto' }} />
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 24px' }}>
              <Mail size={40} style={{ color: 'var(--ink-ink-soft)', margin: '0 auto 14px' }} />
              <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>No newsletters sent yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {campaigns.map(campaign => (
                <div key={campaign._id} style={{ border: '1px solid var(--ink-rule)', padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-ink)', margin: 0 }}>{campaign.subject}</h4>
                      <p className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)', marginTop: 6 }}>
                        Sent {new Date(campaign.sentAt || campaign.createdAt).toLocaleDateString()} &middot; {campaign.stats.totalSent} recipients
                      </p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--ink-ink-soft)', flexWrap: 'wrap' }}>
                        <span>{campaign.stats.delivered} delivered</span>
                        <span>{campaign.stats.opened} opened ({campaign.openRate}%)</span>
                        <span>{campaign.stats.clicked} clicked ({campaign.clickRate}%)</span>
                      </div>
                    </div>
                    <Badge tone={campaign.status === 'sent' ? 'positive' : campaign.status === 'sending' ? 'warn' : 'neutral'}>{campaign.status}</Badge>
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