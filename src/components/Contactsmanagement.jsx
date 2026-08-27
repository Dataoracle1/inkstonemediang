import React, { useState, useEffect } from 'react';
import { Trash2, Archive, Mail } from 'lucide-react';
import { contactsAPI } from '../utils/contactAPI';

const Contactsmanagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactsAPI.getAll?.() || { data: { data: [] } };
      setContacts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await contactsAPI.delete?.(id);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div>
      <style>{`
        .contacts-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .contacts-table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden; }
        .contacts-table th { background: #F1F3F5; padding: 14px; text-align: left; font-weight: 600; font-size: 12px; font-family: "IBM Plex Mono", monospace; color: #64748B; }
        .contacts-table td { padding: 14px; border-bottom: 1px solid #e8e4dd; }
        .contact-name { font-weight: 600; color: #071A33; }
        .contact-email { color: #C4422F; text-decoration: none; }
        .contact-subject { color: #17202A; font-size: 13px; }
        .contact-date { font-size: 11px; color: #64748B; font-family: "IBM Plex Mono", monospace; }
        .contact-actions { display: flex; gap: 8px; }
        .contact-btn { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .contact-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <h1 className="contacts-header">Contact Messages</h1>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading...</div>
      ) : contacts.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>No messages</div>
      ) : (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td className="contact-name">{contact.name}</td>
                <td><a href={`mailto:${contact.email}`} className="contact-email">{contact.email}</a></td>
                <td className="contact-subject">{contact.subject}</td>
                <td className="contact-date">{new Date(contact.timestamp || contact.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="contact-actions">
                    <button className="contact-btn" title="Reply"><Mail size={14} /></button>
                    <button className="contact-btn" title="Archive"><Archive size={14} /></button>
                    <button className="contact-btn" onClick={() => handleDelete(contact._id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Contactsmanagement;