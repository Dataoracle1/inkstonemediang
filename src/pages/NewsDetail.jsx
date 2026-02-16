

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, Heart, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
import { postsAPI } from '../utils/api';
import CommentSection from '../components/CommentSection';
import TrendingPost from '../components/TrendingPost';
import { formatDistanceToNow } from 'date-fns';

const NewsDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    fetchPost();
    fetchTrending();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getOne(id);
      setPost(response.data.data.post);
      
      const userIdentifier = localStorage.getItem('userIdentifier');
      if (userIdentifier && response.data.data.post.likedBy?.includes(userIdentifier)) {
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await postsAPI.getTrending(5);
      setTrendingPosts(response.data.data.posts);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await postsAPI.like(id);
      setPost({ ...post, likes: response.data.data.likes });
      setHasLiked(response.data.data.hasLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link to="/" className="btn-primary mt-4">Go Home</Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const embedUrl = getYouTubeEmbedUrl(post.videoUrl);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
    
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 py-4 sm:py-8">
   
        <div className="px-4 sm:px-0 mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">
     
          <div className="w-full lg:col-span-2">
            <article className="card rounded-none sm:rounded-lg p-4 sm:p-6 lg:p-8 overflow-hidden">
             
              <span className="inline-block badge bg-primary-500 text-white mb-3 sm:mb-4">
                {post.category}
              </span>

             
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-3 sm:mb-4 leading-tight break-words">
                {post.title}
              </h1>

             
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-y border-gray-200 dark:border-dark-700 mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{timeAgo}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{post.views} views</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 ${
                      hasLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                    } hover:text-red-500 transition`}
                  >
                    <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
                    <span className="text-sm sm:text-base">{post.likes}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="w-full mb-4 sm:mb-6 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-lg"
                />
              </div>

             
              {embedUrl && (
                <div className="w-full mb-4 sm:mb-6">
                  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                    <iframe
                      src={embedUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {post.videoLink && (
                    <a
                      href={post.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 mt-3 sm:mt-4 text-primary-500 hover:text-primary-600 transition text-sm sm:text-base"
                    >
                      <ExternalLink size={16} />
                      <span>Watch Full Video</span>
                    </a>
                  )}
                </div>
              )}

              <div 
            className="prose prose-base sm:prose-lg lg:prose-xl dark:prose-invert max-w-none mb-6 sm:mb-8 break-words
              prose-headings:font-heading prose-headings:font-bold prose-headings:break-words
              prose-h1:text-3xl sm:prose-h1:text-4xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl sm:prose-h3:text-2xl
              prose-a:text-primary-500 prose-a:no-underline prose-a:break-words hover:prose-a:underline
              prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-dark-800
              prose-code:bg-gray-100 dark:prose-code:bg-dark-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:break-words
              prose-img:rounded-lg prose-img:shadow-md prose-img:max-w-full
              prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 prose-p:text-base sm:prose-p:text-lg
              prose-ul:list-disc prose-ul:ml-4 sm:prose-ul:ml-6 prose-ul:mb-3 sm:prose-ul:mb-4
              prose-ol:list-decimal prose-ol:ml-4 sm:prose-ol:ml-6 prose-ol:mb-3 sm:prose-ol:mb-4
              prose-li:mb-2 prose-li:text-base sm:prose-li:text-lg
              prose-table:overflow-x-auto prose-table:block
              [&_*]:max-w-full [&_img]:w-full [&_img]:h-auto"
               dangerouslySetInnerHTML={{ __html: post.content }}
             />

            
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary text-xs sm:text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

            
              <div className="border-t border-gray-200 dark:border-dark-700 pt-4 sm:pt-6">
                <p className="text-xs sm:text-sm font-semibold mb-3">Share this article:</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap">Facebook</button>
                  <button className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap">Twitter</button>
                  <button className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap">WhatsApp</button>
                  <button onClick={handleShare} className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap">
                    Copy Link
                  </button>
                </div>
              </div>
            </article>

          
            <div className="mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-0">
              <CommentSection postId={post._id} />
            </div>
          </div>

         
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="card p-6">
                <h3 className="text-xl font-heading font-bold mb-4 flex items-center">
                  <span className="w-1 h-6 bg-primary-500 mr-3" />
                  Trending Posts
                </h3>
                <div className="space-y-4">
                  {trendingPosts.filter(p => p._id !== post._id).slice(0, 5).map((tPost) => (
                    <TrendingPost key={tPost._id} post={tPost} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-6">
          <div className="card p-4 sm:p-6 rounded-none sm:rounded-lg mx-4 sm:mx-0">
            <h3 className="text-lg sm:text-xl font-heading font-bold mb-4 flex items-center">
              <span className="w-1 h-5 sm:h-6 bg-primary-500 mr-2 sm:mr-3" />
              Trending Posts
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {trendingPosts.filter(p => p._id !== post._id).slice(0, 5).map((tPost) => (
                <TrendingPost key={tPost._id} post={tPost} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;