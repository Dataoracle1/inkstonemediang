import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Trash2, Upload as UploadIcon } from 'lucide-react';
import { mediaAPI, uploadAPI } from '../../utils/api';
import { PanelHeader, confirmToast, LoadingBlock, EmptyBlock, inputStyle } from '../../components/admin/AdminUI';

const TYPES = ['all', 'image', 'video', 'document'];

const formatBytes = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaLibrary = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAssets(); }, [type]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await mediaAPI.getAll({ type, limit: 60 });
      setAssets(res.data.data.assets);
    } catch (error) {
      console.error('Fetch media error:', error);
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const tid = toast.loading('Uploading...');
    try {
      await uploadAPI.uploadImage(file);
      toast.success('Uploaded!', { id: tid });
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: tid });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = (asset) => confirmToast('Delete this file?', 'This removes it permanently from storage.', async () => {
    const tid = toast.loading('Deleting...');
    try {
      await mediaAPI.delete(asset._id);
      toast.success('Deleted!', { id: tid });
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete', { id: tid });
    }
  });

  const filtered = assets.filter(a => !search.trim() || a.filename.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PanelHeader
        title="Media Library"
        description="Upload and manage images, videos, and files."
        action={
          <label className="ink-btn ink-btn-stamp" style={{ cursor: uploading ? 'default' : 'pointer', opacity: uploading ? .7 : 1 }}>
            <UploadIcon size={15} /> {uploading ? 'Uploading...' : 'Upload New'}
            <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        }
      />

      <div className="ink-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)} className="ink-mono"
                style={{ padding: '7px 14px', border: '1px solid var(--ink-rule)', cursor: 'pointer', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', background: type === t ? 'var(--ink-ink)' : 'transparent', color: type === t ? 'var(--ink-paper)' : 'var(--ink-ink-soft)' }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
            <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 32 }} />
          </div>
        </div>

        {loading ? <LoadingBlock label="Loading media..." /> : filtered.length === 0 ? <EmptyBlock label="No media files yet. Upload one to get started." /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 14 }}>
            {filtered.map(asset => (
              <div key={asset._id} className="ink-card" style={{ overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'relative', height: 100, background: 'var(--ink-paper-dim)' }}>
                  <img src={asset.url} alt={asset.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button onClick={() => handleDelete(asset)} title="Delete"
                    style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(28,26,22,.75)', color: '#eeeadf', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.filename}</p>
                  <p className="ink-mono" style={{ fontSize: 9.5, color: 'var(--ink-ink-soft)', margin: '3px 0 0' }}>{formatBytes(asset.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;