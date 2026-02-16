

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Calendar, Eye, Heart, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
// import { postsAPI } from '../utils/api';
// import CommentSection from '../components/CommentSection';
// import TrendingPost from '../components/TrendingPost';
// import { formatDistanceToNow } from 'date-fns';

// const NewsDetail = () => {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [trendingPosts, setTrendingPosts] = useState([]);

//   useEffect(() => {
//     fetchPost();
//     fetchTrending();
//   }, [id]);

//   const fetchPost = async () => {
//     try {
//       setLoading(true);
//       const response = await postsAPI.getOne(id);
//       setPost(response.data.data.post);
      
     
//       const userIdentifier = localStorage.getItem('userIdentifier');
//       if (userIdentifier && response.data.data.post.likedBy?.includes(userIdentifier)) {
//         setHasLiked(true);
//       }
//     } catch (error) {
//       console.error('Error fetching post:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTrending = async () => {
//     try {
//       const response = await postsAPI.getTrending(5);
//       setTrendingPosts(response.data.data.posts);
//     } catch (error) {
//       console.error('Error fetching trending:', error);
//     }
//   };

//   const handleLike = async () => {
//     try {
//       const response = await postsAPI.like(id);
//       setPost({ ...post, likes: response.data.data.likes });
//       setHasLiked(response.data.data.hasLiked);
//     } catch (error) {
//       console.error('Error liking post:', error);
//     }
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: post.title,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   const getYouTubeEmbedUrl = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11
//       ? `https://www.youtube.com/embed/${match[2]}`
//       : null;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <h2 className="text-2xl font-bold">Post not found</h2>
//         <Link to="/" className="btn-primary mt-4">Go Home</Link>
//       </div>
//     );
//   }

//   const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
//   const embedUrl = getYouTubeEmbedUrl(post.videoUrl);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Link
//         to="/"
//         className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 mb-6 transition"
//       >
//         <ArrowLeft size={20} />
//         <span>Back to Home</span>
//       </Link>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         <div className="lg:col-span-2">
//           <article className="card p-8">
           
//             <span className="badge bg-primary-500 text-white mb-4">
//               {post.category}
//             </span>

         
//             <h1 className="text-4xl font-heading font-bold mb-4">
//               {post.title}
//             </h1>

          
//             <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-dark-700 mb-6">
//               <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
//                 <span className="flex items-center space-x-1">
//                   <Calendar size={16} />
//                   <span>{timeAgo}</span>
//                 </span>
//                 <span className="flex items-center space-x-1">
//                   <Eye size={16} />
//                   <span>{post.views} views</span>
//                 </span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={handleLike}
//                   className={`flex items-center space-x-1 ${
//                     hasLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
//                   } hover:text-red-500 transition`}
//                 >
//                   <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
//                   <span>{post.likes}</span>
//                 </button>
//                 <button
//                   onClick={handleShare}
//                   className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition"
//                 >
//                   <Share2 size={20} />
//                 </button>
//               </div>
//             </div>

          
//             <img
//               src={post.image}
//               alt={post.title}
//               className="w-full h-96 object-cover rounded-lg mb-6"
//             />

           
//             {embedUrl && (
//               <div className="mb-6">
//                 <div className="relative pb-[56.25%] h-0">
//                   <iframe
//                     src={embedUrl}
//                     className="absolute top-0 left-0 w-full h-full rounded-lg"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   ></iframe>
//                 </div>
//                 {post.videoLink && (
//                   <a
//                     href={post.videoLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center space-x-2 mt-4 text-primary-500 hover:text-primary-600 transition"
//                   >
//                     <ExternalLink size={16} />
//                     <span>Watch Full Video</span>
//                   </a>
//                 )}
//               </div>
//             )}

         
//             <div 
//               className="prose prose-lg dark:prose-invert max-w-none mb-8 
//                 prose-headings:font-heading prose-headings:font-bold
//                 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
//                 prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
//                 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-dark-800
//                 prose-code:bg-gray-100 dark:prose-code:bg-dark-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
//                 prose-img:rounded-lg prose-img:shadow-md
//                 prose-p:leading-relaxed prose-p:mb-4
//                 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
//                 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
//                 prose-li:mb-2"
//               dangerouslySetInnerHTML={{ __html: post.content }}
//             />

            
//             {post.tags && post.tags.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-8">
//                 {post.tags.map((tag) => (
//                   <span key={tag} className="badge badge-primary">
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             )}

           
//             <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
//               <p className="text-sm font-semibold mb-3">Share this article:</p>
//               <div className="flex space-x-3">
//                 <button className="btn-outline text-sm">Facebook</button>
//                 <button className="btn-outline text-sm">Twitter</button>
//                 <button className="btn-outline text-sm">WhatsApp</button>
//                 <button onClick={handleShare} className="btn-outline text-sm">
//                   Copy Link
//                 </button>
//               </div>
//             </div>
//           </article>

//           <CommentSection postId={post._id} />
//         </div>

//         <div className="lg:col-span-1">
//           <div className="sticky top-24">
         
//             <div className="card p-6">
//               <h3 className="text-xl font-heading font-bold mb-4 flex items-center">
//                 <span className="w-1 h-6 bg-primary-500 mr-3" />
//                 Trending Posts
//               </h3>
//               <div className="space-y-4">
//                 {trendingPosts.filter(p => p._id !== post._id).slice(0, 5).map((tPost) => (
//                   <TrendingPost key={tPost._id} post={tPost} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsDetail;



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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Mobile-optimized container */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Back button - mobile optimized */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 mb-4 sm:mb-6 transition text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <article className="card p-4 sm:p-6 lg:p-8">
              {/* Category Badge */}
              <span className="badge bg-primary-500 text-white mb-3 sm:mb-4 text-xs sm:text-sm inline-block">
                {post.category}
              </span>

              {/* Title - mobile optimized */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-3 sm:mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information - mobile responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-y border-gray-200 dark:border-dark-700 mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                    <span>{timeAgo}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    <span>{post.views} views</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 ${
                      hasLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                    } hover:text-red-500 transition text-sm sm:text-base`}
                  >
                    <Heart size={18} className="sm:w-5 sm:h-5" fill={hasLiked ? 'currentColor' : 'none'} />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition"
                  >
                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Featured Image - mobile optimized */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-lg mb-4 sm:mb-6"
              />

              {/* Video Embed - mobile optimized */}
              {embedUrl && (
                <div className="mb-4 sm:mb-6">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={embedUrl}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
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
                      <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                      <span>Watch Full Video</span>
                    </a>
                  )}
                </div>
              )}

              {/* Article Content - mobile optimized prose */}
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none mb-6 sm:mb-8 
                  prose-headings:font-heading prose-headings:font-bold
                  prose-h1:text-2xl sm:prose-h1:text-3xl 
                  prose-h2:text-xl sm:prose-h2:text-2xl 
                  prose-h3:text-lg sm:prose-h3:text-xl
                  prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-dark-800
                  prose-code:bg-gray-100 dark:prose-code:bg-dark-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm
                  prose-img:rounded-lg prose-img:shadow-md
                  prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 prose-p:text-sm sm:prose-p:text-base
                  prose-ul:list-disc prose-ul:ml-4 sm:prose-ul:ml-6 prose-ul:mb-3 sm:prose-ul:mb-4
                  prose-ol:list-decimal prose-ol:ml-4 sm:prose-ol:ml-6 prose-ol:mb-3 sm:prose-ol:mb-4
                  prose-li:mb-1 sm:prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags - mobile optimized */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary text-xs sm:text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Section - mobile optimized */}
              <div className="border-t border-gray-200 dark:border-dark-700 pt-4 sm:pt-6">
                <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Share this article:</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">Facebook</button>
                  <button className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">Twitter</button>
                  <button className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">WhatsApp</button>
                  <button onClick={handleShare} className="btn-outline text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                    Copy Link
                  </button>
                </div>
              </div>
            </article>

            {/* Comments Section - mobile optimized */}
            <div className="mt-4 sm:mt-6">
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* Sidebar - mobile optimized */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="card p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold mb-3 sm:mb-4 flex items-center">
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
      </div>
    </div>
  );
};

export default NewsDetail;