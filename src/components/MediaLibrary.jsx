import React, { useState } from 'react';
import { Upload, Trash2, Copy } from 'lucide-react';

const MediaLibrary = () => {
  const [media, setMedia] = useState([
    { _id: '1', url: 'https://via.placeholder.com/200', name: 'image1.jpg', size: '2.5 MB', date: '2024-08-20' },
    { _id: '2', url: 'https://via.placeholder.com/200', name: 'image2.jpg', size: '1.8 MB', date: '2024-08-19' },
  ]);

  const handleDelete = (id) => {
    setMedia(media.filter(m => m._id !== id));
  };

  return (
    <div>
      <style>{`
        .media-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .media-title { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0; }
        .upload-btn { padding: 10px 20px; background: #C4422F; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .upload-btn:hover { opacity: 0.9; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        .media-card { background: white; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden; }
        .media-img { width: 100%; height: 150px; background: #F1F3F5; display: flex; align-items: center; justify-content: center; }
        .media-img img { width: 100%; height: 100%; object-fit: cover; }
        .media-info { padding: 12px; }
        .media-name { font-weight: 600; color: #071A33; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .media-meta { font-size: 10px; color: #64748B; margin-top: 4px; }
        .media-actions { display: flex; gap: 6px; margin-top: 8px; }
        .media-btn { flex: 1; padding: 6px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 11px; color: #071A33; }
        .media-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <div className="media-header">
        <h1 className="media-title">Media Library</h1>
        <button className="upload-btn">
          <Upload size={16} /> Upload
        </button>
      </div>

      <div className="media-grid">
        {media.map((item) => (
          <div key={item._id} className="media-card">
            <div className="media-img">
              <img src={item.url} alt={item.name} />
            </div>
            <div className="media-info">
              <div className="media-name" title={item.name}>{item.name}</div>
              <div className="media-meta">{item.size} • {item.date}</div>
              <div className="media-actions">
                <button className="media-btn" title="Copy URL">
                  <Copy size={12} />
                </button>
                <button className="media-btn" onClick={() => handleDelete(item._id)} title="Delete">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLibrary;