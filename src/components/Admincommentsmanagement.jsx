import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Eye, Flag, CheckCircle, XCircle, Search } from 'lucide-react';
import { commentsAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { formatDistanceToNow } from 'date-fns';

const AdminCommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [filter]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const response = await commentsAPI.getStats();
      const recentComments = response.data.data.recentComments || [];
      setComments(recentComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      showToast('Failed to fetch comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await commentsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (commentId, commentAuthor) => {
    if (!confirm(`Are you sure you want to delete this comment by ${commentAuthor}?`)) return;

    try {
      await commentsAPI.delete(commentId);
      showToast('Comment deleted successfully', 'success');
      fetchComments();
      fetchStats();
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleApprove = async (commentId, currentStatus) => {
    try {
      await commentsAPI.approve(commentId, !currentStatus);
      showToast(`Comment ${!currentStatus ? 'approved' : 'unapproved'}`, 'success');
      fetchComments();
      fetchStats();
    } catch (error) {
      console.error('Error updating comment:', error);
      showToast('Failed to update comment', 'error');
    }
  };

  const filteredComments = comments.filter(comment => {
    if (searchQuery) {
      return (
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filter === 'flagged') {
      return comment.isFlagged;
    }
    return true;
  });

  return (
    <div>
     
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Comments</p>
                <p className="text-3xl font-bold">{stats.totalComments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-3xl font-bold">{stats.approvedComments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold">{stats.pendingComments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Eye className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
                <p className="text-3xl font-bold">{stats.flaggedComments}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Flag className="text-red-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Comments
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'flagged'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Flagged Only
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-heading font-bold mb-4">
          Recent Comments ({filteredComments.length})
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No comments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment._id}
                className={`p-4 rounded-lg border transition ${
                  comment.isFlagged
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {comment.author[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {comment.author}
                        </span>
                        {comment.isFlagged && (
                          <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                            Flagged
                          </span>
                        )}
                        {!comment.isApproved && (
                          <span className="badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        {comment.post?.title && ` • on "${comment.post.title}"`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(comment._id, comment.isApproved)}
                      className={`p-2 rounded transition ${
                        comment.isApproved
                          ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600'
                          : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600'
                      }`}
                      title={comment.isApproved ? 'Unapprove' : 'Approve'}
                    >
                      {comment.isApproved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id, comment.author)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 ml-13">
                  {comment.content}
                </p>

                <div className="flex items-center space-x-4 mt-3 ml-13 text-sm text-gray-500 dark:text-gray-400">
                  <span>👍 {comment.likes || 0} likes</span>
                  <span>👎 {comment.dislikes || 0} dislikes</span>
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