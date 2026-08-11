import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { settingsAPI } from '../../utils/api';
import { PanelHeader, LoadingBlock, inputStyle, labelStyle } from '../../components/admin/AdminUI';

const TABS = ['General', 'SEO', 'Social', 'Email', 'Security', 'Integrations'];

const Field = ({ label, ...props }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input style={inputStyle} {...props} />
  </div>
);

const SettingsPanel = () => {
  const [tab, setTab] = useState('General');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsAPI.get();
      setSettings(res.data.data.settings);
    } catch (error) {
      console.error('Fetch settings error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const tid = toast.loading('Saving settings...');
    try {
      await settingsAPI.update(settings);
      toast.success('Settings saved!', { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save', { id: tid });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <LoadingBlock label="Loading settings..." />;

  return (
    <div>
      <PanelHeader
        title="Settings"
        description="Configure general settings and preferences."
        action={<button onClick={handleSave} disabled={saving} className="ink-btn ink-btn-stamp" style={{ opacity: saving ? .7 : 1 }}><Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}</button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20, alignItems: 'start' }}>
        <style>{`@media (max-width: 700px) { .settings-grid { grid-template-columns: 1fr !important; } }`}</style>

        <div className="ink-card settings-grid" style={{ padding: 8 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: tab === t ? 'var(--ink-stamp-dim)' : 'transparent', color: tab === t ? 'var(--ink-stamp)' : 'var(--ink-ink-soft)' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="ink-card" style={{ padding: 24 }}>
          {tab === 'General' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>General Settings</h3>
              <Field label="Site Name" value={settings.siteName} onChange={handleChange('siteName')} />
              <Field label="Site Tagline" value={settings.siteTagline} onChange={handleChange('siteTagline')} />
              <div>
                <label style={labelStyle}>Site Description</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={settings.siteDescription} onChange={handleChange('siteDescription')} />
              </div>
            </div>
          )}

          {tab === 'SEO' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>SEO Settings</h3>
              <Field label="Meta Title" value={settings.metaTitle} onChange={handleChange('metaTitle')} maxLength={70} />
              <div>
                <label style={labelStyle}>Meta Description</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} maxLength={160} value={settings.metaDescription} onChange={handleChange('metaDescription')} />
              </div>
              <Field label="Meta Keywords" value={settings.metaKeywords} onChange={handleChange('metaKeywords')} placeholder="news, breaking news, sydlines" />
            </div>
          )}

          {tab === 'Social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Social Media</h3>
              <Field label="Facebook URL" value={settings.facebookUrl} onChange={handleChange('facebookUrl')} placeholder="https://facebook.com/..." />
              <Field label="Twitter / X URL" value={settings.twitterUrl} onChange={handleChange('twitterUrl')} placeholder="https://x.com/..." />
              <Field label="Instagram URL" value={settings.instagramUrl} onChange={handleChange('instagramUrl')} placeholder="https://instagram.com/..." />
              <Field label="YouTube URL" value={settings.youtubeUrl} onChange={handleChange('youtubeUrl')} placeholder="https://youtube.com/..." />
            </div>
          )}

          {tab === 'Email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Email Settings</h3>
              <Field label="From Name" value={settings.fromName} onChange={handleChange('fromName')} placeholder="Sydlines Media" />
              <Field label="From Email" type="email" value={settings.fromEmail} onChange={handleChange('fromEmail')} placeholder="news@sydlines.com" />
            </div>
          )}

          {tab === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Security</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-ink-soft)' }}>
                <input type="checkbox" checked={settings.requireInviteForSignup} onChange={handleChange('requireInviteForSignup')} style={{ width: 16, height: 16, accentColor: 'var(--ink-stamp)' }} />
                Require an invite code for new admin signups
              </label>
            </div>
          )}

          {tab === 'Integrations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Integrations</h3>
              <Field label="Google Analytics ID" value={settings.googleAnalyticsId} onChange={handleChange('googleAnalyticsId')} placeholder="G-XXXXXXXXXX" />
              <Field label="AdSense Client ID" value={settings.adsenseClientId} onChange={handleChange('adsenseClientId')} placeholder="ca-pub-..." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;