import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setSuccess('Thank you! We received your message.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0f1419' : '#ffffff', color: isDark ? '#fff' : '#000', minHeight: '100vh', padding: '40px 20px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>Get In Touch</h1>
        <p style={{ fontSize: '16px', color: isDark ? '#aaa' : '#666', textAlign: 'center', marginBottom: '40px' }}>
          Have a story tip or inquiry? Send us a message and we'll get back to you.
        </p>

        {error && (
          <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', color: '#c33', padding: '16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#eef', border: '1px solid #ccf', color: '#006', padding: '16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                color: isDark ? '#fff' : '#000',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                color: isDark ? '#fff' : '#000',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Message subject"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                color: isDark ? '#fff' : '#000',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message (10-5000 characters)"
              required
              rows="8"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                color: isDark ? '#fff' : '#000',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 20px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;