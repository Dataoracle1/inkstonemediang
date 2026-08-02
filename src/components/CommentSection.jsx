import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Reply, Trash2, Send, Quote, Share2, Bookmark, MoreHorizontal, Flag, Shield, MessageCircle } from 'lucide-react';
import { commentsAPI } from '../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

// ── Avatar gradient (shared) — kept colorful/varied on purpose, distinct from brand palette ──
const getAvatarGradient = (author) => {
  const colors = [
    'linear-gradient(135deg,#3b82f6,#1e40af)', 'linear-gradient(135deg,#a855f7,#7c3aed)',
    'linear-gradient(135deg,#ec4899,#be185d)', 'linear-gradient(135deg,#3f7a55,#1f3d2f)',
    'linear-gradient(135deg,#f97316,#ea580c)', 'linear-gradient(135deg,#a8321f,#7a2416)',
    'linear-gradient(135deg,#14b8a6,#0d9488)', 'linear-gradient(135deg,#6366f1,#4f46e5)',
  ];
  return colors[author.charCodeAt(0) % colors.length];
};

const inputBase = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--ink-rule)',
  borderRadius: 2, fontSize: 14, outline: 'none', fontFamily: "'Source Sans 3', sans-serif",
  transition: '.15s', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', boxSizing: 'border-box',
};

const actionBtnStyle = (active, activeColor) => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--ink-rule)',
  cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: '.15s', background: 'transparent',
  color: active ? activeColor : 'var(--ink-ink-soft)', borderColor: active ? activeColor : 'var(--ink-rule)',
  fontFamily: "'IBM Plex Mono', monospace",
});

// ══════════════════════════════════════════════════════════════════
//  Comment
// ══════════════════════════════════════════════════════════════════
const Comment = ({
  comment, onReply, onLike, onDislike, onDelete, onQuote, onShare, onBookmark,
  depth = 0, allComments = [], currentUserIdentifier, isAdmin,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [replyName, setReplyName] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [quoteContent, setQuoteContent] = useState('');
  const [quoteName, setQuoteName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const { showToast } = useToast();

  const directReplies = allComments.filter(r => r.parentComment === comment._id);
  const replyCount = directReplies.length;
  const isOwnComment = currentUserIdentifier && comment.userIdentifier === currentUserIdentifier;
  const canDelete = isAdmin || isOwnComment;

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
    showToast('Comment link copied!', 'success');
    setShowMenu(false);
  };

  return (
    <div id={`comment-${comment._id}`} style={{ position: 'relative', marginTop: depth > 0 ? 12 : 0 }}>
      {depth > 0 && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'var(--ink-rule)' }} />
      )}

      <div style={{ marginLeft: depth > 0 ? 24 : 0 }}>

        {comment.quotedComment && (
          <div style={{ marginBottom: 14, padding: 14, background: 'var(--ink-paper-dim)', borderLeft: '3px solid var(--ink-stamp)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, background: getAvatarGradient(comment.quotedComment.author), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {comment.quotedComment.author[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-ink)' }}>{comment.quotedComment.author}</span>
              <Quote size={12} color="var(--ink-stamp)" />
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', fontStyle: 'italic', paddingLeft: 30, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              "{comment.quotedComment.content}"
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ width: 40, height: 40, background: getAvatarGradient(comment.author), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
            {comment.author[0].toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink)' }}>{comment.author}</span>
                {comment.isAdminReply && (
                  <span className="ink-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, background: 'var(--ink-stamp)', color: 'white', textTransform: 'uppercase' }}>
                    <Shield size={10} /> Admin
                  </span>
                )}
                {isOwnComment && !comment.isAdminReply && (
                  <span className="ink-mono" style={{ display: 'inline-flex', padding: '2px 8px', fontSize: 10, fontWeight: 700, border: '1px solid var(--ink-wire-bright)', color: 'var(--ink-wire-bright)', textTransform: 'uppercase' }}>You</span>
                )}
                <span className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)' }}>
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && <span style={{ fontSize: 11, color: 'var(--ink-ink-soft)', fontStyle: 'italic' }}>(edited)</span>}
              </div>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowMenu(!showMenu)}
                  style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}>
                  <MoreHorizontal size={17} />
                </button>
                {showMenu && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 190, background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', boxShadow: '0 8px 24px rgba(0,0,0,.15)', zIndex: 20 }}>
                    <button onClick={handleCopyLink}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-ink)' }}>
                      <Share2 size={14} /> Copy link
                    </button>
                    <button onClick={() => { onShare(comment); setShowMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-ink)' }}>
                      <Share2 size={14} /> Share comment
                    </button>
                    <button onClick={() => { showToast('Reported to moderators', 'info'); setShowMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13, background: 'transparent', border: 'none', borderTop: '1px solid var(--ink-rule)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-stamp)' }}>
                      <Flag size={14} /> Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: 14 }}>{comment.content}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button onClick={() => onLike(comment._id)} style={actionBtnStyle(comment.hasLiked, 'var(--ink-wire-bright)')}>
                <ThumbsUp size={13} fill={comment.hasLiked ? 'currentColor' : 'none'} />
                {comment.likes || 0}
              </button>
              <button onClick={() => onDislike(comment._id)} style={actionBtnStyle(comment.hasDisliked, 'var(--ink-stamp)')}>
                <ThumbsDown size={13} fill={comment.hasDisliked ? 'currentColor' : 'none'} />
                {comment.dislikes || 0}
              </button>
              <button onClick={() => { setShowReplyForm(!showReplyForm); setShowQuoteForm(false); }} style={actionBtnStyle(showReplyForm, 'var(--ink-ink)')}>
                <Reply size={13} /> Reply
              </button>
              <button onClick={() => { setShowQuoteForm(!showQuoteForm); setShowReplyForm(false); }} style={actionBtnStyle(showQuoteForm, 'var(--ink-stamp)')}>
                <Quote size={13} /> Quote
              </button>
              <button onClick={() => onBookmark(comment._id)} title="Bookmark" style={actionBtnStyle(comment.isBookmarked, '#b45309')}>
                <Bookmark size={13} fill={comment.isBookmarked ? 'currentColor' : 'none'} />
              </button>
              {canDelete && (
                <button onClick={() => onDelete(comment._id)} title={isAdmin ? 'Delete (Admin)' : 'Delete'} style={actionBtnStyle(false, 'var(--ink-stamp)')}>
                  <Trash2 size={13} />
                  {isAdmin && !isOwnComment && <Shield size={10} />}
                </button>
              )}
            </div>

            {showReplyForm && (
              <form onSubmit={handleSubmitReply} style={{ marginTop: 14, padding: 14, background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)' }}>
                <div className="ink-mono" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 12, color: 'var(--ink-ink-soft)', fontWeight: 600 }}>
                  <Reply size={13} /> Replying to @{comment.author}
                </div>
                <input type="text" placeholder="Your name" value={replyName} onChange={e => setReplyName(e.target.value)} required style={inputBase} />
                <textarea placeholder="Write your reply..." value={replyContent} onChange={e => setReplyContent(e.target.value)} required rows={3}
                  style={{ ...inputBase, marginTop: 10, resize: 'none' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="submit" disabled={submitting} className="ink-btn ink-btn-stamp" style={{ opacity: submitting ? .6 : 1 }}>
                    <Send size={13} /> {submitting ? 'Posting...' : 'Reply'}
                  </button>
                  <button type="button" onClick={() => setShowReplyForm(false)} className="ink-btn">Cancel</button>
                </div>
              </form>
            )}

            {showQuoteForm && (
              <form onSubmit={handleSubmitQuote} style={{ marginTop: 14, padding: 14, background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)' }}>
                <div className="ink-mono" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 12, color: 'var(--ink-stamp)', fontWeight: 600 }}>
                  <Quote size={13} /> Quoting @{comment.author}
                </div>
                <div style={{ padding: 10, background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderLeft: '3px solid var(--ink-stamp)', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 18, height: 18, background: getAvatarGradient(comment.author), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9, fontWeight: 700 }}>
                      {comment.author[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-ink-soft)' }}>{comment.author}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', fontStyle: 'italic', paddingLeft: 26, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    "{comment.content}"
                  </p>
                </div>
                <input type="text" placeholder="Your name" value={quoteName} onChange={e => setQuoteName(e.target.value)} required style={inputBase} />
                <textarea placeholder="Add your thoughts..." value={quoteContent} onChange={e => setQuoteContent(e.target.value)} required rows={3}
                  style={{ ...inputBase, marginTop: 10, resize: 'none' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="submit" disabled={submitting} className="ink-btn ink-btn-stamp" style={{ opacity: submitting ? .6 : 1 }}>
                    <Quote size={13} /> {submitting ? 'Posting...' : 'Quote'}
                  </button>
                  <button type="button" onClick={() => setShowQuoteForm(false)} className="ink-btn">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {replyCount > 0 && (
          <div style={{ marginTop: 14, marginLeft: 24 }}>
            <button onClick={() => setShowReplies(!showReplies)} className="ink-mono"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', border: '1px solid var(--ink-wire-bright)', color: 'var(--ink-wire-bright)', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: 12, marginBottom: 10 }}>
              <MessageCircle size={13} />
              {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              <span style={{ fontSize: 9 }}>{showReplies ? '▼' : '▶'}</span>
            </button>
            {showReplies && (
              <div style={{ borderLeft: '2px solid var(--ink-rule)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
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
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const getUserIdentifier = () => {
    let id = localStorage.getItem('userIdentifier');
    if (!id) { id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; localStorage.setItem('userIdentifier', id); }
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
      showToast('Comment posted!', 'success');
    } catch { showToast('Failed to post comment', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleReply = async (parentCommentId, authorName, replyContent) => {
    try {
      localStorage.setItem('commentAuthorName', authorName.trim());
      await commentsAPI.create({ postId, author: authorName.trim(), content: replyContent.trim(), parentCommentId, userIdentifier: currentUserIdentifier });
      await fetchComments();
      showToast('Reply posted!', 'success');
    } catch { showToast('Failed to post reply', 'error'); }
  };

  const handleQuote = async (quotedCommentId, authorName, quoteContent) => {
    try {
      localStorage.setItem('commentAuthorName', authorName.trim());
      await commentsAPI.create({ postId, author: authorName.trim(), content: quoteContent.trim(), quotedCommentId, isQuote: true, userIdentifier: currentUserIdentifier });
      await fetchComments();
      showToast('Quote posted!', 'success');
    } catch { showToast('Failed to post quote', 'error'); }
  };

  const handleLike = async (id) => { try { await commentsAPI.like(id); await fetchComments(); } catch (e) { console.error(e); } };
  const handleDislike = async (id) => { try { await commentsAPI.dislike(id); await fetchComments(); } catch (e) { console.error(e); } };

  const handleDelete = async (commentId) => {
    try {
      const res = await commentsAPI.delete(commentId);
      await fetchComments();
      if (res.data.data?.deletedBy === 'admin') {
        showToast(`Deleted by admin${res.data.data.totalDeleted > 1 ? ` (${res.data.data.totalDeleted} total)` : ''}`, 'success');
      } else {
        showToast('Comment deleted!', 'success');
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
    else { bookmarks.push(commentId); showToast('Bookmarked!', 'success'); }
    localStorage.setItem('bookmarkedComments', JSON.stringify(bookmarks));
    fetchComments();
  };

  const getSortedComments = () => {
    const sorted = [...comments];
    if (sortBy === 'popular') sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    if (sortBy === 'controversial') sorted.sort((a, b) => Math.abs((b.likes || 0) - (b.dislikes || 0)) - Math.abs((a.likes || 0) - (a.dislikes || 0)));
    return sorted;
  };

  const displayedComments = getSortedComments();
  const totalComments = allComments.length;

  return (
    <div style={{ marginTop: 48 }}>
      <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MessageCircle size={22} color="var(--ink-stamp)" />
          <h3 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>
            Comments <span style={{ fontSize: 18, color: 'var(--ink-ink-soft)' }}>({totalComments})</span>
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['recent', 'popular', 'controversial'].map(sort => (
            <button key={sort} onClick={() => setSortBy(sort)} className="ink-mono"
              style={{ padding: '7px 14px', border: '1px solid var(--ink-rule)', fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.04em', background: sortBy === sort ? 'var(--ink-ink)' : 'transparent', color: sortBy === sort ? 'var(--ink-paper)' : 'var(--ink-ink-soft)' }}>
              {sort}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmitComment} className="ink-card" style={{ marginBottom: 28, padding: 20 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ width: 44, height: 44, background: name ? getAvatarGradient(name) : 'var(--ink-rule)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
            {name ? name[0].toUpperCase() : '?'}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required style={inputBase} />
            <textarea placeholder="What are your thoughts?" value={content} onChange={e => setContent(e.target.value)} required rows={4} style={{ ...inputBase, resize: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={submitting} className="ink-btn ink-btn-stamp" style={{ opacity: submitting ? .6 : 1 }}>
                <Send size={14} />
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '56px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 24px', border: '2px dashed var(--ink-rule)' }}>
          <MessageCircle size={40} color="var(--ink-ink-soft)" style={{ margin: '0 auto 14px', display: 'block' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-ink-soft)', marginBottom: 6 }}>No comments yet</p>
          <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {displayedComments.map(comment => (
            <div key={comment._id} className="ink-card" style={{ padding: 20 }}>
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