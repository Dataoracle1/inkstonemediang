

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Reply, Trash2, Send, Quote, Share2, Bookmark, MoreHorizontal, Flag, Shield, MessageCircle } from 'lucide-react';
import { commentsAPI } from '../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

// ── Shared dark mode hook ──────────────────────────────────────────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
};

// ── Avatar gradient (shared) ───────────────────────────────────────
const getAvatarGradient = (author) => {
  const colors = [
    'linear-gradient(135deg,#3b82f6,#1e40af)',
    'linear-gradient(135deg,#a855f7,#7c3aed)',
    'linear-gradient(135deg,#ec4899,#be185d)',
    'linear-gradient(135deg,#16a34a,#15803d)',
    'linear-gradient(135deg,#f97316,#ea580c)',
    'linear-gradient(135deg,#ef4444,#dc2626)',
    'linear-gradient(135deg,#14b8a6,#0d9488)',
    'linear-gradient(135deg,#6366f1,#4f46e5)',
  ];
  return colors[author.charCodeAt(0) % colors.length];
};

// ══════════════════════════════════════════════════════════════════
//  Comment
// ══════════════════════════════════════════════════════════════════
const Comment = ({
  comment, onReply, onLike, onDislike, onDelete, onQuote, onShare, onBookmark,
  depth = 0, allComments = [], currentUserIdentifier, isAdmin,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showMenu,      setShowMenu]      = useState(false);
  const [replyName,     setReplyName]     = useState('');
  const [replyContent,  setReplyContent]  = useState('');
  const [quoteContent,  setQuoteContent]  = useState('');
  const [quoteName,     setQuoteName]     = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [showReplies,   setShowReplies]   = useState(true);
  const { showToast } = useToast();
  const isDark = useDarkMode();

  const c = {
    text:           isDark ? '#cbd5e1' : '#374151',
    heading:        isDark ? '#f1f5f9' : '#0f1a12',
    muted:          isDark ? '#94a3b8' : '#9ca3af',
    inputBg:        isDark ? '#0f172a' : 'white',
    inputBorder:    isDark ? '#334155' : '#e5e7eb',
    inputColor:     isDark ? '#f1f5f9' : '#111827',
    btnBg:          isDark ? '#334155' : '#f3f4f6',
    btnColor:       isDark ? '#94a3b8' : '#6b7280',
    menuBg:         isDark ? '#1e293b' : 'white',
    menuBorder:     isDark ? '#334155' : '#e5e7eb',
    menuHover:      isDark ? '#334155' : '#f9fafb',
    menuDivider:    isDark ? '#334155' : '#f3f4f6',
    quotedBg:       isDark ? '#0f172a'  : '#f9fafb',
    replyFormBg:    isDark ? 'rgba(59,130,246,.07)' : 'linear-gradient(to right,#eff6ff,rgba(239,246,255,.5))',
    replyFormBdr:   isDark ? '#1e3a5f' : '#dbeafe',
    replyLabel:     isDark ? '#60a5fa' : '#1e40af',
    quoteFormBg:    isDark ? 'rgba(22,163,74,.07)' : 'linear-gradient(to right,#f0fdf4,rgba(240,253,244,.5))',
    quoteFormBdr:   isDark ? 'rgba(22,163,74,.3)' : '#dcfce7',
    quoteInnerBg:   isDark ? '#0f172a' : 'white',
    cancelBg:       isDark ? '#334155' : '#f3f4f6',
    cancelBgHover:  isDark ? '#475569' : '#e5e7eb',
    cancelColor:    isDark ? '#cbd5e1' : '#374151',
    replyTreeBdr:   isDark ? 'rgba(22,163,74,.25)' : '#dcfce7',
    showRepliesBg:  isDark ? 'rgba(22,163,74,.12)' : '#f0fdf4',
    showRepliesBgH: isDark ? 'rgba(22,163,74,.22)' : '#dcfce7',
    youBg:          isDark ? 'rgba(30,64,175,.25)' : '#dbeafe',
    youColor:       isDark ? '#60a5fa' : '#1e40af',
  };

  const inputBase = {
    width: '100%', padding: '10px 14px', border: `1.5px solid ${c.inputBorder}`,
    borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif',
    transition: '.2s', background: c.inputBg, color: c.inputColor, boxSizing: 'border-box',
  };

  const directReplies = allComments.filter(r => r.parentComment === comment._id);
  const replyCount    = directReplies.length;
  const isOwnComment  = currentUserIdentifier && comment.userIdentifier === currentUserIdentifier;
  const canDelete     = isAdmin || isOwnComment;

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyName.trim() || !replyContent.trim()) return;
    setSubmitting(true);
    await onReply(comment._id, replyName, replyContent);
    setReplyName(''); setReplyContent(''); setShowReplyForm(false); setSubmitting(false);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!quoteName.trim() || !quoteContent.trim()) return;
    setSubmitting(true);
    await onQuote(comment._id, quoteName, quoteContent);
    setQuoteName(''); setQuoteContent(''); setShowQuoteForm(false); setSubmitting(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.href}#comment-${comment._id}`);
    showToast('Comment link copied! 📋', 'success');
    setShowMenu(false);
  };

  return (
    <div id={`comment-${comment._id}`} style={{ position: 'relative', marginTop: depth > 0 ? 12 : 0 }}>
      {depth > 0 && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom,#16a34a,rgba(22,163,74,.2))', borderRadius: 100 }} />
      )}

      <div style={{ marginLeft: depth > 0 ? 24 : 0 }}>

        {/* ── Quoted comment preview ── */}
        {comment.quotedComment && (
          <div style={{ marginBottom: 16, padding: 16, background: c.quotedBg, borderRadius: 16, borderLeft: '4px solid #16a34a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, background: getAvatarGradient(comment.quotedComment.author), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,.2)' }}>
                {comment.quotedComment.author[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{comment.quotedComment.author}</span>
              <Quote size={12} color="#16a34a" />
            </div>
            <p style={{ fontSize: 13, color: c.muted, fontStyle: 'italic', paddingLeft: 32, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              "{comment.quotedComment.content}"
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 14 }}>
          {/* Avatar */}
          <div style={{ width: 44, height: 44, background: getAvatarGradient(comment.author), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,.15)', transition: '.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {comment.author[0].toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Meta row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: c.heading }}>{comment.author}</span>
                {comment.isAdminReply && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: '#16a34a', color: 'white', boxShadow: '0 2px 6px rgba(22,163,74,.3)' }}>
                    <Shield size={10} /> Admin
                  </span>
                )}
                {isOwnComment && !comment.isAdminReply && (
                  <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: c.youBg, color: c.youColor }}>You</span>
                )}
                <span style={{ fontSize: 12, color: c.muted, fontWeight: 600 }}>
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && <span style={{ fontSize: 11, color: c.muted, fontStyle: 'italic' }}>(edited)</span>}
              </div>

              {/* ⋯ menu */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowMenu(!showMenu)}
                  style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: c.muted, transition: '.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = c.text}
                  onMouseLeave={e => e.currentTarget.style.color = c.muted}>
                  <MoreHorizontal size={18} />
                </button>
                {showMenu && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 200, background: c.menuBg, borderRadius: 12, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,.45)' : '0 8px 24px rgba(0,0,0,.15)', border: `1px solid ${c.menuBorder}`, padding: 4, zIndex: 20 }}>
                    <button onClick={handleCopyLink}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, transition: '.15s', color: c.text, fontFamily: 'DM Sans, sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = c.menuHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Share2 size={16} /> Copy link
                    </button>
                    <button onClick={() => { onShare(comment); setShowMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, transition: '.15s', color: c.text, fontFamily: 'DM Sans, sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = c.menuHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Share2 size={16} /> Share comment
                    </button>
                    <button onClick={() => { showToast('Reported to moderators', 'info'); setShowMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, transition: '.15s', color: '#ef4444', borderTop: `1px solid ${c.menuDivider}`, fontFamily: 'DM Sans, sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(239,68,68,.1)' : '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Flag size={16} /> Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <p style={{ color: c.text, marginBottom: 16, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{comment.content}</p>

            {/* ── Action buttons ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button onClick={() => onLike(comment._id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: '.2s', background: comment.hasLiked ? (isDark ? 'rgba(22,163,74,.2)' : '#f0fdf4') : c.btnBg, color: comment.hasLiked ? '#16a34a' : c.btnColor, boxShadow: comment.hasLiked ? '0 2px 8px rgba(22,163,74,.2)' : 'none' }}
                onMouseEnter={e => !comment.hasLiked && (e.currentTarget.style.background = isDark ? 'rgba(22,163,74,.18)' : '#dcfce7', e.currentTarget.style.color = '#16a34a')}
                onMouseLeave={e => !comment.hasLiked && (e.currentTarget.style.background = c.btnBg, e.currentTarget.style.color = c.btnColor)}>
                <ThumbsUp size={14} fill={comment.hasLiked ? 'currentColor' : 'none'} />
                {comment.likes || 0}
              </button>

              <button onClick={() => onDislike(comment._id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: '.2s', background: comment.hasDisliked ? (isDark ? 'rgba(239,68,68,.2)' : '#fee2e2') : c.btnBg, color: comment.hasDisliked ? '#ef4444' : c.btnColor, boxShadow: comment.hasDisliked ? '0 2px 8px rgba(239,68,68,.2)' : 'none' }}
                onMouseEnter={e => !comment.hasDisliked && (e.currentTarget.style.background = isDark ? 'rgba(239,68,68,.18)' : '#fecaca', e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => !comment.hasDisliked && (e.currentTarget.style.background = c.btnBg, e.currentTarget.style.color = c.btnColor)}>
                <ThumbsDown size={14} fill={comment.hasDisliked ? 'currentColor' : 'none'} />
                {comment.dislikes || 0}
              </button>

              <button onClick={() => { setShowReplyForm(!showReplyForm); setShowQuoteForm(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: '.2s', background: c.btnBg, color: c.btnColor }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(59,130,246,.15)' : '#dbeafe', e.currentTarget.style.color = '#3b82f6')}
                onMouseLeave={e => (e.currentTarget.style.background = c.btnBg, e.currentTarget.style.color = c.btnColor)}>
                <Reply size={14} /> Reply
              </button>

              <button onClick={() => { setShowQuoteForm(!showQuoteForm); setShowReplyForm(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: '.2s', background: c.btnBg, color: c.btnColor }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(22,163,74,.15)' : '#dcfce7', e.currentTarget.style.color = '#16a34a')}
                onMouseLeave={e => (e.currentTarget.style.background = c.btnBg, e.currentTarget.style.color = c.btnColor)}>
                <Quote size={14} /> Quote
              </button>

              <button onClick={() => onBookmark(comment._id)} title="Bookmark"
                style={{ display: 'flex', alignItems: 'center', padding: '6px', borderRadius: 100, border: 'none', cursor: 'pointer', transition: '.2s', background: comment.isBookmarked ? (isDark ? 'rgba(245,158,11,.2)' : '#fef3c7') : c.btnBg, color: comment.isBookmarked ? '#f59e0b' : c.btnColor }}>
                <Bookmark size={14} fill={comment.isBookmarked ? 'currentColor' : 'none'} />
              </button>

              {canDelete && (
                <button onClick={() => onDelete(comment._id)} title={isAdmin ? 'Delete (Admin)' : 'Delete'}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: '.2s', background: c.btnBg, color: c.btnColor }}
                  onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(239,68,68,.15)' : '#fee2e2', e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.background = c.btnBg, e.currentTarget.style.color = c.btnColor)}>
                  <Trash2 size={14} />
                  {isAdmin && !isOwnComment && <Shield size={10} color="#ef4444" />}
                </button>
              )}
            </div>

            {/* ── Reply form ── */}
            {showReplyForm && (
              <form onSubmit={handleSubmitReply} style={{ marginTop: 16, padding: 16, background: c.replyFormBg, borderRadius: 16, border: `1px solid ${c.replyFormBdr}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13, color: c.replyLabel, fontWeight: 600 }}>
                  <Reply size={14} /> Replying to @{comment.author}
                </div>
                <input type="text" placeholder="Your name" value={replyName} onChange={e => setReplyName(e.target.value)} required style={inputBase}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={e => e.currentTarget.style.borderColor = c.inputBorder} />
                <textarea placeholder="Write your reply..." value={replyContent} onChange={e => setReplyContent(e.target.value)} required rows={3}
                  style={{ ...inputBase, marginTop: 10, resize: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={e => e.currentTarget.style.borderColor = c.inputBorder} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="submit" disabled={submitting}
                    style={{ padding: '10px 20px', background: 'linear-gradient(to right,#3b82f6,#2563eb)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: submitting ? .6 : 1, boxShadow: '0 4px 12px rgba(59,130,246,.3)', transition: '.2s', fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 6px 16px rgba(59,130,246,.4)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,.3)')}>
                    <Send size={14} /> {submitting ? 'Posting...' : 'Reply'}
                  </button>
                  <button type="button" onClick={() => setShowReplyForm(false)}
                    style={{ padding: '10px 20px', background: c.cancelBg, color: c.cancelColor, border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: '.2s', fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.cancelBgHover}
                    onMouseLeave={e => e.currentTarget.style.background = c.cancelBg}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* ── Quote form ── */}
            {showQuoteForm && (
              <form onSubmit={handleSubmitQuote} style={{ marginTop: 16, padding: 16, background: c.quoteFormBg, borderRadius: 16, border: `1px solid ${c.quoteFormBdr}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                  <Quote size={14} /> Quoting @{comment.author}
                </div>
                <div style={{ padding: 12, background: c.quoteInnerBg, borderRadius: 10, borderLeft: '4px solid #16a34a', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 20, height: 20, background: getAvatarGradient(comment.author), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700 }}>
                      {comment.author[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.muted }}>{comment.author}</span>
                  </div>
                  <p style={{ fontSize: 13, color: c.muted, fontStyle: 'italic', paddingLeft: 28, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    "{comment.content}"
                  </p>
                </div>
                <input type="text" placeholder="Your name" value={quoteName} onChange={e => setQuoteName(e.target.value)} required style={inputBase}
                  onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
                  onBlur={e => e.currentTarget.style.borderColor = c.inputBorder} />
                <textarea placeholder="Add your thoughts..." value={quoteContent} onChange={e => setQuoteContent(e.target.value)} required rows={3}
                  style={{ ...inputBase, marginTop: 10, resize: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
                  onBlur={e => e.currentTarget.style.borderColor = c.inputBorder} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="submit" disabled={submitting}
                    style={{ padding: '10px 20px', background: 'linear-gradient(to right,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: submitting ? .6 : 1, boxShadow: '0 4px 12px rgba(22,163,74,.3)', transition: '.2s', fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 6px 16px rgba(22,163,74,.4)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(22,163,74,.3)')}>
                    <Quote size={14} /> {submitting ? 'Posting...' : 'Quote'}
                  </button>
                  <button type="button" onClick={() => setShowQuoteForm(false)}
                    style={{ padding: '10px 20px', background: c.cancelBg, color: c.cancelColor, border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: '.2s', fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.cancelBgHover}
                    onMouseLeave={e => e.currentTarget.style.background = c.cancelBg}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Nested replies ── */}
        {replyCount > 0 && (
          <div style={{ marginTop: 16, marginLeft: 24 }}>
            <button onClick={() => setShowReplies(!showReplies)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: c.showRepliesBg, color: '#16a34a', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, marginBottom: 12, transition: '.2s', boxShadow: '0 2px 8px rgba(22,163,74,.1)', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.background = c.showRepliesBgH}
              onMouseLeave={e => e.currentTarget.style.background = c.showRepliesBg}>
              <MessageCircle size={14} />
              {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              <span style={{ fontSize: 10 }}>{showReplies ? '▼' : '▶'}</span>
            </button>
            {showReplies && (
              <div style={{ borderLeft: `2px solid ${c.replyTreeBdr}`, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {directReplies.map(reply => (
                  <Comment key={reply._id} comment={reply} onReply={onReply} onLike={onLike} onDislike={onDislike}
                    onDelete={onDelete} onQuote={onQuote} onShare={onShare} onBookmark={onBookmark}
                    depth={depth + 1} allComments={allComments} currentUserIdentifier={currentUserIdentifier} isAdmin={isAdmin} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  CommentSection
// ══════════════════════════════════════════════════════════════════
const CommentSection = ({ postId }) => {
  const [comments,    setComments]    = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [name,        setName]        = useState('');
  const [content,     setContent]     = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [sortBy,      setSortBy]      = useState('recent');
  const { showToast }       = useToast();
  const { isAuthenticated } = useAuth();
  const isDark = useDarkMode();

  const c = {
    heading:     isDark ? '#f1f5f9' : '#0f1a12',
    muted:       isDark ? '#94a3b8' : '#9ca3af',
    cardBg:      isDark ? '#1e293b' : 'white',
    cardBorder:  isDark ? '#334155' : '#f3f4f6',
    inputBg:     isDark ? '#0f172a' : 'white',
    inputBorder: isDark ? '#334155' : '#e5e7eb',
    inputColor:  isDark ? '#f1f5f9' : '#111827',
    sortBg:      isDark ? '#1e293b' : '#f3f4f6',
    sortActive:  isDark ? '#334155' : 'white',
    sortColor:   isDark ? '#16a34a' : '#16a34a',
    sortMuted:   isDark ? '#94a3b8' : '#6b7280',
    sortShadow:  isDark ? '0 2px 8px rgba(0,0,0,.3)' : '0 2px 8px rgba(0,0,0,.08)',
    emptyBg:     isDark ? '#1e293b' : 'white',
    emptyBorder: isDark ? '#334155' : '#e5e7eb',
    avatarBg:    isDark ? '#334155' : 'linear-gradient(135deg,#d1d5db,#9ca3af)',
  };

  const inputBase = {
    padding: '12px 16px', border: `1.5px solid ${c.inputBorder}`, borderRadius: 12,
    fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', transition: '.2s',
    background: c.inputBg, color: c.inputColor, width: '100%', boxSizing: 'border-box',
  };

  const getUserIdentifier = () => {
    let id = localStorage.getItem('userIdentifier');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userIdentifier', id);
    }
    return id;
  };
  const currentUserIdentifier = getUserIdentifier();

  useEffect(() => {
    fetchComments();
    const saved = localStorage.getItem('commentAuthorName');
    if (saved) setName(saved);
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await commentsAPI.getByPost(postId);
      const fetched = res.data.data.comments || [];
      const flatten = (list) => {
        const flat = [];
        const walk = (arr) => arr.forEach(c => { flat.push(c); if (c.replies?.length) walk(c.replies); });
        walk(list);
        return flat;
      };
      setAllComments(flatten(fetched));
      setComments(fetched);
    } catch (err) { console.error('Error fetching comments:', err); }
    finally { setLoading(false); }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      localStorage.setItem('commentAuthorName', name.trim());
      await commentsAPI.create({ postId, author: name.trim(), content: content.trim(), userIdentifier: currentUserIdentifier });
      setContent('');
      await fetchComments();
      showToast('Comment posted! 🎉', 'success');
    } catch { showToast('Failed to post comment', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleReply = async (parentCommentId, authorName, replyContent) => {
    try {
      localStorage.setItem('commentAuthorName', authorName.trim());
      await commentsAPI.create({ postId, author: authorName.trim(), content: replyContent.trim(), parentCommentId, userIdentifier: currentUserIdentifier });
      await fetchComments();
      showToast('Reply posted! 💬', 'success');
    } catch { showToast('Failed to post reply', 'error'); }
  };

  const handleQuote = async (quotedCommentId, authorName, quoteContent) => {
    try {
      localStorage.setItem('commentAuthorName', authorName.trim());
      await commentsAPI.create({ postId, author: authorName.trim(), content: quoteContent.trim(), quotedCommentId, isQuote: true, userIdentifier: currentUserIdentifier });
      await fetchComments();
      showToast('Quote posted! 📝', 'success');
    } catch { showToast('Failed to post quote', 'error'); }
  };

  const handleLike    = async (id) => { try { await commentsAPI.like(id);    await fetchComments(); } catch (e) { console.error(e); } };
  const handleDislike = async (id) => { try { await commentsAPI.dislike(id); await fetchComments(); } catch (e) { console.error(e); } };

  const handleDelete = async (commentId) => {
    try {
      const res = await commentsAPI.delete(commentId);
      await fetchComments();
      if (res.data.data?.deletedBy === 'admin') {
        showToast(`Deleted by admin${res.data.data.totalDeleted > 1 ? ` (${res.data.data.totalDeleted} total)` : ''} 🗑️`, 'success');
      } else {
        showToast('Comment deleted! 🗑️', 'success');
      }
    } catch (err) { showToast(err.response?.data?.message || 'Failed to delete', 'error'); }
  };

  const handleShare = (comment) => {
    const text = `Check out this comment by ${comment.author}: "${comment.content}"`;
    if (navigator.share) {
      navigator.share({ title: 'Share Comment', text, url: `${window.location.href}#comment-${comment._id}` });
    } else {
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success');
    }
  };

  const handleBookmark = (commentId) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedComments') || '[]');
    const idx = bookmarks.indexOf(commentId);
    if (idx > -1) { bookmarks.splice(idx, 1); showToast('Bookmark removed', 'info'); }
    else           { bookmarks.push(commentId); showToast('Bookmarked! 🔖', 'success'); }
    localStorage.setItem('bookmarkedComments', JSON.stringify(bookmarks));
    fetchComments();
  };

  const getSortedComments = () => {
    const sorted = [...comments];
    if (sortBy === 'popular')       sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    if (sortBy === 'controversial') sorted.sort((a, b) => Math.abs((b.likes||0)-(b.dislikes||0)) - Math.abs((a.likes||0)-(a.dislikes||0)));
    return sorted;
  };

  const displayedComments = getSortedComments();
  const totalComments     = allComments.length;

  return (
    <div style={{ marginTop: 64, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MessageCircle size={28} color="#16a34a" />
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: c.heading, margin: 0, transition: 'color .3s' }}>
            Comments <span style={{ fontSize: 22, color: c.muted }}>({totalComments})</span>
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 4, background: c.sortBg, padding: 4, borderRadius: 12, transition: 'background .3s' }}>
          {['recent', 'popular', 'controversial'].map(sort => (
            <button key={sort} onClick={() => setSortBy(sort)}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: '.2s', background: sortBy === sort ? c.sortActive : 'transparent', color: sortBy === sort ? c.sortColor : c.sortMuted, boxShadow: sortBy === sort ? c.sortShadow : 'none', fontFamily: 'DM Sans, sans-serif' }}>
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── New comment form ── */}
      <form onSubmit={handleSubmitComment} style={{ marginBottom: 40, background: c.cardBg, padding: 24, borderRadius: 24, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,.25)' : '0 4px 20px rgba(0,0,0,.08)', border: `1px solid ${c.cardBorder}`, transition: 'background .3s, border-color .3s' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 48, height: 48, background: name ? getAvatarGradient(name) : c.avatarBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,.1)', transition: 'background .3s' }}>
            {name ? name[0].toUpperCase() : '?'}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required style={inputBase}
              onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
              onBlur={e => e.currentTarget.style.borderColor = c.inputBorder} />
            <textarea placeholder="What are your thoughts?" value={content} onChange={e => setContent(e.target.value)} required rows={4} style={{ ...inputBase, resize: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
              onBlur={e => e.currentTarget.style.borderColor = c.inputBorder} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={submitting}
                style={{ padding: '12px 28px', background: 'linear-gradient(to right,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(22,163,74,.35)', transition: '.2s', opacity: submitting ? .6 : 1, fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Send size={16} />
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ── Comments list ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ width: 48, height: 48, border: '3px solid rgba(22,163,74,.2)', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: c.emptyBg, borderRadius: 24, border: `2px dashed ${c.emptyBorder}`, transition: 'background .3s' }}>
          <MessageCircle size={48} color={c.muted} style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: c.muted, marginBottom: 8 }}>No comments yet</p>
          <p style={{ fontSize: 14, color: c.muted }}>Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayedComments.map(comment => (
            <div key={comment._id}
              style={{ background: c.cardBg, padding: 24, borderRadius: 20, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,.2)' : '0 2px 12px rgba(0,0,0,.06)', border: `1px solid ${c.cardBorder}`, transition: 'box-shadow .2s, background .3s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,.3)' : '0 8px 24px rgba(0,0,0,.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,.2)' : '0 2px 12px rgba(0,0,0,.06)'}>
              <Comment
                comment={comment} onReply={handleReply} onLike={handleLike} onDislike={handleDislike}
                onDelete={handleDelete} onQuote={handleQuote} onShare={handleShare} onBookmark={handleBookmark}
                allComments={allComments} currentUserIdentifier={currentUserIdentifier} isAdmin={isAuthenticated}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;