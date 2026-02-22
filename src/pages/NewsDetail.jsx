
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Calendar, Eye, Heart, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
// import { postsAPI } from '../utils/api';
// import CommentSection from '../components/CommentSection';
// import TrendingPost from '../components/TrendingPost';
// import { formatDistanceToNow } from 'date-fns';

// const NewsDetail = () => {
//   // param is now "slug" to match the route /news/:slug
//   const { slug } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [trendingPosts, setTrendingPosts] = useState([]);

//   useEffect(() => { fetchPost(); fetchTrending(); }, [slug]);

//   const fetchPost = async () => {
//     try {
//       setLoading(true);
//       // Backend already handles both _id and slug via $or query — no change needed there
//       const response = await postsAPI.getOne(slug);
//       setPost(response.data.data.post);
//       const userIdentifier = localStorage.getItem('userIdentifier');
//       if (userIdentifier && response.data.data.post.likedBy?.includes(userIdentifier)) {
//         setHasLiked(true);
//       }
//     } catch (error) {
//       console.error('Error fetching post:', error);
//     } finally { setLoading(false); }
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
//       // Like by _id (post._id) for reliability after we've already fetched the post
//       const response = await postsAPI.like(post._id);
//       setPost({ ...post, likes: response.data.data.likes });
//       setHasLiked(response.data.data.hasLiked);
//     } catch (error) {
//       console.error('Error liking post:', error);
//     }
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({ title: post.title, url: window.location.href });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   const getYouTubeEmbedUrl = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
//   };

//   if (loading) return (
//     <div style={{ fontFamily: 'DM Sans,sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <div style={{ width: 48, height: 48, border: '3px solid #dcfce7', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
//     </div>
//   );

//   if (!post) return (
//     <div style={{ fontFamily: 'DM Sans,sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ fontSize: 64, marginBottom: 20 }}>📰</div>
//         <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f1a12', marginBottom: 16, fontFamily: "'Playfair Display',serif" }}>Post not found</h2>
//         <Link to="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#16a34a', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(22,163,74,.3)' }}>
//           Go Home
//         </Link>
//       </div>
//     </div>
//   );

//   const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
//   const embedUrl = getYouTubeEmbedUrl(post.videoUrl);

//   return (
//     <div className="bg-gray-50 dark:bg-gray-950" style={{ fontFamily: "'DM Sans',sans-serif", minHeight: '100vh' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
//         @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }

//         .share-btn {
//           padding: 8px 18px; border-radius: 10px; border: 1.5px solid #e5e7eb;
//           background: white; font-size: 13px; font-weight: 700; color: #374151;
//           cursor: pointer; transition: .2s; font-family: 'DM Sans',sans-serif; white-space: nowrap;
//         }
//         .share-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }

//         .article-content { font-size: 17px; line-height: 1.8; color: #374151; }
//         .article-content h1 { font-size: 32px; font-weight: 800; margin: 32px 0 16px; color: #0f1a12; font-family: 'Playfair Display',serif; }
//         .article-content h2 { font-size: 26px; font-weight: 800; margin: 28px 0 14px; color: #0f1a12; font-family: 'Playfair Display',serif; }
//         .article-content h3 { font-size: 22px; font-weight: 800; margin: 24px 0 12px; color: #0f1a12; font-family: 'Playfair Display',serif; }
//         .article-content p { margin-bottom: 16px; }
//         .article-content a { color: #16a34a; text-decoration: none; font-weight: 600; }
//         .article-content a:hover { text-decoration: underline; }
//         .article-content ul, .article-content ol { margin: 16px 0; padding-left: 28px; }
//         .article-content li { margin-bottom: 8px; }
//         .article-content img { border-radius: 16px; margin: 24px 0; max-width: 100%; height: auto; }
//         .article-content blockquote { border-left: 4px solid #16a34a; padding: 12px 20px; background: #f9fafb; margin: 20px 0; border-radius: 8px; font-style: italic; }
//         .article-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 15px; }

//         /* Dark mode article content */
//         .dark .article-content { color: #d1d5db; }
//         .dark .article-content h1, .dark .article-content h2, .dark .article-content h3 { color: #f9fafb; }
//         .dark .article-content blockquote { background: #1f2937; }
//         .dark .article-content code { background: #1f2937; color: #d1fae5; }
//         .dark .share-btn { background: #1f2937; border-color: #374151; color: #d1d5db; }
//         .dark .share-btn:hover { border-color: #16a34a; color: #16a34a; background: #052e16; }

//         @media(max-width:1024px){ .two-col { grid-template-columns: 1fr !important; } }
//       `}</style>

//       <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>

//         {/* Back Button */}
//         <Link to="/"
//           className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
//           style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', marginBottom: 24, transition: '.2s' }}
//           onMouseEnter={e => e.currentTarget.style.gap = '12px'}
//           onMouseLeave={e => e.currentTarget.style.gap = '8px'}
//         >
//           <ArrowLeft size={18} />
//           Back to Home
//         </Link>

//         <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>

//           {/* Main Article */}
//           <div style={{ animation: 'fadeUp .4s ease' }}>
//             <article className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
//               style={{ borderRadius: 24, padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,.07)' }}>

//               {/* Category Badge */}
//               <span style={{ display: 'inline-block', padding: '6px 16px', background: '#16a34a', color: 'white', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: .5 }}>
//                 {post.category}
//               </span>

//               {/* Title */}
//               <h1 className="text-gray-900 dark:text-white"
//                 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>
//                 {post.title}
//               </h1>

//               {/* Slug display — helps users see the clean URL */}
//               {post.slug && (
//                 <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, fontFamily: 'monospace', letterSpacing: .3 }}>
//                   /news/{post.slug}
//                 </p>
//               )}

//               {/* Meta Bar */}
//               <div className="border-gray-100 dark:border-gray-800"
//                 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTopWidth: 1, borderBottomWidth: 1, borderStyle: 'solid', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
//                 <div className="text-gray-500 dark:text-gray-400" style={{ display: 'flex', gap: 20, fontSize: 14 }}>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} />{timeAgo}</span>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={16} />{post.views} views</span>
//                 </div>
//                 <div style={{ display: 'flex', gap: 16 }}>
//                   <button onClick={handleLike}
//                     style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: hasLiked ? '#ef4444' : '#6b7280', transition: '.2s' }}
//                     onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
//                     onMouseLeave={e => e.currentTarget.style.color = hasLiked ? '#ef4444' : '#6b7280'}>
//                     <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
//                     {post.likes}
//                   </button>
//                   <button onClick={handleShare}
//                     className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
//                     style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, transition: '.2s' }}>
//                     <Share2 size={20} />
//                   </button>
//                 </div>
//               </div>

//               {/* Featured Image */}
//               <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 28 }}>
//                 <img src={post.image} alt={post.title} style={{ width: '100%', height: 400, objectFit: 'cover' }} />
//               </div>

//               {/* Video Embed */}
//               {embedUrl && (
//                 <div style={{ marginBottom: 28 }}>
//                   <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 16 }}>
//                     <iframe src={embedUrl}
//                       style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen />
//                   </div>
//                   {post.videoLink && (
//                     <a href={post.videoLink} target="_blank" rel="noopener noreferrer"
//                       style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#16a34a', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
//                       <ExternalLink size={16} />Watch Full Video
//                     </a>
//                   )}
//                 </div>
//               )}

//               {/* Article Content */}
//               <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

//               {/* Tags */}
//               {post.tags?.length > 0 && (
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, paddingTop: 24, borderTop: '1px solid #f3f4f6' }}>
//                   {post.tags.map(tag => (
//                     <span key={tag} style={{ padding: '6px 14px', background: '#f0fdf4', color: '#16a34a', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               {/* Share Buttons */}
//               <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #f3f4f6' }}>
//                 <p className="text-gray-700 dark:text-gray-300" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: .5 }}>
//                   Share this article:
//                 </p>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//                   <button className="share-btn" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>Facebook</button>
//                   <button className="share-btn" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}>Twitter</button>
//                   <button className="share-btn" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}>WhatsApp</button>
//                   <button className="share-btn" onClick={handleShare}>Copy Link</button>
//                 </div>
//               </div>
//             </article>

//             {/* Comments */}
//             <div style={{ marginTop: 24 }}>
//               <CommentSection postId={post._id} />
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div style={{ animation: 'fadeUp .4s ease .1s both' }}>
//             <div style={{ position: 'sticky', top: 100 }}>
//               <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
//                 style={{ borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,.07)' }}>
//                 <h3 className="text-gray-900 dark:text-white"
//                   style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, fontFamily: "'Playfair Display',serif", display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <span style={{ width: 4, height: 24, background: '#16a34a', borderRadius: 100 }} />
//                   Trending Posts
//                 </h3>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                   {trendingPosts.filter(p => p._id !== post._id).slice(0, 5).map(tPost => (
//                     <TrendingPost key={tPost._id} post={tPost} />
//                   ))}
//                 </div>
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
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => { fetchPost(); fetchTrending(); }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getOne(slug);
      setPost(response.data.data.post);
      const userIdentifier = localStorage.getItem('userIdentifier');
      if (userIdentifier && response.data.data.post.likedBy?.includes(userIdentifier)) {
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally { setLoading(false); }
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
      const response = await postsAPI.like(post._id);
      setPost({ ...post, likes: response.data.data.likes });
      setHasLiked(response.data.data.hasLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) return (
    <div style={{ fontFamily: 'DM Sans,sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 48, height: 48, border: '3px solid #dcfce7', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!post) return (
    <div style={{ fontFamily: 'DM Sans,sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>📰</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f1a12', marginBottom: 16, fontFamily: "'Playfair Display',serif" }}>Post not found</h2>
        <Link to="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#16a34a', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 12px rgba(22,163,74,.3)' }}>
          Go Home
        </Link>
      </div>
    </div>
  );

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const embedUrl = getYouTubeEmbedUrl(post.videoUrl);

  return (
    <div className="bg-gray-50 dark:bg-gray-950" style={{ fontFamily: "'DM Sans',sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }

        .share-btn {
          padding: 8px 18px; border-radius: 10px; border: 1.5px solid #e5e7eb;
          background: white; font-size: 13px; font-weight: 700; color: #374151;
          cursor: pointer; transition: .2s; font-family: 'DM Sans',sans-serif; white-space: nowrap;
        }
        .share-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }

        .article-content { font-size: 17px; line-height: 1.8; color: #374151; }
        .article-content h1 { font-size: 32px; font-weight: 800; margin: 32px 0 16px; color: #0f1a12; font-family: 'Playfair Display',serif; }
        .article-content h2 { font-size: 26px; font-weight: 800; margin: 28px 0 14px; color: #0f1a12; font-family: 'Playfair Display',serif; }
        .article-content h3 { font-size: 22px; font-weight: 800; margin: 24px 0 12px; color: #0f1a12; font-family: 'Playfair Display',serif; }
        .article-content p { margin-bottom: 16px; }
        .article-content a { color: #16a34a; text-decoration: none; font-weight: 600; }
        .article-content a:hover { text-decoration: underline; }
        .article-content ul, .article-content ol { margin: 16px 0; padding-left: 28px; }
        .article-content li { margin-bottom: 8px; }
        .article-content img { border-radius: 16px; margin: 24px 0; max-width: 100%; height: auto; }
        .article-content blockquote { border-left: 4px solid #16a34a; padding: 12px 20px; background: #f9fafb; margin: 20px 0; border-radius: 8px; font-style: italic; }
        .article-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 15px; }

        .dark .article-content { color: #d1d5db; }
        .dark .article-content h1, .dark .article-content h2, .dark .article-content h3 { color: #f9fafb; }
        .dark .article-content blockquote { background: #1f2937; }
        .dark .article-content code { background: #1f2937; color: #d1fae5; }
        .dark .share-btn { background: #1f2937; border-color: #374151; color: #d1d5db; }
        .dark .share-btn:hover { border-color: #16a34a; color: #16a34a; background: #052e16; }

        /* ── Mobile overrides ── */
        @media (max-width: 768px) {
          .news-detail-wrapper { padding: 0 !important; }
          .news-detail-back { padding: 16px 16px 0 !important; margin-bottom: 16px !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 0 !important; }
          .article-card { border-radius: 0 !important; padding: 16px !important; box-shadow: none !important; border-left: none !important; border-right: none !important; }
          .article-featured-image { border-radius: 0 !important; margin-left: -16px !important; margin-right: -16px !important; width: calc(100% + 32px) !important; }
          .article-featured-image img { width: 100% !important; height: auto !important; max-height: none !important; object-fit: contain !important; display: block !important; }
          .article-title { font-size: clamp(22px, 5vw, 32px) !important; }
          .article-content { font-size: 15px !important; }
          .article-content h1 { font-size: 24px !important; }
          .article-content h2 { font-size: 20px !important; }
          .article-content h3 { font-size: 18px !important; }
          .sidebar { display: none !important; }
          .comments-wrapper { padding: 0 16px 24px !important; }
          .share-btn { font-size: 12px !important; padding: 7px 13px !important; }
          .meta-bar { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .two-col { grid-template-columns: 1fr !important; }
          .sidebar { display: block !important; }
        }

        @media (min-width: 1025px) {
          .two-col { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>

      <div className="news-detail-wrapper" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>

        {/* Back Button */}
        <div className="news-detail-back">
          <Link to="/"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', marginBottom: 24, transition: '.2s' }}
            onMouseEnter={e => e.currentTarget.style.gap = '12px'}
            onMouseLeave={e => e.currentTarget.style.gap = '8px'}
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

        <div className="two-col" style={{ display: 'grid', gap: 32 }}>

          {/* Main Article */}
          <div style={{ animation: 'fadeUp .4s ease', minWidth: 0 }}>
            <article className="article-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              style={{ borderRadius: 24, padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,.07)' }}>

              {/* Category Badge */}
              <span style={{ display: 'inline-block', padding: '6px 16px', background: '#16a34a', color: 'white', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: .5 }}>
                {post.category}
              </span>

              {/* Title */}
              <h1 className="article-title text-gray-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>
                {post.title}
              </h1>

              {/* ── Slug deliberately removed ── */}

              {/* Meta Bar */}
              <div className="meta-bar border-gray-100 dark:border-gray-800"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTopWidth: 1, borderBottomWidth: 1, borderStyle: 'solid', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div className="text-gray-500 dark:text-gray-400" style={{ display: 'flex', gap: 16, fontSize: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} />{timeAgo}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={16} />{post.views} views</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={handleLike}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: hasLiked ? '#ef4444' : '#6b7280', transition: '.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = hasLiked ? '#ef4444' : '#6b7280'}>
                    <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
                    {post.likes}
                  </button>
                  <button onClick={handleShare}
                    className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, transition: '.2s' }}>
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Featured Image — full image visible, no crop on mobile */}
              <div className="article-featured-image" style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 28, background: '#000' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: 'auto', maxHeight: 480, objectFit: 'contain', display: 'block' }}
                />
              </div>

              {/* Video Embed */}
              {embedUrl && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 16 }}>
                    <iframe src={embedUrl}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen />
                  </div>
                  {post.videoLink && (
                    <a href={post.videoLink} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#16a34a', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                      <ExternalLink size={16} />Watch Full Video
                    </a>
                  )}
                </div>
              )}

              {/* Article Content */}
              <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, paddingTop: 24, borderTop: '1px solid #f3f4f6' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ padding: '6px 14px', background: '#f0fdf4', color: '#16a34a', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #f3f4f6' }}>
                <p className="text-gray-700 dark:text-gray-300" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: .5 }}>
                  Share this article:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button className="share-btn" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>Facebook</button>
                  <button className="share-btn" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}>Twitter</button>
                  <button className="share-btn" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}>WhatsApp</button>
                  <button className="share-btn" onClick={handleShare}>Copy Link</button>
                </div>
              </div>
            </article>

            {/* Comments */}
            <div className="comments-wrapper" style={{ marginTop: 24 }}>
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar" style={{ animation: 'fadeUp .4s ease .1s both' }}>
            <div style={{ position: 'sticky', top: 100 }}>
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                style={{ borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,.07)' }}>
                <h3 className="text-gray-900 dark:text-white"
                  style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, fontFamily: "'Playfair Display',serif", display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 4, height: 24, background: '#16a34a', borderRadius: 100 }} />
                  Trending Posts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {trendingPosts.filter(p => p._id !== post._id).slice(0, 5).map(tPost => (
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