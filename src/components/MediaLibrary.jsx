import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

const MediaLibrary = () => {
  const { isDark } = useTheme();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await api.get('/media?limit=40');
      setMedia(response.data.data.assets);
    } catch (err) {
      setError('Failed to load media');
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMedia([{ url: response.data.data.url, filename: file.name, _id: Date.now() }, ...media]);
    } catch (err) {
      setError('Upload failed');
    }
    setUploading(false);
  };

  const deleteMedia = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/media/${id}`);
      setMedia(media.filter(m => m._id !== id));
    } catch (err) {
      setError('Failed to delete');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: isDark ? '#0f1419' : '#ffffff', transition: 'all 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: isDark ? '#fff' : '#000' }}>
        Media Library
      </h2>

      {error && (
        <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {/* Upload */}
      <div style={{ marginBottom: '30px' }}>
        <label
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#d32f2f',
            color: 'white',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            opacity: uploading ? 0.7 : 1,
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: isDark ? '#999' : '#666' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {media.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
                borderRadius: '8px',
                overflow: 'hidden',
                border: isDark ? '1px solid #333' : '1px solid #ddd',
                position: 'relative',
                group: 'group',
              }}
            >
              <img
                src={item.url}
                alt={item.filename}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <div style={{ padding: '8px' }}>
                <p style={{ fontSize: '12px', color: isDark ? '#999' : '#666', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.filename}
                </p>
                <button
                  onClick={() => deleteMedia(item._id)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;