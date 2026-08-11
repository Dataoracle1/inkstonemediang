import React, { useState, useEffect, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Save, X, Image as ImageIcon, Video as VideoIcon, Calendar, Eye, Heart, CheckCircle, Circle } from 'lucide-react';
import { postsAPI, categoriesAPI, desksAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { inputStyle, labelStyle } from '../../components/admin/AdminUI';
import RichTextEditor from '../../components/RichTextEditor';
import ImageUploader from '../../components/ImageUploader';

const FALLBACK_CATEGORIES = ['Breaking News', 'Finance', 'Stock Markets', 'Economy', 'Sports', 'Movies', 'Entertainment', 'Technology', 'Politics', 'Health', 'World', 'Business', 'Science', 'Other'];

const EMPTY = {
  title: '', slug: '', content: '', excerpt: '', image: '', category: 'Breaking News',
  desk: '', videoUrl: '', videoLink: '', tags: '', status: 'published',
  isFeatured: false, isTrending: false, isBreakingNews: false, allowComments: true, showOnHomepage: true,
  metaTitle: '', metaDescription: '', metaKeywords: '',
};

const StoryEditor = ({ postId, onClose, onSaved }) => {
  const { admin } = useAuth();
  const editorRef = useRef(null);
  const isEditing = !!postId;

  const [formData, setFormData] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => { fetchLookups(); if (isEditing) fetchPost(); }, [postId]);

  const fetchLookups = async () => {
    try {
      const [catRes, deskRes] = await Promise.all([
        categoriesAPI.getAll().catch(() => null),
        desksAPI.getAll().catch(() => null),
      ]);
      if (catRes && catRes.data.data.categories.length > 0) {
        setCategories(catRes.data.data.categories.map(c => c.name));
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
      if (deskRes) setDesks(deskRes.data.data.desks);
    } catch {
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await postsAPI.getOne(postId);
      const post = res.data.data.post;
      setFormData({
        title: post.title, slug: post.slug || '', content: post.content, excerpt: post.excerpt || '',
        image: post.image, category: post.category, desk: post.desk?._id || post.desk || '',
        videoUrl: post.videoUrl || '', videoLink: post.videoLink || '', tags: post.tags?.join(', ') || '',
        status: post.status, isFeatured: post.isFeatured || false, isTrending: post.isTrending || false,
        isBreakingNews: post.isBreakingNews || false, allowComments: post.allowComments !== false,
        showOnHomepage: post.showOnHomepage !== false,
        metaTitle: post.metaTitle || '', metaDescription: post.metaDescription || '', metaKeywords: post.metaKeywords || '',
      });
      setSlugTouched(true);
    } catch (error) {
      console.error('Fetch post error:', error);
      toast.error('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => {
      const next = { ...prev, title };
      if (!slugTouched) {
        next.slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
      }
      return next;
    });
  };

  const handleSlugChange = (e) => {
    setSlugTouched(true);
    setFormData(prev => ({ ...prev, slug: e.target.value }));
  };

  const handleContentChange = (value) => setFormData(prev => ({ ...prev, content: value }));
  const handleTagsGenerated = (tags) => setFormData(prev => ({ ...prev, tags: tags.join(', ') }));
  const handleImageChange = (url) => setFormData(prev => ({ ...prev, image: url }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean), desk: formData.desk || null };
    const tid = toast.loading(isEditing ? 'Updating story...' : 'Publishing story...');
    try {
      if (isEditing) await postsAPI.update(postId, payload);
      else await postsAPI.create(payload);
      toast.success(isEditing ? 'Story updated!' : 'Story published!', { id: tid });
      onSaved();
    } catch (err) {
      toast.error('Failed: ' + (err.response?.data?.message || err.message), { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const checklist = useMemo(() => ([
    { label: 'Title', done: formData.title.trim().length > 0 },
    { label: 'Content', done: formData.content.replace(/<[^>]*>/g, '').trim().length > 20 },
    { label: 'Featured Image', done: !!formData.image },
    { label: 'Excerpt', done: formData.excerpt.trim().length > 0 },
    { label: 'Tags', done: formData.tags.trim().length > 0 },
    { label: 'Category & Desk', done: !!formData.category },
    { label: 'Publish Options', done: !!formData.status },
    { label: 'SEO Settings', done: !!(formData.metaTitle || formData.metaDescription) },
  ]), [formData]);
  const completion = Math.round((checklist.filter(c => c.done).length / checklist.length) * 100);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto 14px' }} />
        <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>Loading story...</p>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes ink-spin { to { transform: rotate(360deg); } }
        .story-editor-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px; align-items: start; }
        @media (max-width: 1200px) { .story-editor-grid { grid-template-columns: 1fr 1fr; } .story-editor-grid > :nth-child(3) { grid-column: 1 / -1; } }
        @media (max-width: 800px) { .story-editor-grid { grid-template-columns: 1fr; } .story-editor-grid > * { grid-column: 1 / -1 !important; } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-stamp)', margin: '0 0 4px', fontWeight: 700 }}>STORIES &rsaquo; {isEditing ? 'EDIT STORY' : 'ADD NEW STORY'}</p>
          <h2 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>
            {isEditing ? 'Edit Story' : 'Create and publish engaging stories for your audience.'}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="ink-btn">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="ink-btn ink-btn-stamp" style={{ opacity: saving ? .7 : 1 }}>
            <Save size={15} /> {saving ? 'Saving...' : isEditing ? 'Update Story' : 'Publish Story'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="story-editor-grid">

          {/* ── Column 1: Basic Information + Content ── */}
          <div className="ink-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>Basic Information</h3>

            <div>
              <label style={labelStyle}>Title *</label>
              <input type="text" value={formData.title} onChange={handleTitleChange} required placeholder="Story title..." style={{ ...inputStyle, fontSize: 16, fontWeight: 600 }} />
            </div>

            <div>
              <label style={labelStyle}>Slug *</label>
              <input type="text" value={formData.slug} onChange={handleSlugChange} required placeholder="story-url-slug" style={inputStyle} />
              <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '5px 0 0', overflowWrap: 'anywhere' }}>
                URL: /news/{formData.slug || '...'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Desk</label>
                <select name="desk" value={formData.desk} onChange={handleChange} style={inputStyle}>
                  <option value="">No desk</option>
                  {desks.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Author</label>
              <input type="text" value={admin?.name || ''} disabled style={{ ...inputStyle, opacity: .65 }} />
            </div>

            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="finance, stocks, economy" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Excerpt</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} placeholder="Short summary (auto-generated if empty)" maxLength={300} style={{ ...inputStyle, resize: 'vertical' }} />
              <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '4px 0 0' }}>{formData.excerpt.length}/300</p>
            </div>

            <div>
              <ImageUploader value={formData.image} onChange={handleImageChange} label="Featured Image" required />
            </div>

            <div style={{ borderTop: '1px solid var(--ink-rule)', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h3 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>Content</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => editorRef.current?.openImageModal()} className="ink-btn" style={{ padding: '6px 12px', fontSize: 11 }}>
                    <ImageIcon size={13} /> Insert Image
                  </button>
                  <button type="button" onClick={() => editorRef.current?.openVideoModal()} className="ink-btn" style={{ padding: '6px 12px', fontSize: 11 }}>
                    <VideoIcon size={13} /> Embed Video
                  </button>
                </div>
              </div>
              <RichTextEditor ref={editorRef} value={formData.content} onChange={handleContentChange} placeholder="Write your content..." onTagsGenerated={handleTagsGenerated} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Video URL (YouTube/Vimeo)</label>
                <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Video External Link</label>
                <input type="url" name="videoLink" value={formData.videoLink} onChange={handleChange} placeholder="https://..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* ── Column 2: Publish Options + SEO ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="ink-card" style={{ padding: 22 }}>
              <h3 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 16px' }}>Publish Options</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px', background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)' }}>
                  {[
                    ['isBreakingNews', 'Set as Breaking News'],
                    ['allowComments', 'Allow Comments'],
                    ['isFeatured', 'Featured Story'],
                    ['showOnHomepage', 'Show on Homepage'],
                    ['isTrending', 'Trending Post'],
                  ].map(([key, lbl]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-ink-soft)' }}>
                      {lbl}
                      <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--ink-stamp)', cursor: 'pointer' }} />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="ink-card" style={{ padding: 22 }}>
              <h3 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 16px' }}>SEO &amp; Social</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Meta Title</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} maxLength={70} placeholder={formData.title} style={inputStyle} />
                  <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '4px 0 0' }}>{formData.metaTitle.length}/70</p>
                </div>
                <div>
                  <label style={labelStyle}>Meta Description</label>
                  <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} maxLength={160} placeholder={formData.excerpt} style={{ ...inputStyle, resize: 'vertical' }} />
                  <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '4px 0 0' }}>{formData.metaDescription.length}/160</p>
                </div>
                <div>
                  <label style={labelStyle}>Meta Keywords</label>
                  <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="keyword1, keyword2" style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Column 3: Preview + Checklist ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="ink-card" style={{ padding: 18 }}>
              <h3 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 14px' }}>Preview</h3>
              <div style={{ border: '1px solid var(--ink-rule)' }}>
                {formData.image && <img src={formData.image} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />}
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                    {formData.isBreakingNews && <span className="ink-stamp-badge ink-live"><span className="ink-dot" />Live</span>}
                    <span className="ink-stamp-badge">{formData.category}</span>
                  </div>
                  <h4 className="ink-serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 8px', lineHeight: 1.25 }}>
                    {formData.title || 'Your story title will appear here'}
                  </h4>
                  <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '0 0 8px' }}>
                    By {admin?.name || 'Author'} &middot; {new Date().toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-ink-soft)', margin: 0, lineHeight: 1.5 }}>
                    {formData.excerpt || 'Your excerpt will appear here...'}
                  </p>
                </div>
              </div>
            </div>

            <div className="ink-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>Story Checklist</h3>
                <span className="ink-serif" style={{ fontSize: 18, fontWeight: 700, color: completion === 100 ? 'var(--ink-wire-bright)' : 'var(--ink-stamp)' }}>{completion}%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {checklist.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: item.done ? 'var(--ink-ink)' : 'var(--ink-ink-soft)' }}>
                    {item.done ? <CheckCircle size={14} color="var(--ink-wire-bright)" /> : <Circle size={14} color="var(--ink-rule)" />}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoryEditor;