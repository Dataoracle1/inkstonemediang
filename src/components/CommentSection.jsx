

import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Trash2, 
  Send, 
  Quote,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  Edit2,
  X,
  Shield,
  MessageCircle
} from 'lucide-react';
import { commentsAPI } from '../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Comment = ({ comment, onReply, onLike, onDislike, onDelete, onQuote, onShare, onBookmark, depth = 0, allComments = [], currentUserIdentifier, isAdmin }) => {
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

  // Get direct replies to this comment
  const directReplies = allComments.filter(c => c.parentComment === comment._id);
  const replyCount = directReplies.length;

  // Check if current user owns this comment
  const isOwnComment = currentUserIdentifier && comment.userIdentifier === currentUserIdentifier;
  const canDelete = isAdmin || isOwnComment;

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyName.trim() || !replyContent.trim()) return;

    setSubmitting(true);
    await onReply(comment._id, replyName, replyContent);
    setReplyName('');
    setReplyContent('');
    setShowReplyForm(false);
    setSubmitting(false);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!quoteName.trim() || !quoteContent.trim()) return;

    setSubmitting(true);
    await onQuote(comment._id, quoteName, quoteContent);
    setQuoteName('');
    setQuoteContent('');
    setShowQuoteForm(false);
    setSubmitting(false);
  };

  const handleCopyLink = () => {
    const link = `${window.location.href}#comment-${comment._id}`;
    navigator.clipboard.writeText(link);
    showToast('Comment link copied to clipboard! 📋', 'success');
    setShowMenu(false);
  };

  const getAvatarColor = (author) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600',
      'from-indigo-400 to-indigo-600',
    ];
    const index = author.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div 
      id={`comment-${comment._id}`}
      className={`relative ${depth > 0 ? 'mt-3' : ''}`}
    >
      {/* Thread depth indicator with gradient */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 via-primary-300 to-transparent dark:from-primary-600 dark:via-primary-700 rounded-full"></div>
      )}

      <div className={`${depth > 0 ? 'ml-6' : ''} group`}>
        {/* Quoted Comment Preview */}
        {comment.quotedComment && (
          <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-700 rounded-2xl border-l-4 border-primary-500">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-6 h-6 bg-gradient-to-br ${getAvatarColor(comment.quotedComment.author)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                {comment.quotedComment.author[0].toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {comment.quotedComment.author}
              </span>
              <Quote size={14} className="text-primary-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 italic pl-8">
              "{comment.quotedComment.content}"
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-11 h-11 bg-gradient-to-br ${getAvatarColor(comment.author)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white dark:ring-dark-900 transform transition-transform group-hover:scale-110`}>
              {comment.author[0].toUpperCase()}
            </div>
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {comment.author}
                </span>
                {comment.isAdminReply && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm">
                    <Shield size={10} className="mr-1" />
                    Admin
                  </span>
                )}
                {isOwnComment && !comment.isAdminReply && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    You
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-400 italic">(edited)</span>
                )}
              </div>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-all duration-200 group/menu"
                >
                  <MoreHorizontal size={18} className="text-gray-400 group-hover/menu:text-gray-600 dark:group-hover/menu:text-gray-300" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={handleCopyLink}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center space-x-3 transition-colors"
                    >
                      <Share2 size={16} className="text-gray-500" />
                      <span className="font-medium">Copy link</span>
                    </button>
                    <button
                      onClick={() => {
                        onShare(comment);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center space-x-3 transition-colors"
                    >
                      <Share2 size={16} className="text-gray-500" />
                      <span className="font-medium">Share comment</span>
                    </button>
                    <button
                      onClick={() => {
                        showToast('Comment reported to moderators', 'info');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 text-red-600 transition-colors border-t border-gray-100 dark:border-dark-700"
                    >
                      <Flag size={16} />
                      <span className="font-medium">Report</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Like */}
              <button
                onClick={() => onLike(comment._id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  comment.hasLiked 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm' 
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600'
                }`}
              >
                <ThumbsUp size={16} fill={comment.hasLiked ? 'currentColor' : 'none'} />
                <span className="font-semibold text-sm">{comment.likes || 0}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={() => onDislike(comment._id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  comment.hasDisliked 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm' 
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
                }`}
              >
                <ThumbsDown size={16} fill={comment.hasDisliked ? 'currentColor' : 'none'} />
                <span className="font-semibold text-sm">{comment.dislikes || 0}</span>
              </button>

              {/* Reply */}
              <button
                onClick={() => {
                  setShowReplyForm(!showReplyForm);
                  setShowQuoteForm(false);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all duration-200"
              >
                <Reply size={16} />
                <span className="font-medium text-sm">Reply</span>
              </button>

              {/* Quote */}
              <button
                onClick={() => {
                  setShowQuoteForm(!showQuoteForm);
                  setShowReplyForm(false);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-all duration-200"
              >
                <Quote size={16} />
                <span className="font-medium text-sm">Quote</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => onBookmark(comment._id)}
                className={`inline-flex items-center p-1.5 rounded-full transition-all duration-200 ${
                  comment.isBookmarked 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-sm' 
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600'
                }`}
                title="Bookmark"
              >
                <Bookmark size={16} fill={comment.isBookmarked ? 'currentColor' : 'none'} />
              </button>

              {/* Delete - Only show if user owns comment or is admin */}
              {canDelete && (
                <button
                  onClick={() => onDelete(comment._id)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-200"
                  title={isAdmin ? "Delete comment (Admin)" : "Delete your comment"}
                >
                  <Trash2 size={16} />
                  {isAdmin && !isOwnComment && (
                    <Shield size={12} className="text-red-500" />
                  )}
                </button>
              )}
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <form onSubmit={handleSubmitReply} className="mt-4 space-y-3 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-400 font-medium">
                  <Reply size={14} />
                  <span>Replying to @{comment.author}</span>
                </div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  required
                />
                <textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                  rows="3"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Send size={16} />
                    <span>{submitting ? 'Posting...' : 'Reply'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Quote Form */}
            {showQuoteForm && (
              <form onSubmit={handleSubmitQuote} className="mt-4 space-y-3 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10 p-4 rounded-2xl border border-green-200 dark:border-green-800/30">
                <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-400 font-medium mb-2">
                  <Quote size={14} />
                  <span>Quoting @{comment.author}</span>
                </div>
                <div className="p-3 bg-white dark:bg-dark-800 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-5 h-5 bg-gradient-to-br ${getAvatarColor(comment.author)} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                      {comment.author[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      {comment.author}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic pl-7">
                    "{comment.content}"
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                  required
                />
                <textarea
                  placeholder="Add your thoughts..."
                  value={quoteContent}
                  onChange={(e) => setQuoteContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none resize-none"
                  rows="3"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Quote size={16} />
                    <span>{submitting ? 'Posting...' : 'Quote'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Nested Replies */}
        {replyCount > 0 && (
          <div className="mt-4 ml-6">
            {/* Collapse/Expand Button */}
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200 font-semibold text-sm mb-3"
            >
              <MessageCircle size={16} />
              <span>{showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
              <span className="text-xs">{showReplies ? '▼' : '▶'}</span>
            </button>

            {showReplies && (
              <div className="space-y-4 border-l-2 border-primary-200 dark:border-primary-800/50 pl-4">
                {directReplies.map((reply) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    onReply={onReply}
                    onLike={onLike}
                    onDislike={onDislike}
                    onDelete={onDelete}
                    onQuote={onQuote}
                    onShare={onShare}
                    onBookmark={onBookmark}
                    depth={depth + 1}
                    allComments={allComments}
                    currentUserIdentifier={currentUserIdentifier}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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

  // Get or create user identifier for tracking comment ownership
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('userIdentifier');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userIdentifier', identifier);
    }
    return identifier;
  };

  const currentUserIdentifier = getUserIdentifier();

  useEffect(() => {
    fetchComments();
    // Load saved name from localStorage
    const savedName = localStorage.getItem('commentAuthorName');
    if (savedName) setName(savedName);
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByPost(postId);
      const fetchedComments = response.data.data.comments || [];
      
      const flattenComments = (comments) => {
        const flat = [];
        const flatten = (commentList) => {
          commentList.forEach(comment => {
            flat.push(comment);
            if (comment.replies && comment.replies.length > 0) {
              flatten(comment.replies);
            }
          });
        };
        flatten(comments);
        return flat;
      };

      const allFlat = flattenComments(fetchedComments);
      setAllComments(allFlat);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      // Save name to localStorage for future comments
      localStorage.setItem('commentAuthorName', name.trim());
      
      await commentsAPI.create({
        postId,
        author: name.trim(),
        content: content.trim(),
        userIdentifier: currentUserIdentifier,
      });
      setContent('');
      await fetchComments();
      showToast('Comment posted successfully! 🎉', 'success');
    } catch (error) {
      console.error('Error posting comment:', error);
      showToast('Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentCommentId, authorName, replyContent) => {
    try {
      localStorage.setItem('commentAuthorName', authorName.trim());
      
      await commentsAPI.create({
        postId,
        author: authorName.trim(),
        content: replyContent.trim(),
        parentCommentId,
        userIdentifier: currentUserIdentifier,
      });
      await fetchComments();
      showToast('Reply posted! 💬', 'success');
    } catch (error) {
      console.error('Error posting reply:', error);
      showToast('Failed to post reply', 'error');
    }
  };

  const handleQuote = async (quotedCommentId, authorName, quoteContent) => {
    try {
      localStorage.setItem('commentAuthorName', authorName.trim());
      
      await commentsAPI.create({
        postId,
        author: authorName.trim(),
        content: quoteContent.trim(),
        quotedCommentId,
        isQuote: true,
        userIdentifier: currentUserIdentifier,
      });
      await fetchComments();
      showToast('Quote posted! 📝', 'success');
    } catch (error) {
      console.error('Error posting quote:', error);
      showToast('Failed to post quote', 'error');
    }
  };

  const handleLike = async (commentId) => {
    try {
      await commentsAPI.like(commentId);
      await fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await commentsAPI.dislike(commentId);
      await fetchComments();
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  

  const handleDelete = async (commentId) => {
  try {
    const response = await commentsAPI.delete(commentId);
    await fetchComments();
    
    if (response.data.data?.deletedBy === 'admin') {
      showToast(`Comment deleted by admin${response.data.data.totalDeleted > 1 ? ` (${response.data.data.totalDeleted} total including replies)` : ''} 🗑️`, 'success');
    } else {
      showToast('Comment deleted successfully! 🗑️', 'success');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    const errorMsg = error.response?.data?.message || 'Failed to delete comment';
    showToast(errorMsg, 'error');
  }
};

  const handleShare = (comment) => {
    const text = `Check out this comment by ${comment.author}: "${comment.content}"`;
    if (navigator.share) {
      navigator.share({
        title: 'Share Comment',
        text: text,
        url: `${window.location.href}#comment-${comment._id}`
      });
    } else {
      navigator.clipboard.writeText(text);
      showToast('Comment copied to clipboard!', 'success');
    }
  };

  const handleBookmark = (commentId) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedComments') || '[]');
    const index = bookmarks.indexOf(commentId);
    
    if (index > -1) {
      bookmarks.splice(index, 1);
      showToast('Bookmark removed', 'info');
    } else {
      bookmarks.push(commentId);
      showToast('Comment bookmarked! 🔖', 'success');
    }
    
    localStorage.setItem('bookmarkedComments', JSON.stringify(bookmarks));
    fetchComments();
  };

  const getSortedComments = () => {
    let sorted = [...comments];
    
    if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'controversial') {
      sorted.sort((a, b) => {
        const aScore = Math.abs((a.likes || 0) - (a.dislikes || 0));
        const bScore = Math.abs((b.likes || 0) - (b.dislikes || 0));
        return bScore - aScore;
      });
    }
    
    return sorted;
  };

  const displayedComments = getSortedComments();
  const totalComments = allComments.length;

  return (
    <div className="mt-16">
     
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <MessageCircle size={28} className="text-primary-500" />
          <h3 className="text-3xl font-heading font-bold">
            Comments <span className="text-gray-500 text-2xl">({totalComments})</span>
          </h3>
        </div>
        
       
        <div className="flex gap-2 bg-gray-100 dark:bg-dark-800 p-1 rounded-xl">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              sortBy === 'recent'
                ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              sortBy === 'popular'
                ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setSortBy('controversial')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              sortBy === 'controversial'
                ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Controversial
          </button>
        </div>
      </div>

     
      <form onSubmit={handleSubmitComment} className="mb-10 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-700 p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-dark-700">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
            {name ? name[0].toUpperCase() : '?'}
          </div>
          <div className="flex-1 space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium"
              required
            />
            <textarea
              placeholder="What are your thoughts?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none resize-none"
              rows="4"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <Send size={18} />
                <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

     
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-500 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white dark:from-dark-800 dark:to-dark-700 rounded-3xl border-2 border-dashed border-gray-300 dark:border-dark-600">
          <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold mb-2">
            No comments yet
          </p>
          <p className="text-sm text-gray-400">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedComments.map((comment) => (
            <div key={comment._id} className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-dark-700">
              <Comment
                comment={comment}
                onReply={handleReply}
                onLike={handleLike}
                onDislike={handleDislike}
                onDelete={handleDelete}
                onQuote={handleQuote}
                onShare={handleShare}
                onBookmark={handleBookmark}
                allComments={allComments}
                currentUserIdentifier={currentUserIdentifier}
                isAdmin={isAuthenticated}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;