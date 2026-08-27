import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, Trash2, Flag } from 'lucide-react';
import { commentsAPI } from '../utils/api';

const AdminCommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getAll?.() || { data: { data: [] } };
      setComments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await commentsAPI.approve?.(id);
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentsAPI.delete?.(id);
      setComments(comments.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      <style>{`
        .comments-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .comments-table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden; }
        .comments-table th { background: #F1F3F5; padding: 14px; text-align: left; font-weight: 600; font-size: 12px; font-family: "IBM Plex Mono", monospace; color: #64748B; }
        .comments-table td { padding: 14px; border-bottom: 1px solid #e8e4dd; }
        .comment-author { font-weight: 600; color: #071A33; }
        .comment-text { color: #17202A; font-size: 13px; line-height: 1.5; max-width: 400px; }
        .comment-status { font-size: 11px; background: rgba(34,197,94,.1); color: #22c55e; padding: 4px 8px; border-radius: 4px; font-weight: 600; width: fit-content; }
        .comment-actions { display: flex; gap: 8px; }
        .comment-btn { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #071A33; }
        .comment-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <h1 className="comments-header">Comments Management</h1>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading...</div>
      ) : comments.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>No comments</div>
      ) : (
        <table className="comments-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Comment</th>
              <th>Post</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.slice(0, 10).map((comment) => (
              <tr key={comment._id}>
                <td className="comment-author">{comment.author || 'Anonymous'}</td>
                <td className="comment-text">{comment.text || comment.content}</td>
                <td style={{ fontSize: 12, color: '#64748B' }}>Post ID: {comment.postId?.slice(0, 8)}</td>
                <td><span className="comment-status">{comment.approved ? 'Approved' : 'Pending'}</span></td>
                <td>
                  <div className="comment-actions">
                    {!comment.approved && (
                      <button className="comment-btn" onClick={() => handleApprove(comment._id)}>
                        <Check size={14} />
                      </button>
                    )}
                    <button className="comment-btn"><Flag size={14} /></button>
                    <button className="comment-btn" onClick={() => handleDelete(comment._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCommentsManagement;