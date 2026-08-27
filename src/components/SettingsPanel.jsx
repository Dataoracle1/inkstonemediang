import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

const SettingsPanel = () => {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data.data.settings);
      setFormData(response.data.data.settings);
    } catch (err) {
      setError('Failed to load settings');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await api.put('/settings', formData);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  if (loading) {
    return <div style={{ color: isDark ? '#fff' : '#000' }}>Loading settings...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: isDark ? '#0f1419' : '#ffffff', transition: 'all 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: isDark ? '#fff' : '#000' }}>
        Site Settings
      </h2>

      {error && <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>❌ {error}</div>}
      {success && <div style={{ backgroundColor: '#eef', color: '#006', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>✅ {success}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: isDark ? '#fff' : '#000', marginBottom: '6px' }}>Site Name</label>
          <input type="text" name="siteName" value={formData.siteName || ''} onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', border: isDark ? '1px solid #444' : '1px solid #ddd', borderRadius: '4px', backgroundColor: isDark ? '#1a1f2e' : '#fff', color: isDark ? '#fff' : '#000', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: isDark ? '#fff' : '#000', marginBottom: '6px' }}>Tagline</label>
          <input type="text" name="siteTagline" value={formData.siteTagline || ''} onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', border: isDark ? '1px solid #444' : '1px solid #ddd', borderRadius: '4px', backgroundColor: isDark ? '#1a1f2e' : '#fff', color: isDark ? '#fff' : '#000', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: isDark ? '#fff' : '#000', marginBottom: '6px' }}>From Email</label>
          <input type="email" name="fromEmail" value={formData.fromEmail || ''} onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', border: isDark ? '1px solid #444' : '1px solid #ddd', borderRadius: '4px', backgroundColor: isDark ? '#1a1f2e' : '#fff', color: isDark ? '#fff' : '#000', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPanel;