import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SaveArticle = ({ articleId, articleTitle }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    setIsSaved(saved.includes(articleId));
  }, [articleId]);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    let newSaved;

    if (isSaved) {
      newSaved = saved.filter((id) => id !== articleId);
      showToast('Article removed from saved', 'success');
    } else {
      newSaved = [...saved, articleId];
      showToast('Article saved successfully!', 'success');
    }

    localStorage.setItem('savedArticles', JSON.stringify(newSaved));
    setIsSaved(!isSaved);
  };

  return (
    <button
      onClick={handleSave}
      title={isSaved ? 'Remove from saved' : 'Save article'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'clamp(4px, 1vw, 8px)',
        padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)',
        border: `1px solid ${isSaved ? 'var(--ink-stamp)' : 'var(--ink-rule)'}`,
        borderRadius: 4,
        backgroundColor: isSaved ? 'rgba(200,50,50,0.1)' : 'transparent',
        color: isSaved ? 'var(--ink-stamp)' : 'var(--ink-ink)',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 'clamp(11px, 1.5vw, 12px)',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = isSaved ? 'rgba(200,50,50,0.2)' : 'var(--ink-paper-dim)'}
      onMouseLeave={(e) => e.target.style.backgroundColor = isSaved ? 'rgba(200,50,50,0.1)' : 'transparent'}
    >
      <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
};

export default SaveArticle;