import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Eye, Flag, CheckCircle, XCircle, Search } from 'lucide-react';
import { commentsAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { formatDistanceToNow } from 'date-fns';

const Badge = ({ children, tone = 'neutral' }) => {
  const tones = { neutral: 'var(--ink-ink-soft)', danger: 'var(--ink-stamp)', warn: '#b45309' };
  const color = tones[tone] || tones.neutral;
  return (
    <span className="ink-mono" style={{ padding: '2px 8px', border: `1px solid ${color}`, color, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
};

const AdminCommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => { fetchComments(); fetchStats(); }, [filter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getStats();
      setComments(response.data.data.recentComments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      showToast('Failed to fetch comments', 'error');
    } finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try { const response = await commentsAPI.getStats(); setStats(response.data.data); }
    catch (error) { console.error('Error fetching stats:', error); }
  };

  const handleDelete = async (commentId, commentAuthor) => {
    if (!confirm(`Are you sure you want to delete this comment by ${commentAuthor}?`)) return;
    try {
      await commentsAPI.delete(commentId);
      showToast('Comment deleted successfully', 'success');
      fetchComments(); fetchStats();
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleApprove = async (commentId, currentStatus) => {
    try {
      await commentsAPI.approve(commentId, !currentStatus);
      showToast(`Comment ${!currentStatus ? 'approved' : 'unapproved'}`, 'success');
      fetchComments(); fetchStats();
    } catch (error) {
      console.error('Error updating comment:', error);
      showToast('Failed to update comment', 'error');
    }
  };

  const filteredComments = comments.filter(comment => {
    if (searchQuery) {
      return comment.content.toLowerCase().includes(searchQuery.toLowerCase()) || comment.author.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (filter === 'flagged') return comment.isFlagged;
    return true;
  });

  return (
    <div>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Comments', value: stats.totalComments, icon: MessageSquare },
            { label: 'Approved', value: stats.approvedComments, icon: CheckCircle },
            { label: 'Pending', value: stats.pendingComments, icon: Eye },
            { label: 'Flagged', value: stats.flaggedComments, icon: Flag },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="ink-card" style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</p>
                <p className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>{value}</p>
              </div>
              <Icon size={20} color="var(--ink-stamp)" />
            </div>
          ))}
        </div>
      )}

      <div className="ink-card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'flagged'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="ink-mono"
                style={{
                  padding: '9px 16px', border: '1px solid var(--ink-rule)', cursor: 'pointer', fontSize: 11,
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em',
                  background: filter === f ? 'var(--ink-ink)' : 'transparent',
                  color: filter === f ? 'var(--ink-paper)' : 'var(--ink-ink-soft)',
                }}>
                {f === 'all' ? 'All Comments' : 'Flagged Only'}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
            <input type="text" placeholder="Search comments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--ink-rule)', borderRadius: 2, fontSize: 13, outline: 'none', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div className="ink-card" style={{ padding: 22 }}>
        <h3 className="ink-serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 18, color: 'var(--ink-ink)' }}>
          Recent Comments ({filteredComments.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredComments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 24px' }}>
            <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>No comments found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredComments.map(comment => (
              <div key={comment._id}
                style={{ padding: 16, border: `1px solid ${comment.isFlagged ? 'var(--ink-stamp)' : 'var(--ink-rule)'}`, background: comment.isFlagged ? 'var(--ink-stamp-dim)' : 'var(--ink-paper-dim)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-stamp)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {comment.author[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-ink)' }}>{comment.author}</span>
                        {comment.isFlagged && <Badge tone="danger">Flagged</Badge>}
                        {!comment.isApproved && <Badge tone="warn">Pending</Badge>}
                      </div>
                      <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '2px 0 0' }}>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        {comment.post?.title && ` on "${comment.post.title}"`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleApprove(comment._id, comment.isApproved)}
                      title={comment.isApproved ? 'Unapprove' : 'Approve'}
                      style={{ width: 28, height: 28, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: comment.isApproved ? '#b45309' : 'var(--ink-wire-bright)' }}>
                      {comment.isApproved ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    </button>
                    <button onClick={() => handleDelete(comment._id, comment.author)} title="Delete"
                      style={{ width: 28, height: 28, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-stamp)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: 'var(--ink-ink-soft)', margin: '0 0 10px', marginLeft: 48, lineHeight: 1.6 }}>
                  {comment.content}
                </p>

                <div className="ink-mono" style={{ display: 'flex', gap: 16, marginLeft: 48, fontSize: 11, color: 'var(--ink-ink-soft)' }}>
                  <span>{comment.likes || 0} likes</span>
                  <span>{comment.dislikes || 0} dislikes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommentsManagement;