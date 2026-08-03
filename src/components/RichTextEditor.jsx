import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadAPI } from '../utils/api';

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER FONTS — outside component, runs once at module load
// ─────────────────────────────────────────────────────────────────────────────
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace'];
Quill.register(Font, true);

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER CUSTOM VIDEO BLOT
// ─────────────────────────────────────────────────────────────────────────────
const BlockEmbed = Quill.import('blots/block/embed');
class VideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', 'false');
    node.innerHTML = value;
    Object.assign(node.style, { width: '100%', margin: '1.5em 0', borderRadius: '4px', overflow: 'hidden', position: 'relative' });
    return node;
  }
  static value(node) { return node.innerHTML; }
}
VideoBlot.blotName = 'socialVideo';
VideoBlot.tagName = 'div';
VideoBlot.className = 'ql-social-video';
Quill.register(VideoBlot, true);

// ─────────────────────────────────────────────────────────────────────────────
// EMBED URL PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseEmbedUrl(url) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `<iframe width="100%" height="420" src="https://www.youtube.com/embed/${yt[1]}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:block;"></iframe>`;

  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `<iframe width="100%" height="420" src="https://player.vimeo.com/video/${vi[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="display:block;"></iframe>`;

  const tw = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  if (tw) return `<div style="display:flex;justify-content:center;padding:1em;background:#f7f9fa;"><blockquote class="twitter-tweet" data-dnt="true"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>`;

  const ig = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  if (ig) return `<div style="display:flex;justify-content:center;padding:1em;background:#f7f9fa;overflow:auto;"><blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="max-width:540px;width:100%;min-width:260px;"></blockquote><script async src="//www.instagram.com/embed.js"></script></div>`;

  const tt = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
  if (tt) return `<div style="display:flex;justify-content:center;padding:1em;background:#f7f9fa;"><blockquote class="tiktok-embed" cite="${url}" data-video-id="${tt[1]}" style="max-width:605px;min-width:325px;width:100%;"><section></section></blockquote><script async src="https://www.tiktok.com/embed.js"></script></div>`;

  const fb = url.match(/facebook\.com\/.*\/videos\/(\d+)/);
  if (fb) return `<div style="display:flex;justify-content:center;padding:1em;background:#f7f9fa;"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560" width="560" height="315" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen style="display:block;"></iframe></div>`;

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI TAG GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
async function generateTags(htmlContent) {
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlContent;
  const text = (tmp.textContent || tmp.innerText || '').trim().slice(0, 3000);
  if (!text || text.length < 30) return [];

  const apiKey =
    (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_ANTHROPIC_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.REACT_APP_ANTHROPIC_API_KEY) ||
    null;

  if (!apiKey) {
    console.warn('[RichTextEditor] No API key found. Set VITE_ANTHROPIC_API_KEY or REACT_APP_ANTHROPIC_API_KEY in your .env file. Falling back to local extraction.');
    return extractTagsLocally(text);
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: 'You are a blog tagging assistant. Return ONLY a raw JSON array of exactly 5 short lowercase hyphenated tags relevant to the content. No markdown, no explanation, no backticks, no extra text. Just the JSON array. Example: ["web-development","javascript","tutorial","beginners","coding"]',
        messages: [{ role: 'user', content: `Generate 5 tags for this blog post:\n\n${text}` }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[RichTextEditor] Anthropic API error:', res.status, errText);
      return extractTagsLocally(text);
    }

    const data = await res.json();
    const raw = (data?.content?.[0]?.text || '[]').replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 5);
    return extractTagsLocally(text);
  } catch (err) {
    console.warn('[RichTextEditor] Tag generation error, using local fallback:', err);
    return extractTagsLocally(text);
  }
}

function extractTagsLocally(text) {
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'by','from','up','about','into','through','during','is','are','was',
    'were','be','been','being','have','has','had','do','does','did','will',
    'would','could','should','may','might','shall','can','that','this',
    'these','those','it','its','we','you','he','she','they','their','our',
    'your','my','as','if','then','so','also','just','more','one','all',
    'not','no','out','what','which','when','how','who','where','very',
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopWords.has(w));
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word.replace(/\s+/g, '-'));
  const defaults = ['blog','article','news','media','content'];
  while (sorted.length < 5) sorted.push(defaults[sorted.length]);
  return sorted;
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL MODAL — renders into document.body, never affects editor layout
// ─────────────────────────────────────────────────────────────────────────────
function PortalModal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const modal = (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(20,18,16,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', padding: '2rem', width: 480, maxWidth: '92vw', boxShadow: '0 32px 80px rgba(0,0,0,.35)', position: 'relative' }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="ink-serif" style={{ margin: 0, fontSize: 19, fontWeight: 600, color: 'var(--ink-ink)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--ink-ink-soft)', lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────────────────────────────────────
const iStyle = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--ink-rule)', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', marginBottom: 12, background: 'var(--ink-paper-dim)',
  color: 'var(--ink-ink)', fontFamily: "'Source Sans 3', sans-serif",
};

const btnPrimary = {
  width: '100%', padding: 11, background: 'var(--ink-stamp)', color: '#fff', border: 'none',
  cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
  textTransform: 'uppercase', letterSpacing: '.05em',
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const RichTextEditor = React.forwardRef(({ value, onChange, placeholder = 'Write your content here...', onTagsGenerated }, ref) => {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedRange = useRef(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imgError, setImgError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [imgTab, setImgTab] = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState('');

  const openImageModal = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) savedRange.current = quill.getSelection(true);
    setImgTab('upload'); setImgError(''); setImageUrl('');
    setShowImageModal(true);
  }, []);

  const openVideoModal = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) savedRange.current = quill.getSelection(true);
    setVideoError(''); setVideoUrl('');
    setShowVideoModal(true);
  }, []);

  React.useImperativeHandle(ref, () => ({
    openImageModal,
    openVideoModal,
  }), [openImageModal, openVideoModal]);

  const insertImage = useCallback((src) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = savedRange.current || { index: quill.getLength(), length: 0 };
    quill.focus();
    quill.setSelection(range.index, 0);
    quill.insertEmbed(range.index, 'image', src, 'user');
    quill.setSelection(range.index + 1, 0);
  }, []);

  // ── Real upload (Cloudinary via backend) — replaces the old base64 embed ──
  const handleImageFile = useCallback(async (file) => {
    if (!file) return;
    setImgError('');

    if (!file.type.startsWith('image/')) { setImgError('Please select a valid image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setImgError('Image must be under 10MB.'); return; }

    setUploadingImage(true);
    setUploadProgress(0);
    try {
      const response = await uploadAPI.uploadImage(file, setUploadProgress);
      const url = response.data?.data?.url;
      if (!url) throw new Error('Upload succeeded but no URL was returned');
      setShowImageModal(false);
      setTimeout(() => insertImage(url), 50);
    } catch (err) {
      setImgError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  }, [insertImage]);

  const handleImageUrlInsert = () => {
    if (!imageUrl.trim()) { setImgError('Please enter a URL.'); return; }
    try { new URL(imageUrl); } catch { setImgError('Enter a valid URL.'); return; }
    setShowImageModal(false);
    const url = imageUrl.trim();
    setImageUrl('');
    setImgError('');
    setTimeout(() => insertImage(url), 50);
  };

  const handleVideoInsert = () => {
    setVideoError('');
    const url = videoUrl.trim();
    if (!url) { setVideoError('Please enter a URL.'); return; }
    const html = parseEmbedUrl(url);
    if (!html) { setVideoError('Unsupported platform. Try YouTube, Vimeo, Twitter/X, Instagram, TikTok, or Facebook.'); return; }
    setShowVideoModal(false);
    setVideoUrl('');
    setTimeout(() => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;
      const range = savedRange.current || { index: quill.getLength(), length: 0 };
      quill.focus();
      quill.setSelection(range.index, 0);
      quill.insertEmbed(range.index, 'socialVideo', html, 'user');
      quill.setSelection(range.index + 1, 0);
    }, 50);
  };

  const addTag = (raw) => {
    const t = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (!t || tags.includes(t)) return;
    const next = [...tags, t];
    setTags(next);
    onTagsGenerated?.(next);
  };

  const removeTag = (tag) => {
    const next = tags.filter(t => t !== tag);
    setTags(next);
    onTagsGenerated?.(next);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleAutoGenerateTags = async () => {
    if (!value || value === '<p><br></p>') { setTagsError('Write some content first.'); return; }
    setTagsLoading(true); setTagsError('');
    try {
      const generated = await generateTags(value);
      if (!generated.length) { setTagsError('Could not generate tags. Try again.'); return; }
      const merged = [...new Set([...tags, ...generated])];
      setTags(merged);
      onTagsGenerated?.(merged);
    } catch {
      setTagsError('Tag generation failed. Check your connection.');
    } finally {
      setTagsLoading(false);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: ['sans-serif', 'serif', 'monospace'] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: { image: openImageModal, video: openVideoModal },
    },
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script', 'list', 'bullet', 'indent', 'align',
    'blockquote', 'code-block', 'link', 'image', 'socialVideo',
  ];

  return (
    <>
      {showImageModal && (
        <PortalModal title="Insert Image" onClose={() => !uploadingImage && setShowImageModal(false)}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['upload', 'url'].map(tab => (
              <button key={tab}
                onClick={() => { setImgTab(tab); setImgError(''); }}
                className="ink-mono"
                style={{
                  flex: 1, padding: '8px 0', border: '1px solid var(--ink-rule)', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em',
                  background: imgTab === tab ? 'var(--ink-ink)' : 'transparent',
                  color: imgTab === tab ? 'var(--ink-paper)' : 'var(--ink-ink-soft)',
                }}>
                {tab === 'upload' ? 'Upload File' : 'Image URL'}
              </button>
            ))}
          </div>

          {imgTab === 'upload' ? (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); handleImageFile(e.dataTransfer.files[0]); }}
              onClick={() => !uploadingImage && fileInputRef.current?.click()}
              style={{
                border: `1.5px dashed ${isDragging ? 'var(--ink-stamp)' : 'var(--ink-rule)'}`,
                padding: '2.5rem 1rem', textAlign: 'center', cursor: uploadingImage ? 'default' : 'pointer',
                background: isDragging ? 'var(--ink-stamp-dim)' : 'var(--ink-paper-dim)', marginBottom: 12,
              }}>
              {uploadingImage ? (
                <>
                  <p className="ink-mono" style={{ margin: 0, fontSize: 13, color: 'var(--ink-ink-soft)' }}>Uploading... {uploadProgress}%</p>
                  <div style={{ height: 3, background: 'var(--ink-rule)', marginTop: 10, maxWidth: 200, marginLeft: 'auto', marginRight: 'auto' }}>
                    <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--ink-stamp)', transition: 'width .2s' }} />
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-ink)', fontWeight: 600 }}>
                    Drag &amp; drop or click to upload
                  </p>
                  <p className="ink-mono" style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--ink-ink-soft)' }}>
                    PNG, JPG, GIF, WebP — up to 10MB
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <input
                style={iStyle}
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleImageUrlInsert()}
                autoFocus
              />
              <button style={btnPrimary} onClick={handleImageUrlInsert}>Insert Image</button>
            </>
          )}

          {imgError && (
            <p className="ink-mono" style={{ color: 'var(--ink-stamp)', fontSize: 12, margin: '8px 0 0' }}>{imgError}</p>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => handleImageFile(e.target.files[0])} />
        </PortalModal>
      )}

      {showVideoModal && (
        <PortalModal title="Embed Video or Post" onClose={() => setShowVideoModal(false)}>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--ink-ink-soft)', lineHeight: 1.6 }}>
            Paste a URL from <strong>YouTube</strong>, <strong>Vimeo</strong>, <strong>Twitter/X</strong>,{' '}
            <strong>Instagram</strong>, <strong>TikTok</strong>, or <strong>Facebook</strong>.
          </p>
          <input
            style={iStyle}
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVideoInsert()}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {['YouTube', 'Vimeo', 'X/Twitter', 'Instagram', 'TikTok', 'Facebook'].map(p => (
              <span key={p} className="ink-mono" style={{ padding: '3px 9px', fontSize: 10, fontWeight: 600, border: '1px solid var(--ink-rule)', color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{p}</span>
            ))}
          </div>
          <button style={btnPrimary} onClick={handleVideoInsert}>Embed</button>
          {videoError && (
            <p className="ink-mono" style={{ color: 'var(--ink-stamp)', fontSize: 12, margin: '10px 0 0' }}>{videoError}</p>
          )}
        </PortalModal>
      )}

      <div className="rte-root">
        <div className="rte-editor-box">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
          />
        </div>

        <div className="rte-tags-section">
          <div className="rte-tags-header">
            <span className="rte-tags-label">Tags</span>
            <button className={`rte-autotag-btn${tagsLoading ? ' loading' : ''}`} onClick={handleAutoGenerateTags} disabled={tagsLoading}>
              {tagsLoading ? <><span className="rte-spinner" /> Generating…</> : 'Auto-generate 5 tags'}
            </button>
          </div>

          <div className="rte-tags-input-wrap" onClick={() => document.querySelector('.rte-tag-input')?.focus()}>
            {tags.map(tag => (
              <span key={tag} className="rte-tag">
                #{tag}
                <button className="rte-tag-remove" onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
            <input
              className="rte-tag-input"
              placeholder={tags.length ? 'Add tag…' : 'Type a tag or click Auto-generate…'}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>

          {tagsError && <p className="rte-tags-error">{tagsError}</p>}
          <p className="rte-tags-hint">
            Press <kbd>Enter</kbd> or <kbd>,</kbd> to add • <kbd>Backspace</kbd> to remove last
          </p>
        </div>
      </div>

      <style>{`
        .ql-font-serif      { font-family: 'Fraunces', serif; }
        .ql-font-monospace  { font-family: 'IBM Plex Mono', monospace; }
        .ql-font-sans-serif { font-family: 'Source Sans 3', sans-serif; }

        .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before  { content: 'Sans-serif'; }
        .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before       { content: 'Serif'; font-family: 'Fraunces', serif; }
        .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before   { content: 'Monospace'; font-family: 'IBM Plex Mono', monospace; }

        .rte-root { display: flex; flex-direction: column; font-family: 'Source Sans 3', sans-serif; }

        .rte-editor-box .ql-toolbar.ql-snow {
          background: var(--ink-paper-dim);
          border: 1px solid var(--ink-rule);
          border-bottom: none;
        }
        .rte-editor-box .ql-toolbar .ql-formats { margin-right: 10px; }
        .rte-editor-box .ql-toolbar button:hover,
        .rte-editor-box .ql-toolbar button.ql-active { color: var(--ink-stamp); }
        .rte-editor-box .ql-toolbar button:hover .ql-stroke,
        .rte-editor-box .ql-toolbar button.ql-active .ql-stroke { stroke: var(--ink-stamp); }
        .rte-editor-box .ql-toolbar button:hover .ql-fill,
        .rte-editor-box .ql-toolbar button.ql-active .ql-fill { fill: var(--ink-stamp); }

        .rte-editor-box .ql-container.ql-snow {
          border: 1px solid var(--ink-rule);
          border-top: none;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 16px;
          background: var(--ink-paper);
        }

        .rte-editor-box .ql-editor {
          min-height: 340px;
          padding: 1.5rem;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: var(--ink-ink);
          box-sizing: border-box;
        }
        .rte-editor-box .ql-editor.ql-blank::before {
          color: var(--ink-ink-soft);
          font-style: normal;
          font-family: 'Source Sans 3', sans-serif;
        }

        .rte-editor-box .ql-editor p  { margin-bottom: 1em; }
        .rte-editor-box .ql-editor h1 { font-size: 2rem; font-weight: 600; margin: 1.5em 0 0.5em; font-family: 'Fraunces', serif; }
        .rte-editor-box .ql-editor h2 { font-size: 1.5rem; font-weight: 600; margin: 1.4em 0 0.5em; font-family: 'Fraunces', serif; }
        .rte-editor-box .ql-editor h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25em 0 0.4em; font-family: 'Fraunces', serif; }
        .rte-editor-box .ql-editor h4,
        .rte-editor-box .ql-editor h5,
        .rte-editor-box .ql-editor h6 { font-weight: 600; margin: 1em 0 0.4em; font-family: 'Fraunces', serif; }
        .rte-editor-box .ql-editor ul,
        .rte-editor-box .ql-editor ol { margin-bottom: 1em; padding-left: 1.5em; }
        .rte-editor-box .ql-editor blockquote { border-left: 3px solid var(--ink-stamp); padding: 0.75em 1.25em; margin: 1.25em 0; color: var(--ink-ink-soft); background: var(--ink-paper-dim); font-style: italic; }
        .rte-editor-box .ql-editor pre.ql-syntax { background: var(--ink-ink); color: var(--ink-paper); padding: 1em 1.25em; font-family: 'IBM Plex Mono', monospace; font-size: 14px; overflow-x: auto; margin: 1em 0; }
        .rte-editor-box .ql-editor img { max-width: 100%; margin: 0.5em 0; display: block; border: 1px solid var(--ink-rule); }
        .rte-editor-box .ql-editor .ql-social-video { width: 100%; margin: 1.5em 0; overflow: hidden; }
        .rte-editor-box .ql-editor .ql-social-video iframe { display: block; width: 100%; }

        .rte-tags-section {
          border: 1px solid var(--ink-rule); border-top: none;
          background: var(--ink-paper-dim);
          padding: 14px 16px 12px;
        }
        .rte-tags-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .rte-tags-label { font-size: 11px; font-weight: 600; color: var(--ink-ink-soft); font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; letter-spacing: .06em; }

        .rte-autotag-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border: 1px solid var(--ink-stamp);
          background: transparent; color: var(--ink-stamp); font-size: 11px; font-weight: 600;
          font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; letter-spacing: .04em;
          cursor: pointer; transition: .15s;
        }
        .rte-autotag-btn:hover:not(:disabled) { background: var(--ink-stamp); color: #fff; }
        .rte-autotag-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .rte-spinner {
          width: 11px; height: 11px; border: 2px solid rgba(168,50,31,.3);
          border-top-color: var(--ink-stamp); border-radius: 50%;
          animation: rte-spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes rte-spin { to { transform: rotate(360deg); } }

        .rte-tags-input-wrap {
          display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-height: 44px;
          background: var(--ink-paper); border: 1px solid var(--ink-rule);
          padding: 6px 10px; cursor: text; transition: border-color 0.2s;
        }
        .rte-tags-input-wrap:focus-within { border-color: var(--ink-stamp); }

        .rte-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px 3px 8px; border: 1px solid var(--ink-rule);
          color: var(--ink-wire-bright); font-size: 12px; font-weight: 600;
          font-family: 'IBM Plex Mono', monospace;
        }

        .rte-tag-remove { background: none; border: none; cursor: pointer; color: var(--ink-stamp); font-size: 15px; line-height: 1; padding: 0; margin-left: 2px; opacity: 0.7; }
        .rte-tag-remove:hover { opacity: 1; }

        .rte-tag-input { border: none; outline: none; background: transparent; font-size: 13px; font-family: 'Source Sans 3', sans-serif; color: var(--ink-ink); flex: 1; min-width: 160px; padding: 2px 0; }
        .rte-tag-input::placeholder { color: var(--ink-ink-soft); }

        .rte-tags-error { color: var(--ink-stamp); font-size: 12px; margin: 6px 0 0; }
        .rte-tags-hint  { color: var(--ink-ink-soft); font-size: 11px; margin: 6px 0 0; font-family: 'IBM Plex Mono', monospace; }
        .rte-tags-hint kbd { background: var(--ink-paper); border: 1px solid var(--ink-rule); padding: 1px 5px; font-size: 10px; font-family: 'IBM Plex Mono', monospace; color: var(--ink-ink-soft); }
      `}</style>
    </>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;