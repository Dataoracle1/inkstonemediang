import React, { useState, useEffect } from 'react';
import {
  Mail, Search, Trash2, Eye, Check, MessageSquare, AlertCircle,
  RefreshCw, Clock, User, AtSign, FileText, X,
} from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--ink-rule)', borderRadius: 2,
  fontSize: 13, outline: 'none', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)',
  fontFamily: "'Source Sans 3', sans-serif", boxSizing: 'border-box',
};

const Badge = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: 'var(--ink-ink-soft)', new: 'var(--ink-stamp)', replied: 'var(--ink-wire-bright)',
    archived: '#b45309', danger: 'var(--ink-stamp)',
  };
  const color = tones[tone] || tones.neutral;
  return (
    <span className="ink-mono" style={{ padding: '3px 9px', border: `1px solid ${color}`, color, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
};

const statusTone = (status) => status === 'new' ? 'new' : status === 'replied' ? 'replied' : status === 'archived' ? 'archived' : 'neutral';

const ContactsManagement = ({ contactsAPI }) => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [filters, setFilters] = useState({
    status: 'all', isSpam: 'false', search: '', page: 1, limit: 20, sortBy: 'createdAt', order: 'desc',
  });
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => { fetchContacts(); fetchStats(); }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = { page: filters.page, limit: filters.limit, sortBy: filters.sortBy, order: filters.order };
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.isSpam !== 'all') params.isSpam = filters.isSpam;
      if (filters.search) params.search = filters.search;
      const response = await contactsAPI.getAll(params);
      setContacts(response.data.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try { const response = await contactsAPI.getStats(); setStats(response.data.data.stats); }
    catch (error) { console.error('Error fetching stats:', error); }
  };

  const handleViewContact = async (contact) => {
    try {
      const response = await contactsAPI.getById(contact._id);
      setSelectedContact(response.data.data.contact);
      setShowDetailModal(true);
    } catch (error) { console.error('Error fetching contact details:', error); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactsAPI.update(id, { status });
      fetchContacts(); fetchStats();
      if (selectedContact?._id === id) setSelectedContact({ ...selectedContact, status });
    } catch (error) { console.error('Error updating status:', error); }
  };

  const handleToggleSpam = async (id) => {
    try { await contactsAPI.toggleSpam(id); fetchContacts(); fetchStats(); }
    catch (error) { console.error('Error toggling spam:', error); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try { await contactsAPI.delete(id); fetchContacts(); fetchStats(); setShowDetailModal(false); }
    catch (error) { console.error('Error deleting contact:', error); }
  };

  const handleBulkDelete = async () => {
    if (!selectedContacts.length) return;
    if (!confirm(`Delete ${selectedContacts.length} selected contacts?`)) return;
    try { await contactsAPI.bulkDelete({ ids: selectedContacts }); setSelectedContacts([]); fetchContacts(); fetchStats(); }
    catch (error) { console.error('Error bulk deleting:', error); }
  };

  const toggleSelectContact = (id) => setSelectedContacts(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedContacts(selectedContacts.length === contacts.length ? [] : contacts.map(c => c._id));

  const formatDate = (date) => new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Messages', value: stats.total, icon: Mail },
            { label: 'New', value: stats.new, icon: AlertCircle },
            { label: 'Replied', value: stats.replied, icon: Check },
            { label: 'This Week', value: stats.thisWeek, icon: Clock },
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

      {/* Filters */}
      <div className="ink-card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1 }}>
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
              <input type="text" placeholder="Search contacts..." value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
                style={{ ...inputStyle, paddingLeft: 34 }} />
            </div>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })} style={{ ...inputStyle, width: 'auto' }}>
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <select value={filters.isSpam} onChange={e => setFilters({ ...filters, isSpam: e.target.value, page: 1 })} style={{ ...inputStyle, width: 'auto' }}>
              <option value="false">Not Spam</option>
              <option value="all">All Messages</option>
              <option value="true">Spam Only</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={fetchContacts} className="ink-btn">
              <RefreshCw size={14} /> Refresh
            </button>
            {selectedContacts.length > 0 && (
              <button onClick={handleBulkDelete} className="ink-btn" style={{ background: 'var(--ink-stamp)', color: '#fff' }}>
                <Trash2 size={14} /> Delete ({selectedContacts.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ink-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : contacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <MessageSquare size={40} style={{ color: 'var(--ink-ink-soft)', margin: '0 auto 14px' }} />
            <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>No contacts found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--ink-paper-dim)' }}>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>
                    <input type="checkbox" checked={selectedContacts.length === contacts.length && contacts.length > 0} onChange={toggleSelectAll} style={{ accentColor: 'var(--ink-stamp)' }} />
                  </th>
                  {['From', 'Subject', 'Status', 'Date', 'Actions'].map((h, i) => (
                    <th key={h} className="ink-mono" style={{ padding: '10px 14px', textAlign: i >= 2 && i < 4 ? 'center' : i === 4 ? 'center' : 'left', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact._id} style={{ borderTop: '1px solid var(--ink-rule)', background: contact.status === 'new' ? 'var(--ink-stamp-dim)' : 'transparent' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <input type="checkbox" checked={selectedContacts.includes(contact._id)} onChange={() => toggleSelectContact(contact._id)} style={{ accentColor: 'var(--ink-stamp)' }} />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-ink)', margin: 0, display: 'flex', alignItems: 'center' }}>
                        {contact.name}
                        {contact.status === 'new' && <span style={{ marginLeft: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-stamp)' }} />}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--ink-ink-soft)', margin: '2px 0 0' }}>{contact.email}</p>
                    </td>
                    <td style={{ padding: '12px 14px', maxWidth: 260 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.subject}</p>
                      <p style={{ fontSize: 12, color: 'var(--ink-ink-soft)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.message}</p>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <Badge tone={statusTone(contact.status)}>{contact.status}</Badge>
                      {contact.isSpam && <span style={{ marginLeft: 6 }}><Badge tone="danger">Spam</Badge></span>}
                    </td>
                    <td className="ink-mono" style={{ padding: '12px 14px', textAlign: 'center', fontSize: 11, color: 'var(--ink-ink-soft)' }}>{formatDate(contact.createdAt)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <button onClick={() => handleViewContact(contact)} title="View Details" style={{ width: 28, height: 28, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}>
                          <Eye size={14} />
                        </button>
                        {contact.status !== 'replied' && (
                          <button onClick={() => handleUpdateStatus(contact._id, 'replied')} title="Mark as Replied" style={{ width: 28, height: 28, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-wire-bright)' }}>
                            <Check size={14} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(contact._id)} title="Delete" style={{ width: 28, height: 28, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-stamp)' }}>
                          <Trash2 size={14} />
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

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,16,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
          <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ position: 'sticky', top: 0, background: 'var(--ink-paper)', borderBottom: '1px solid var(--ink-rule)', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Contact Details</h3>
              <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <User size={16} color="var(--ink-ink-soft)" />
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-ink)' }}>{selectedContact.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <AtSign size={15} color="var(--ink-ink-soft)" />
                    <a href={`mailto:${selectedContact.email}`} style={{ color: 'var(--ink-stamp)', textDecoration: 'none', fontSize: 13 }}>{selectedContact.email}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Clock size={15} color="var(--ink-ink-soft)" />
                    <span className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)' }}>{formatDate(selectedContact.createdAt)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                  <Badge tone={statusTone(selectedContact.status)}>{selectedContact.status}</Badge>
                  {selectedContact.isSpam && <Badge tone="danger">Spam (Score: {selectedContact.spamScore})</Badge>}
                </div>
              </div>

              <div>
                <label className="ink-mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, marginBottom: 8, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  <FileText size={13} /> Subject
                </label>
                <div style={{ padding: 14, background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)' }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-ink)', margin: 0 }}>{selectedContact.subject}</p>
                </div>
              </div>

              <div>
                <label className="ink-mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, marginBottom: 8, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  <MessageSquare size={13} /> Message
                </label>
                <div style={{ padding: 14, background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)' }}>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: 'var(--ink-ink-soft)', margin: 0, lineHeight: 1.6 }}>{selectedContact.message}</p>
                </div>
              </div>

              <div>
                <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Admin Notes</label>
                <textarea value={selectedContact.adminNotes || ''} onChange={e => setSelectedContact({ ...selectedContact, adminNotes: e.target.value })}
                  rows={3} placeholder="Add internal notes..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 14, background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)', fontSize: 13 }}>
                <div>
                  <span className="ink-mono" style={{ color: 'var(--ink-ink-soft)', fontSize: 10, textTransform: 'uppercase' }}>IP Address:</span>
                  <p className="ink-mono" style={{ margin: '4px 0 0', color: 'var(--ink-ink)' }}>{selectedContact.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <span className="ink-mono" style={{ color: 'var(--ink-ink-soft)', fontSize: 10, textTransform: 'uppercase' }}>Spam Score:</span>
                  <p style={{ margin: '4px 0 0', color: 'var(--ink-ink)' }}>{selectedContact.spamScore}</p>
                </div>
                {selectedContact.repliedAt && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span className="ink-mono" style={{ color: 'var(--ink-ink-soft)', fontSize: 10, textTransform: 'uppercase' }}>Replied:</span>
                    <p style={{ margin: '4px 0 0', color: 'var(--ink-ink)' }}>{formatDate(selectedContact.repliedAt)}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <a href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`} className="ink-btn ink-btn-stamp">
                  <Mail size={15} /> Reply via Email
                </a>
                <select value={selectedContact.status} onChange={e => handleUpdateStatus(selectedContact._id, e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <button onClick={() => handleToggleSpam(selectedContact._id)} className="ink-btn">
                  {selectedContact.isSpam ? 'Mark as Not Spam' : 'Mark as Spam'}
                </button>
                <button onClick={() => handleDelete(selectedContact._id)} className="ink-btn" style={{ background: 'var(--ink-stamp)', color: '#fff' }}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;