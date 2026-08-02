import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadAPI } from '../utils/api';

/**
 * Drop-in replacement for a plain "Image URL" text input.
 * Two tabs: Upload (drag-drop or file picker → uploads to Cloudinary via
 * the backend, shows progress, then stores the returned hosted URL) and
 * URL (paste an existing link directly, unchanged behavior from before).
 *
 * Props:
 *  - value: current image URL (string)
 *  - onChange: (url: string) => void
 *  - label: field label text
 *  - required: whether to show the * marker
 */
const ImageUploader = ({ value, onChange, label = 'Featured Image', required = false }) => {
  const [tab, setTab] = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const response = await uploadAPI.uploadImage(file, setProgress);
      const url = response.data?.data?.url;
      if (!url) throw new Error('Upload succeeded but no URL was returned');
      onChange(url);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleUrlSubmit = () => {
    if (!urlDraft.trim()) { setError('Please enter a URL.'); return; }
    try {
      new URL(urlDraft.trim());
    } catch {
      setError('Enter a valid URL.');
      return;
    }
    onChange(urlDraft.trim());
    setUrlDraft('');
    setError('');
  };

  const clearImage = () => onChange('');

  return (
    <div>
      <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
        {label} {required && <span style={{ color: 'var(--ink-stamp)' }}>*</span>}
      </label>

      {value ? (
        // ── Preview state ──
        <div style={{ position: 'relative', border: '1px solid var(--ink-rule)', overflow: 'hidden' }}>
          <img src={value} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
          <button
            type="button" onClick={clearImage}
            style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(28,26,22,.75)', color: '#eeeadf', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Remove image"
          >
            <X size={16} />
          </button>
          <div className="ink-mono" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(28,26,22,.75)', color: '#eeeadf', fontSize: 11, padding: '6px 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value}
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <button type="button" onClick={() => { setTab('upload'); setError(''); }}
              className="ink-mono"
              style={{
                flex: 1, padding: '8px 0', border: '1px solid var(--ink-rule)', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em',
                background: tab === 'upload' ? 'var(--ink-ink)' : 'transparent',
                color: tab === 'upload' ? 'var(--ink-paper)' : 'var(--ink-ink-soft)',
              }}>
              <Upload size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              Upload File
            </button>
            <button type="button" onClick={() => { setTab('url'); setError(''); }}
              className="ink-mono"
              style={{
                flex: 1, padding: '8px 0', border: '1px solid var(--ink-rule)', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em',
                background: tab === 'url' ? 'var(--ink-ink)' : 'transparent',
                color: tab === 'url' ? 'var(--ink-paper)' : 'var(--ink-ink-soft)',
              }}>
              <Link2 size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              Image URL
            </button>
          </div>

          {tab === 'upload' ? (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: `1.5px dashed ${isDragging ? 'var(--ink-stamp)' : 'var(--ink-rule)'}`,
                background: isDragging ? 'var(--ink-stamp-dim)' : 'var(--ink-paper-dim)',
                padding: '32px 20px', textAlign: 'center', cursor: uploading ? 'default' : 'pointer', transition: '.15s',
              }}
            >
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden
                onChange={e => handleFile(e.target.files[0])} />
              {uploading ? (
                <>
                  <Loader2 size={28} className="ink-mono" style={{ color: 'var(--ink-stamp)', margin: '0 auto 10px', animation: 'ink-spin 1s linear infinite' }} />
                  <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
                  <p className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)' }}>Uploading... {progress}%</p>
                  <div style={{ height: 3, background: 'var(--ink-rule)', marginTop: 10, maxWidth: 200, marginLeft: 'auto', marginRight: 'auto' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--ink-stamp)', transition: 'width .2s' }} />
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon size={28} style={{ color: 'var(--ink-ink-soft)', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 4 }}>
                    Drag &amp; drop an image, or click to browse
                  </p>
                  <p className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)' }}>JPG, PNG, WEBP, or GIF — up to 10MB</p>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="url" value={urlDraft} onChange={e => setUrlDraft(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--ink-rule)', fontSize: 14, outline: 'none', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={handleUrlSubmit} className="ink-btn ink-btn-stamp">Use URL</button>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="ink-mono" style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-stamp)' }}>{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;