import React, { useState, useEffect } from 'react';
import {
  Mail, Search, Filter, Trash2, Eye, Check, Archive,
  MessageSquare, AlertCircle, RefreshCw, Download, MoreVertical,
  Clock, User, AtSign, FileText, X, ExternalLink
} from 'lucide-react';

const ContactsManagement = ({ contactsAPI }) => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  
  const [filters, setFilters] = useState({
    status: 'all',
    isSpam: 'false',
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    order: 'desc'
  });

  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
     
      const params = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        order: filters.order,
      };
      
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.isSpam !== 'all') params.isSpam = filters.isSpam;
      if (filters.search) params.search = filters.search;

      const response = await contactsAPI.getAll(params);
      setContacts(response.data.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await contactsAPI.getStats();
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewContact = async (contact) => {
    try {
      
      const response = await contactsAPI.getById(contact._id);
      setSelectedContact(response.data.data.contact);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactsAPI.update(id, { status });
      fetchContacts();
      fetchStats();
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleToggleSpam = async (id) => {
    try {
      await contactsAPI.toggleSpam(id);
      fetchContacts();
      fetchStats();
      alert('Spam status updated');
    } catch (error) {
      console.error('Error toggling spam:', error);
      alert('Failed to update spam status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactsAPI.delete(id);
      fetchContacts();
      fetchStats();
      setShowDetailModal(false);
      alert('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedContacts.length) return;
    if (!confirm(`Delete ${selectedContacts.length} selected contacts?`)) return;

    try {
      await contactsAPI.bulkDelete({ ids: selectedContacts });
      setSelectedContacts([]);
      fetchContacts();
      fetchStats();
      alert('Contacts deleted successfully');
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Failed to delete contacts');
    }
  };

  const toggleSelectContact = (id) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c._id));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      read: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      replied: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      archived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    };
    return badges[status] || badges.new;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Mail className="text-primary-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
                <p className="text-3xl font-bold">{stats.new}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
                <p className="text-3xl font-bold">{stats.replied}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Check className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-3xl font-bold">{stats.thisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
           
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="input pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="input max-w-xs"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>

            {/* Spam Filter */}
            <select
              value={filters.isSpam}
              onChange={(e) => setFilters({ ...filters, isSpam: e.target.value, page: 1 })}
              className="input max-w-xs"
            >
              <option value="false">Not Spam</option>
              <option value="all">All Messages</option>
              <option value="true">Spam Only</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={fetchContacts} className="btn-secondary flex items-center space-x-2">
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            {selectedContacts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="btn-danger flex items-center space-x-2"
              >
                <Trash2 size={18} />
                <span>Delete ({selectedContacts.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No contacts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === contacts.length && contacts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">From</th>
                  <th className="px-4 py-3 text-left font-semibold">Subject</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Date</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className={`border-b dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 ${
                      contact.status === 'new' ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact._id)}
                        onChange={() => toggleSelectContact(contact._id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium flex items-center">
                          {contact.name}
                          {contact.status === 'new' && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium line-clamp-1">{contact.subject}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge text-xs ${getStatusBadge(contact.status)}`}>
                        {contact.status}
                      </span>
                      {contact.isSpam && (
                        <span className="ml-1 badge badge-danger text-xs">Spam</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewContact(contact)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                          title="View Details"
                        >
                          <Eye size={18} className="text-blue-500" />
                        </button>
                        {contact.status !== 'replied' && (
                          <button
                            onClick={() => handleUpdateStatus(contact._id, 'replied')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition"
                            title="Mark as Replied"
                          >
                            <Check size={18} className="text-green-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(contact._id)}
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

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-dark-800 border-b dark:border-dark-700 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Contact Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <User size={20} className="text-gray-400" />
                    <span className="font-semibold text-lg">{selectedContact.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <AtSign size={18} className="text-gray-400" />
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-primary-500 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(selectedContact.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className={`badge ${getStatusBadge(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                  {selectedContact.isSpam && (
                    <span className="block badge badge-danger">Spam (Score: {selectedContact.spamScore})</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Subject
                </label>
                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <MessageSquare size={16} className="mr-2" />
                  Message
                </label>
                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-semibold mb-2">Admin Notes</label>
                <textarea
                  value={selectedContact.adminNotes || ''}
                  onChange={(e) =>
                    setSelectedContact({ ...selectedContact, adminNotes: e.target.value })
                  }
                  className="textarea"
                  rows="3"
                  placeholder="Add internal notes..."
                />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">IP Address:</span>
                  <p className="font-mono">{selectedContact.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Spam Score:</span>
                  <p>{selectedContact.spamScore}</p>
                </div>
                {selectedContact.repliedAt && (
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Replied:</span>
                    <p>{formatDate(selectedContact.repliedAt)}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Mail size={18} />
                  <span>Reply via Email</span>
                </a>
                
                <select
                  value={selectedContact.status}
                  onChange={(e) => handleUpdateStatus(selectedContact._id, e.target.value)}
                  className="input"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => handleToggleSpam(selectedContact._id)}
                  className="btn-secondary"
                >
                  {selectedContact.isSpam ? 'Mark as Not Spam' : 'Mark as Spam'}
                </button>

                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="btn-danger flex items-center space-x-2"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
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