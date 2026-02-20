

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Calendar, Eye, Heart } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// const NewsCard = ({ post, featured = false }) => {
//   const { _id, slug, title, excerpt, image, category, createdAt, views = 0, likes = 0 } = post;

//   // Use slug if available, fall back to _id for any older posts that predate slugs
//   const postUrl = `/news/${slug || _id}`;

//   const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

//   if (featured) {
//     return (
//       <Link to={postUrl} style={{ textDecoration: 'none', display: 'block' }}>
//         <div
//           style={{ position: 'relative', height: 480, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.12)', transition: '.3s' }}
//           onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
//           onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//         >
//           <img src={image} alt={title}
//             style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
//             onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
//             onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
//           />
//           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.4) 50%, transparent 100%)' }} />
//           <span style={{ position: 'absolute', top: 20, left: 20, padding: '6px 16px', background: '#16a34a', color: 'white', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: .5, zIndex: 2 }}>
//             {category}
//           </span>
//           <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28, zIndex: 2 }}>
//             <h2
//               style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12, lineHeight: 1.3, transition: '.2s' }}
//               onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
//               onMouseLeave={e => e.currentTarget.style.color = 'white'}
//             >
//               {title}
//             </h2>
//             <p style={{ color: 'rgba(255,255,255,.9)', marginBottom: 16, fontSize: 15, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//               {excerpt}
//             </p>
//             <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>
//               <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={14} />{timeAgo}</span>
//               <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Eye size={14} />{views}</span>
//               <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Heart size={14} />{likes}</span>
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   return (
//     <Link to={postUrl} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
//       <div
//         className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
//         style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)', height: '100%', display: 'flex', flexDirection: 'column', transition: '.2s' }}
//         onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
//         onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)'; }}
//       >
//         <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
//           <img src={image} alt={title}
//             style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
//             onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
//             onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
//           />
//           <span style={{ position: 'absolute', top: 12, left: 12, padding: '5px 12px', background: '#16a34a', color: 'white', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: .4 }}>
//             {category}
//           </span>
//         </div>
//         <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
//           <h3
//             className="text-gray-900 dark:text-white"
//             style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, marginBottom: 10, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: '.2s' }}
//             onMouseEnter={e => e.currentTarget.style.color = '#16a34a'}
//             onMouseLeave={e => e.currentTarget.style.color = ''}
//           >
//             {title}
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//             {excerpt}
//           </p>
//           <div className="text-gray-400 dark:text-gray-500" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 600 }}>
//             <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} />{timeAgo}</span>
//             <div style={{ display: 'flex', gap: 12 }}>
//               <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={12} />{views}</span>
//               <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={12} />{likes}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default NewsCard;



import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ post, featured = false, isDark = false }) => {
  const { _id, slug, title, excerpt, image, category, createdAt, views = 0, likes = 0 } = post;

  const postUrl = `/news/${slug || _id}`;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  if (featured) {
    return (
      <Link to={postUrl} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
        <div
          style={{ position: 'relative', height: 480, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.12)', transition: '.3s', width: '100%' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <img src={image} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.4) 50%, transparent 100%)' }} />
          <span style={{ position: 'absolute', top: 20, left: 20, padding: '6px 16px', background: '#16a34a', color: 'white', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: .5, zIndex: 2 }}>
            {category}
          </span>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28, zIndex: 2 }}>
            <h2
              style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12, lineHeight: 1.3, transition: '.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
              onMouseLeave={e => e.currentTarget.style.color = 'white'}
            >
              {title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,.9)', marginBottom: 16, fontSize: 15, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {excerpt}
            </p>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={14} />{timeAgo}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Eye size={14} />{views}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Heart size={14} />{likes}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={postUrl} style={{ textDecoration: 'none', display: 'block', height: '100%', width: '100%' }}>
      <div
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,.06)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: '.2s',
          background: isDark ? '#1e293b' : 'white',
          border: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)'; }}
      >
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', flexShrink: 0 }}>
          {image ? (
            <img src={image} alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease', display: 'block' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: isDark ? '#334155' : '#e5e7eb' }} />
          )}
          <span style={{ position: 'absolute', top: 12, left: 12, padding: '5px 12px', background: '#16a34a', color: 'white', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: .4 }}>
            {category}
          </span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 10,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: '.2s',
              color: isDark ? '#f1f5f9' : '#111827',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#16a34a'}
            onMouseLeave={e => e.currentTarget.style.color = isDark ? '#f1f5f9' : '#111827'}
          >
            {title}
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: isDark ? '#94a3b8' : '#6b7280' }}>
            {excerpt}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 600, color: isDark ? '#64748b' : '#9ca3af' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} />{timeAgo}</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={12} />{views}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={12} />{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;