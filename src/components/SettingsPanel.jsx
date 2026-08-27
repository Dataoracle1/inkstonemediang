import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    siteName: 'SYDLINES MEDIA',
    tagline: 'Smart News. Real Impact.',
    email: 'hello@sydlines.com',
    timezone: 'UTC+1',
    language: 'English',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <style>{`
        .settings-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .settings-form { background: white; border: 1px solid #e8e4dd; border-radius: 8px; padding: 32px; max-width: 600px; }
        .form-group { margin-bottom: 24px; }
        .form-group label { display: block; font-family: "IBM Plex Mono", monospace; font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #64748B; margin-bottom: 8px; }
        .form-group input { width: 100%; padding: 10px 14px; border: 1px solid #e8e4dd; border-radius: 4px; font-size: 14px; font-family: inherit; box-sizing: border-box; }
        .form-group input:focus { outline: none; border-color: #C4422F; box-shadow: 0 0 0 3px rgba(196,66,47,.1); }
        .save-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: #C4422F; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .save-btn:hover { opacity: 0.9; }
        .alert-box { display: flex; align-items: flex-start; gap: 12px; background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2); border-radius: 4px; padding: 12px; margin-top: 16px; color: #22c55e; }
      `}</style>

      <h1 className="settings-header">Settings</h1>

      <div className="settings-form">
        <div className="form-group">
          <label>Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tagline</label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Contact Email</label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Timezone</label>
          <input
            type="text"
            value={settings.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Language</label>
          <input
            type="text"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
          />
        </div>

        <button onClick={handleSave} className="save-btn">
          <Save size={16} /> Save Settings
        </button>

        {saved && (
          <div className="alert-box">
            <AlertCircle size={16} />
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;