


// import React, { useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, FileText, AlertCircle, Scale, Copyright, Ban } from 'lucide-react';

// /* ─────────────────────────────────────────────────────────────────
//    Tiny hook: adds .visible to elements with data-reveal attribute
//    as they scroll into view — pure CSS transition handles the rest
// ───────────────────────────────────────────────────────────────── */
// function useReveal() {
//   useEffect(() => {
//     const els = document.querySelectorAll('[data-reveal]');
//     const io = new IntersectionObserver(
//       (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
//       { threshold: 0.12 }
//     );
//     els.forEach(el => io.observe(el));
//     return () => io.disconnect();
//   }, []);
// }

// const Terms = () => {
//   useReveal();

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

//         :root {
//           --g0: #f0fdf4;
//           --g1: #dcfce7;
//           --g2: #bbf7d0;
//           --g3: #86efac;
//           --g4: #4ade80;
//           --g5: #22c55e;
//           --g6: #16a34a;
//           --g7: #15803d;
//           --g8: #166534;
//           --g9: #14532d;
//           --gdark: #052e16;
//           --ink: #0f1a12;
//           --muted: #4b6e54;
//           --card-bg: #ffffff;
//           --card-border: #d1fae5;
//           --shadow: 0 4px 24px rgba(22,163,74,0.10);
//           --shadow-hover: 0 12px 40px rgba(22,163,74,0.18);
//         }

//         .terms-page * { box-sizing: border-box; }

//         .terms-page {
//           font-family: 'DM Sans', sans-serif;
//           background: var(--g0);
//           min-height: 100vh;
//           color: var(--ink);
//         }

//         /* ── HERO ── */
//         .terms-hero {
//           position: relative;
//           background: linear-gradient(135deg, var(--g8) 0%, var(--g6) 45%, var(--g5) 100%);
//           padding: 72px 24px 80px;
//           overflow: hidden;
//         }

//         .terms-hero::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background:
//             radial-gradient(ellipse 60% 80% at 80% 20%, rgba(134,239,172,0.18) 0%, transparent 60%),
//             radial-gradient(ellipse 40% 60% at 10% 80%, rgba(21,128,61,0.35) 0%, transparent 55%);
//           pointer-events: none;
//         }

//         /* Leaf pattern overlay */
//         .terms-hero::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background-image:
//             radial-gradient(circle 1.5px at 15% 25%, rgba(255,255,255,0.15) 100%, transparent),
//             radial-gradient(circle 1px at 75% 60%, rgba(255,255,255,0.12) 100%, transparent),
//             radial-gradient(circle 2px at 45% 80%, rgba(255,255,255,0.08) 100%, transparent),
//             radial-gradient(circle 1px at 88% 15%, rgba(255,255,255,0.14) 100%, transparent),
//             radial-gradient(circle 1.5px at 30% 70%, rgba(255,255,255,0.10) 100%, transparent);
//           pointer-events: none;
//         }

//         .terms-hero-inner {
//           position: relative;
//           max-width: 900px;
//           margin: 0 auto;
//           z-index: 1;
//         }

//         .terms-back {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           color: rgba(255,255,255,0.85);
//           text-decoration: none;
//           font-size: 14px;
//           font-weight: 500;
//           margin-bottom: 32px;
//           padding: 6px 14px 6px 10px;
//           border-radius: 20px;
//           border: 1px solid rgba(255,255,255,0.25);
//           background: rgba(255,255,255,0.08);
//           backdrop-filter: blur(8px);
//           transition: all 0.2s;
//         }
//         .terms-back:hover {
//           color: #fff;
//           background: rgba(255,255,255,0.16);
//           border-color: rgba(255,255,255,0.4);
//           transform: translateX(-2px);
//         }

//         .terms-hero-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 10px;
//           background: rgba(255,255,255,0.12);
//           border: 1px solid rgba(255,255,255,0.2);
//           backdrop-filter: blur(12px);
//           border-radius: 16px;
//           padding: 10px 20px 10px 12px;
//           margin-bottom: 20px;
//         }
//         .terms-hero-badge-icon {
//           width: 44px;
//           height: 44px;
//           background: rgba(255,255,255,0.18);
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #fff;
//         }
//         .terms-hero-badge-text {
//           color: rgba(255,255,255,0.9);
//           font-size: 13px;
//           font-weight: 500;
//         }

//         .terms-hero h1 {
//           font-family: 'Playfair Display', Georgia, serif;
//           font-size: clamp(2.4rem, 5vw, 4rem);
//           font-weight: 900;
//           color: #fff;
//           margin: 0 0 12px;
//           line-height: 1.1;
//           letter-spacing: -0.02em;
//         }

//         .terms-hero-date {
//           color: rgba(255,255,255,0.7);
//           font-size: 14px;
//           font-weight: 500;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .terms-hero-date::before {
//           content: '';
//           display: inline-block;
//           width: 6px; height: 6px;
//           background: var(--g4);
//           border-radius: 50%;
//         }

//         /* Decorative arc at bottom of hero */
//         .terms-hero-arc {
//           position: absolute;
//           bottom: -2px;
//           left: 0; right: 0;
//           height: 48px;
//           background: var(--g0);
//           clip-path: ellipse(55% 100% at 50% 100%);
//         }

//         /* ── BODY ── */
//         .terms-body {
//           max-width: 900px;
//           margin: 0 auto;
//           padding: 48px 24px 80px;
//         }

//         /* ── REVEAL ANIMATION ── */
//         [data-reveal] {
//           opacity: 0;
//           transform: translateY(28px);
//           transition: opacity 0.55s ease, transform 0.55s ease;
//         }
//         [data-reveal].visible {
//           opacity: 1;
//           transform: translateY(0);
//         }

//         /* ── SECTION CARD ── */
//         .terms-card {
//           background: var(--card-bg);
//           border: 1px solid var(--card-border);
//           border-radius: 20px;
//           padding: 36px 40px;
//           margin-bottom: 24px;
//           box-shadow: var(--shadow);
//           transition: box-shadow 0.25s, transform 0.25s;
//         }
//         .terms-card:hover {
//           box-shadow: var(--shadow-hover);
//           transform: translateY(-2px);
//         }

//         /* ── SECTION HEADING ── */
//         .terms-section-head {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           margin-bottom: 20px;
//         }
//         .terms-icon-bubble {
//           width: 48px; height: 48px;
//           border-radius: 14px;
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//         }
//         .bubble-green  { background: #dcfce7; color: var(--g6); }
//         .bubble-teal   { background: #ccfbf1; color: #0d9488; }
//         .bubble-lime   { background: #ecfccb; color: #65a30d; }
//         .bubble-emerald{ background: #d1fae5; color: #059669; }
//         .bubble-amber  { background: #fef9c3; color: #ca8a04; }

//         .terms-section-head h2 {
//           font-family: 'Playfair Display', Georgia, serif;
//           font-size: 1.45rem;
//           font-weight: 700;
//           color: var(--g8);
//           margin: 0;
//         }

//         /* ── PROSE ── */
//         .terms-prose {
//           font-size: 15px;
//           line-height: 1.8;
//           color: #374151;
//         }
//         .terms-prose strong { color: var(--g7); }
//         .terms-prose p { margin-bottom: 14px; }
//         .terms-prose p:last-child { margin-bottom: 0; }

//         /* ── HIGHLIGHTED BLOCK ── */
//         .terms-highlight {
//           border-left: 4px solid var(--g5);
//           background: linear-gradient(to right, #f0fdf4, #f8fff9);
//           border-radius: 0 12px 12px 0;
//           padding: 18px 22px;
//           margin: 8px 0;
//         }

//         /* ── WARN BLOCK ── */
//         .terms-warn {
//           border-left: 4px solid #f59e0b;
//           background: linear-gradient(to right, #fffbeb, #fffff8);
//           border-radius: 0 12px 12px 0;
//           padding: 18px 22px;
//           margin: 8px 0;
//         }

//         /* ── DENY LIST ── */
//         .terms-deny-list {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//           background: #f8fff9;
//           border: 1px solid var(--g2);
//           border-radius: 14px;
//           padding: 20px 22px;
//           margin-top: 12px;
//         }
//         .terms-deny-item {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//           font-size: 14.5px;
//           color: #374151;
//           line-height: 1.6;
//         }
//         .deny-x {
//           flex-shrink: 0;
//           width: 22px; height: 22px;
//           background: #fee2e2;
//           color: #ef4444;
//           border-radius: 6px;
//           display: flex; align-items: center; justify-content: center;
//           font-weight: 700; font-size: 13px;
//           margin-top: 2px;
//         }
//         .deny-ban {
//           flex-shrink: 0;
//           color: #ef4444;
//           margin-top: 2px;
//         }

//         /* ── MUST / MUST NOT GRID ── */
//         .terms-duo {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 16px;
//           margin-top: 4px;
//         }
//         @media (max-width: 600px) { .terms-duo { grid-template-columns: 1fr; } }

//         .terms-must-card {
//           border-radius: 14px;
//           padding: 20px;
//           border: 1px solid;
//         }
//         .must-do {
//           background: #f0fdf4;
//           border-color: var(--g3);
//         }
//         .must-dont {
//           background: #fff5f5;
//           border-color: #fecaca;
//         }
//         .must-title {
//           font-weight: 700;
//           font-size: 13px;
//           letter-spacing: 0.04em;
//           text-transform: uppercase;
//           margin-bottom: 12px;
//         }
//         .must-do .must-title   { color: var(--g6); }
//         .must-dont .must-title { color: #dc2626; }
//         .must-list {
//           list-style: none;
//           padding: 0; margin: 0;
//           display: flex; flex-direction: column; gap: 7px;
//         }
//         .must-list li {
//           font-size: 13.5px;
//           color: #374151;
//           display: flex;
//           align-items: flex-start;
//           gap: 8px;
//           line-height: 1.5;
//         }
//         .must-do .must-list li::before    { content: '✓'; color: var(--g5); font-weight: 700; flex-shrink: 0; }
//         .must-dont .must-list li::before  { content: '✗'; color: #ef4444; font-weight: 700; flex-shrink: 0; }

//         /* ── INTRO BANNER ── */
//         .terms-intro-banner {
//           background: linear-gradient(135deg, var(--g8), var(--g6));
//           border-radius: 20px;
//           padding: 32px 36px;
//           margin-bottom: 24px;
//           position: relative;
//           overflow: hidden;
//         }
//         .terms-intro-banner::after {
//           content: '';
//           position: absolute;
//           right: -30px; top: -30px;
//           width: 160px; height: 160px;
//           background: rgba(255,255,255,0.06);
//           border-radius: 50%;
//         }
//         .terms-intro-banner p {
//           font-size: 16px;
//           line-height: 1.75;
//           color: rgba(255,255,255,0.92);
//           margin: 0;
//           position: relative;
//           z-index: 1;
//         }
//         .terms-intro-banner strong { color: #fff; }

//         /* ── CTA ── */
//         .terms-cta {
//           background: linear-gradient(135deg, var(--g9) 0%, var(--g7) 60%, var(--g6) 100%);
//           border-radius: 20px;
//           padding: 40px;
//           margin-bottom: 0;
//           position: relative;
//           overflow: hidden;
//           box-shadow: 0 8px 32px rgba(22,163,74,0.25);
//         }
//         .terms-cta::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: radial-gradient(ellipse 70% 90% at 90% -10%, rgba(134,239,172,0.2) 0%, transparent 60%);
//           pointer-events: none;
//         }
//         .terms-cta h2 {
//           font-family: 'Playfair Display', serif;
//           font-size: 1.75rem;
//           color: #fff;
//           margin: 0 0 10px;
//           position: relative; z-index: 1;
//         }
//         .terms-cta p {
//           color: rgba(255,255,255,0.8);
//           font-size: 15px;
//           margin: 0 0 20px;
//           position: relative; z-index: 1;
//         }
//         .terms-cta-info {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//           margin-bottom: 24px;
//           position: relative; z-index: 1;
//         }
//         .terms-cta-info p {
//           margin: 0;
//           font-size: 14px;
//           color: rgba(255,255,255,0.75);
//         }
//         .terms-cta-info strong { color: #fff; }

//         .terms-cta-btn {
//           display: inline-block;
//           padding: 13px 28px;
//           background: #fff;
//           color: var(--g7);
//           font-weight: 700;
//           font-size: 14px;
//           border-radius: 12px;
//           text-decoration: none;
//           position: relative; z-index: 1;
//           transition: all 0.2s;
//           box-shadow: 0 4px 16px rgba(0,0,0,0.12);
//         }
//         .terms-cta-btn:hover {
//           background: var(--g1);
//           transform: translateY(-2px);
//           box-shadow: 0 8px 24px rgba(0,0,0,0.15);
//         }

//         /* ── DIVIDER ── */
//         .terms-divider {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin: 8px 0 24px;
//           opacity: 0.4;
//         }
//         .terms-divider::before,
//         .terms-divider::after {
//           content: '';
//           flex: 1;
//           height: 1px;
//           background: linear-gradient(to right, transparent, var(--g4), transparent);
//         }
//         .terms-divider-dot {
//           width: 6px; height: 6px;
//           background: var(--g5);
//           border-radius: 50%;
//         }

//         /* ── PLAIN SECTION (no card) ── */
//         .terms-plain {
//           padding: 28px 0 4px;
//         }
//         .terms-plain h2 {
//           font-family: 'Playfair Display', serif;
//           font-size: 1.35rem;
//           font-weight: 700;
//           color: var(--g8);
//           margin: 0 0 12px;
//           padding-left: 14px;
//           border-left: 3px solid var(--g4);
//         }

//         /* Stagger delays */
//         [data-reveal]:nth-child(1)  { transition-delay: 0.05s; }
//         [data-reveal]:nth-child(2)  { transition-delay: 0.10s; }
//         [data-reveal]:nth-child(3)  { transition-delay: 0.15s; }
//         [data-reveal]:nth-child(4)  { transition-delay: 0.20s; }
//         [data-reveal]:nth-child(5)  { transition-delay: 0.25s; }
//         [data-reveal]:nth-child(6)  { transition-delay: 0.10s; }
//         [data-reveal]:nth-child(7)  { transition-delay: 0.10s; }
//         [data-reveal]:nth-child(8)  { transition-delay: 0.10s; }
//         [data-reveal]:nth-child(9)  { transition-delay: 0.10s; }
//         [data-reveal]:nth-child(10) { transition-delay: 0.10s; }
//         [data-reveal]:nth-child(11) { transition-delay: 0.10s; }
//         [data-reveal]:nth-child(12) { transition-delay: 0.10s; }
//       `}</style>

//       <div className="terms-page">

//         {/* ── HERO ── */}
//         <div className="terms-hero">
//           <div className="terms-hero-inner">
//             <Link to="/" className="terms-back">
//               <ArrowLeft size={16} />
//               Back to Home
//             </Link>

//             <div className="terms-hero-badge">
//               <div className="terms-hero-badge-icon"><Scale size={22} /></div>
//               <span className="terms-hero-badge-text">Legal Document</span>
//             </div>

//             <h1>Terms of Service</h1>
//             <p className="terms-hero-date">Last updated: February 15, 2026</p>
//           </div>
//           <div className="terms-hero-arc" />
//         </div>

//         {/* ── BODY ── */}
//         <div className="terms-body">

//           {/* Intro */}
//           <div data-reveal className="terms-intro-banner">
//             <p>
//               Welcome to <strong>INKSTONE MEDIA</strong>. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
//             </p>
//           </div>

//           {/* Agreement */}
//           <div data-reveal className="terms-card">
//             <div className="terms-section-head">
//               <div className="terms-icon-bubble bubble-green"><FileText size={22} /></div>
//               <h2>Agreement to Terms</h2>
//             </div>
//             <div className="terms-highlight terms-prose">
//               <p>By accessing and using INKSTONE MEDIA, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
//               <p>We reserve the right to update, change, or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.</p>
//             </div>
//           </div>

//           {/* Use License */}
//           <div data-reveal className="terms-card">
//             <div className="terms-section-head">
//               <div className="terms-icon-bubble bubble-emerald"><Copyright size={22} /></div>
//               <h2>Use License</h2>
//             </div>
//             <p className="terms-prose" style={{ marginBottom: 16 }}>
//               Permission is granted to temporarily access the materials on INKSTONE MEDIA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
//             </p>
//             <div className="terms-deny-list">
//               {[
//                 'Modify or copy the materials',
//                 'Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)',
//                 'Attempt to decompile or reverse engineer any software contained on INKSTONE MEDIA\'s website',
//                 'Remove any copyright or other proprietary notations from the materials',
//                 'Transfer the materials to another person or "mirror" the materials on any other server',
//               ].map((item, i) => (
//                 <div key={i} className="terms-deny-item">
//                   <span className="deny-x">✗</span>
//                   <span>{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* User Responsibilities */}
//           <div data-reveal className="terms-card">
//             <div className="terms-section-head">
//               <div className="terms-icon-bubble bubble-lime">
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
//               </div>
//               <h2>User Responsibilities</h2>
//             </div>
//             <div className="terms-duo">
//               <div className="terms-must-card must-do">
//                 <p className="must-title">✓ You Must</p>
//                 <ul className="must-list">
//                   <li>Be at least 13 years old to use our services</li>
//                   <li>Provide accurate information</li>
//                   <li>Keep your account credentials secure</li>
//                   <li>Comply with all applicable laws</li>
//                   <li>Respect other users and their content</li>
//                 </ul>
//               </div>
//               <div className="terms-must-card must-dont">
//                 <p className="must-title">✗ You Must Not</p>
//                 <ul className="must-list">
//                   <li>Post harmful or offensive content</li>
//                   <li>Engage in spam or harassment</li>
//                   <li>Violate intellectual property rights</li>
//                   <li>Attempt to hack or disrupt services</li>
//                   <li>Impersonate others or misrepresent yourself</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Content Guidelines */}
//           <div data-reveal className="terms-card">
//             <div className="terms-section-head">
//               <div className="terms-icon-bubble bubble-teal"><AlertCircle size={22} /></div>
//               <h2>Content Guidelines</h2>
//             </div>
//             <p className="terms-prose" style={{ marginBottom: 14 }}>
//               When posting comments or submitting content to INKSTONE MEDIA, you agree not to post content that:
//             </p>
//             <div className="terms-deny-list">
//               {[
//                 'Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable',
//                 'Infringes any patent, trademark, trade secret, copyright, or other proprietary rights',
//                 'Contains software viruses or any other computer code designed to interrupt or harm functionality',
//                 'Impersonates any person or entity or misrepresents your affiliation with a person or entity',
//               ].map((item, i) => (
//                 <div key={i} className="terms-deny-item">
//                   <Ban size={18} className="deny-ban" />
//                   <span>{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Disclaimer */}
//           <div data-reveal className="terms-card">
//             <div className="terms-section-head">
//               <div className="terms-icon-bubble bubble-amber">
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
//               </div>
//               <h2>Disclaimer</h2>
//             </div>
//             <div className="terms-warn terms-prose">
//               <p>The materials on INKSTONE MEDIA's website are provided on an 'as is' basis. INKSTONE MEDIA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
//               <p>Further, INKSTONE MEDIA does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
//             </div>
//           </div>

//           {/* Simple sections */}
//           {[
//             {
//               title: 'Limitations of Liability',
//               text: "In no event shall INKSTONE MEDIA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on INKSTONE MEDIA's website, even if INKSTONE MEDIA or an authorized representative has been notified orally or in writing of the possibility of such damage.",
//             },
//             {
//               title: 'Accuracy of Materials',
//               text: "The materials appearing on INKSTONE MEDIA's website could include technical, typographical, or photographic errors. INKSTONE MEDIA does not warrant that any of the materials on its website are accurate, complete, or current. INKSTONE MEDIA may make changes to the materials contained on its website at any time without notice.",
//             },
//             {
//               title: 'Links to Third-Party Sites',
//               text: "INKSTONE MEDIA has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by INKSTONE MEDIA of the site. Use of any such linked website is at the user's own risk.",
//             },
//             {
//               title: 'Modifications',
//               text: "INKSTONE MEDIA may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.",
//             },
//             {
//               title: 'Governing Law',
//               text: "These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
//             },
//           ].map((s, i) => (
//             <div key={i} data-reveal className="terms-card">
//               <div className="terms-plain">
//                 <h2>{s.title}</h2>
//                 <p className="terms-prose">{s.text}</p>
//               </div>
//             </div>
//           ))}

//           <div className="terms-divider" data-reveal>
//             <span className="terms-divider-dot" />
//             <span className="terms-divider-dot" />
//             <span className="terms-divider-dot" />
//           </div>

//           {/* CTA */}
//           <div data-reveal className="terms-cta">
//             <h2>Have Questions?</h2>
//             <p>If you have any questions about these Terms of Service, our team is ready to help.</p>
//             <div className="terms-cta-info">
//               <p><strong>Email:</strong> legal@inkstonemedia.com</p>
//               <p><strong>Phone:</strong> +234 704 6678 039</p>
//             </div>
//             <Link to="/contact" className="terms-cta-btn">Contact Us →</Link>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Terms;



import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, Scale, Copyright, Ban } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   Tiny hook: adds .visible to elements with data-reveal attribute
   as they scroll into view — pure CSS transition handles the rest
───────────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const Terms = () => {
  useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --g0: #f0fdf4;
          --g1: #dcfce7;
          --g2: #bbf7d0;
          --g3: #86efac;
          --g4: #4ade80;
          --g5: #22c55e;
          --g6: #16a34a;
          --g7: #15803d;
          --g8: #166534;
          --g9: #14532d;
          --gdark: #052e16;
          --ink: #0f1a12;
          --muted: #4b6e54;
          --card-bg: #ffffff;
          --card-border: #d1fae5;
          --shadow: 0 4px 24px rgba(22,163,74,0.10);
          --shadow-hover: 0 12px 40px rgba(22,163,74,0.18);
        }

        .terms-page * { box-sizing: border-box; }

        .terms-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--g0);
          min-height: 100vh;
          color: var(--ink);
        }

        /* ── HERO ── */
        .terms-hero {
          position: relative;
          background: linear-gradient(135deg, var(--g8) 0%, var(--g6) 45%, var(--g5) 100%);
          padding: 72px 24px 80px;
          overflow: hidden;
        }

        .terms-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(134,239,172,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(21,128,61,0.35) 0%, transparent 55%);
          pointer-events: none;
        }

        /* Leaf pattern overlay */
        .terms-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle 1.5px at 15% 25%, rgba(255,255,255,0.15) 100%, transparent),
            radial-gradient(circle 1px at 75% 60%, rgba(255,255,255,0.12) 100%, transparent),
            radial-gradient(circle 2px at 45% 80%, rgba(255,255,255,0.08) 100%, transparent),
            radial-gradient(circle 1px at 88% 15%, rgba(255,255,255,0.14) 100%, transparent),
            radial-gradient(circle 1.5px at 30% 70%, rgba(255,255,255,0.10) 100%, transparent);
          pointer-events: none;
        }

        .terms-hero-inner {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          z-index: 1;
        }

        .terms-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          padding: 6px 14px 6px 10px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          transition: all 0.2s;
        }
        .terms-back:hover {
          color: #fff;
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.4);
          transform: translateX(-2px);
        }

        .terms-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 10px 20px 10px 12px;
          margin-bottom: 20px;
        }
        .terms-hero-badge-icon {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.18);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .terms-hero-badge-text {
          color: rgba(255,255,255,0.9);
          font-size: 13px;
          font-weight: 500;
        }

        .terms-hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 12px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .terms-hero-date {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .terms-hero-date::before {
          content: '';
          display: inline-block;
          width: 6px; height: 6px;
          background: var(--g4);
          border-radius: 50%;
        }

        /* Decorative arc at bottom of hero */
        .terms-hero-arc {
          position: absolute;
          bottom: -2px;
          left: 0; right: 0;
          height: 48px;
          background: var(--g0);
          clip-path: ellipse(55% 100% at 50% 100%);
        }

        /* ── BODY ── */
        .terms-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* ── REVEAL ANIMATION ── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        [data-reveal].visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── SECTION CARD ── */
        .terms-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 36px 40px;
          margin-bottom: 24px;
          box-shadow: var(--shadow);
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .terms-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }

        /* ── SECTION HEADING ── */
        .terms-section-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .terms-icon-bubble {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .bubble-green  { background: #dcfce7; color: var(--g6); }
        .bubble-teal   { background: #ccfbf1; color: #0d9488; }
        .bubble-lime   { background: #ecfccb; color: #65a30d; }
        .bubble-emerald{ background: #d1fae5; color: #059669; }
        .bubble-amber  { background: #fef9c3; color: #ca8a04; }

        .terms-section-head h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--g8);
          margin: 0;
        }

        /* ── PROSE ── */
        .terms-prose {
          font-size: 15px;
          line-height: 1.8;
          color: #374151;
        }
        .terms-prose strong { color: var(--g7); }
        .terms-prose p { margin-bottom: 14px; }
        .terms-prose p:last-child { margin-bottom: 0; }

        /* ── HIGHLIGHTED BLOCK ── */
        .terms-highlight {
          border-left: 4px solid var(--g5);
          background: linear-gradient(to right, #f0fdf4, #f8fff9);
          border-radius: 0 12px 12px 0;
          padding: 18px 22px;
          margin: 8px 0;
        }

        /* ── WARN BLOCK ── */
        .terms-warn {
          border-left: 4px solid #f59e0b;
          background: linear-gradient(to right, #fffbeb, #fffff8);
          border-radius: 0 12px 12px 0;
          padding: 18px 22px;
          margin: 8px 0;
        }

        /* ── DENY LIST ── */
        .terms-deny-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #f8fff9;
          border: 1px solid var(--g2);
          border-radius: 14px;
          padding: 20px 22px;
          margin-top: 12px;
        }
        .terms-deny-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14.5px;
          color: #374151;
          line-height: 1.6;
        }
        .deny-x {
          flex-shrink: 0;
          width: 22px; height: 22px;
          background: #fee2e2;
          color: #ef4444;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px;
          margin-top: 2px;
        }
        .deny-ban {
          flex-shrink: 0;
          color: #ef4444;
          margin-top: 2px;
        }

        /* ── MUST / MUST NOT GRID ── */
        .terms-duo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 4px;
        }
        @media (max-width: 600px) { .terms-duo { grid-template-columns: 1fr; } }

        .terms-must-card {
          border-radius: 14px;
          padding: 20px;
          border: 1px solid;
        }
        .must-do {
          background: #f0fdf4;
          border-color: var(--g3);
        }
        .must-dont {
          background: #fff5f5;
          border-color: #fecaca;
        }
        .must-title {
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .must-do .must-title   { color: var(--g6); }
        .must-dont .must-title { color: #dc2626; }
        .must-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 7px;
        }
        .must-list li {
          font-size: 13.5px;
          color: #374151;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }
        .must-do .must-list li::before    { content: '✓'; color: var(--g5); font-weight: 700; flex-shrink: 0; }
        .must-dont .must-list li::before  { content: '✗'; color: #ef4444; font-weight: 700; flex-shrink: 0; }

        /* ── INTRO BANNER ── */
        .terms-intro-banner {
          background: linear-gradient(135deg, var(--g8), var(--g6));
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .terms-intro-banner::after {
          content: '';
          position: absolute;
          right: -30px; top: -30px;
          width: 160px; height: 160px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
        }
        .terms-intro-banner p {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.92);
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .terms-intro-banner strong { color: #fff; }

        /* ── CTA ── */
        .terms-cta {
          background: linear-gradient(135deg, var(--g9) 0%, var(--g7) 60%, var(--g6) 100%);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 0;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(22,163,74,0.25);
        }
        .terms-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 90% at 90% -10%, rgba(134,239,172,0.2) 0%, transparent 60%);
          pointer-events: none;
        }
        .terms-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          color: #fff;
          margin: 0 0 10px;
          position: relative; z-index: 1;
        }
        .terms-cta p {
          color: rgba(255,255,255,0.8);
          font-size: 15px;
          margin: 0 0 20px;
          position: relative; z-index: 1;
        }
        .terms-cta-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 24px;
          position: relative; z-index: 1;
        }
        .terms-cta-info p {
          margin: 0;
          font-size: 14px;
          color: rgba(255,255,255,0.75);
        }
        .terms-cta-info strong { color: #fff; }

        .terms-cta-btn {
          display: inline-block;
          padding: 13px 28px;
          background: #fff;
          color: var(--g7);
          font-weight: 700;
          font-size: 14px;
          border-radius: 12px;
          text-decoration: none;
          position: relative; z-index: 1;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .terms-cta-btn:hover {
          background: var(--g1);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        /* ── DIVIDER ── */
        .terms-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 8px 0 24px;
          opacity: 0.4;
        }
        .terms-divider::before,
        .terms-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--g4), transparent);
        }
        .terms-divider-dot {
          width: 6px; height: 6px;
          background: var(--g5);
          border-radius: 50%;
        }

        /* ── PLAIN SECTION (no card) ── */
        .terms-plain {
          padding: 28px 0 4px;
        }
        .terms-plain h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--g8);
          margin: 0 0 12px;
          padding-left: 14px;
          border-left: 3px solid var(--g4);
        }

        /* Stagger delays */
        [data-reveal]:nth-child(1)  { transition-delay: 0.05s; }
        [data-reveal]:nth-child(2)  { transition-delay: 0.10s; }
        [data-reveal]:nth-child(3)  { transition-delay: 0.15s; }
        [data-reveal]:nth-child(4)  { transition-delay: 0.20s; }
        [data-reveal]:nth-child(5)  { transition-delay: 0.25s; }
        [data-reveal]:nth-child(6)  { transition-delay: 0.10s; }
        [data-reveal]:nth-child(7)  { transition-delay: 0.10s; }
        [data-reveal]:nth-child(8)  { transition-delay: 0.10s; }
        [data-reveal]:nth-child(9)  { transition-delay: 0.10s; }
        [data-reveal]:nth-child(10) { transition-delay: 0.10s; }
        [data-reveal]:nth-child(11) { transition-delay: 0.10s; }
        [data-reveal]:nth-child(12) { transition-delay: 0.10s; }

        /* ══════════════════════════════════════════════════
           DARK MODE — responds to .dark on <html> (Tailwind)
        ══════════════════════════════════════════════════ */

        .dark .terms-page {
          background: #061a0e;
          color: #d1fae5;
        }

        /* Hero arc cut-out matches dark bg */
        .dark .terms-hero-arc {
          background: #061a0e;
        }

        /* Cards */
        .dark .terms-card {
          background: #0a2215;
          border-color: #1a4a2a;
          box-shadow: 0 4px 24px rgba(0,0,0,0.40);
        }
        .dark .terms-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.55);
        }

        /* Section headings */
        .dark .terms-section-head h2 { color: #86efac; }
        .dark .terms-plain h2        { color: #86efac; border-left-color: #22c55e; }

        /* Prose */
        .dark .terms-prose        { color: #a7c5b0; }
        .dark .terms-prose strong { color: #4ade80; }

        /* Highlighted block (agreement) */
        .dark .terms-highlight {
          background: linear-gradient(to right, #0d2e18, #0f3320);
          border-left-color: #22c55e;
        }

        /* Warn block (disclaimer) */
        .dark .terms-warn {
          background: linear-gradient(to right, #1c1500, #201800);
          border-left-color: #f59e0b;
        }

        /* Deny list */
        .dark .terms-deny-list  { background: #0d2418; border-color: #1e4a2a; }
        .dark .terms-deny-item  { color: #a7c5b0; }
        .dark .deny-x           { background: #3b0f0f; color: #f87171; }
        .dark .deny-ban         { color: #f87171; }

        /* Icon bubbles */
        .dark .bubble-green    { background: #14532d; color: #4ade80; }
        .dark .bubble-teal     { background: #134e4a; color: #2dd4bf; }
        .dark .bubble-lime     { background: #1a2e05; color: #a3e635; }
        .dark .bubble-emerald  { background: #064e3b; color: #34d399; }
        .dark .bubble-amber    { background: #292524; color: #fbbf24; }

        /* Must/Must-Not cards */
        .dark .must-do                    { background: #0d2e18; border-color: #166534; }
        .dark .must-do .must-title        { color: #4ade80; }
        .dark .must-do .must-list li      { color: #a7c5b0; }
        .dark .must-do .must-list li::before { color: #22c55e; }

        .dark .must-dont                  { background: #1f0a0a; border-color: #7f1d1d; }
        .dark .must-dont .must-title      { color: #f87171; }
        .dark .must-dont .must-list li    { color: #c9a0a0; }
        .dark .must-dont .must-list li::before { color: #ef4444; }

        /* Divider */
        .dark .terms-divider-dot { background: #22c55e; }
        .dark .terms-divider::before,
        .dark .terms-divider::after { background: linear-gradient(to right, transparent, #22c55e, transparent); }

        /* CTA contact button */
        .dark .terms-cta-btn       { background: #fff; color: #14532d; }
        .dark .terms-cta-btn:hover { background: #dcfce7; }
      `}</style>

      <div className="terms-page">

        {/* ── HERO ── */}
        <div className="terms-hero">
          <div className="terms-hero-inner">
            <Link to="/" className="terms-back">
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="terms-hero-badge">
              <div className="terms-hero-badge-icon"><Scale size={22} /></div>
              <span className="terms-hero-badge-text">Legal Document</span>
            </div>

            <h1>Terms of Service</h1>
            <p className="terms-hero-date">Last updated: February 15, 2026</p>
          </div>
          <div className="terms-hero-arc" />
        </div>

        {/* ── BODY ── */}
        <div className="terms-body">

          {/* Intro */}
          <div data-reveal className="terms-intro-banner">
            <p>
              Welcome to <strong>INKSTONE MEDIA</strong>. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
            </p>
          </div>

          {/* Agreement */}
          <div data-reveal className="terms-card">
            <div className="terms-section-head">
              <div className="terms-icon-bubble bubble-green"><FileText size={22} /></div>
              <h2>Agreement to Terms</h2>
            </div>
            <div className="terms-highlight terms-prose">
              <p>By accessing and using INKSTONE MEDIA, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              <p>We reserve the right to update, change, or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.</p>
            </div>
          </div>

          {/* Use License */}
          <div data-reveal className="terms-card">
            <div className="terms-section-head">
              <div className="terms-icon-bubble bubble-emerald"><Copyright size={22} /></div>
              <h2>Use License</h2>
            </div>
            <p className="terms-prose" style={{ marginBottom: 16 }}>
              Permission is granted to temporarily access the materials on INKSTONE MEDIA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <div className="terms-deny-list">
              {[
                'Modify or copy the materials',
                'Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)',
                'Attempt to decompile or reverse engineer any software contained on INKSTONE MEDIA\'s website',
                'Remove any copyright or other proprietary notations from the materials',
                'Transfer the materials to another person or "mirror" the materials on any other server',
              ].map((item, i) => (
                <div key={i} className="terms-deny-item">
                  <span className="deny-x">✗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Responsibilities */}
          <div data-reveal className="terms-card">
            <div className="terms-section-head">
              <div className="terms-icon-bubble bubble-lime">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h2>User Responsibilities</h2>
            </div>
            <div className="terms-duo">
              <div className="terms-must-card must-do">
                <p className="must-title">✓ You Must</p>
                <ul className="must-list">
                  <li>Be at least 13 years old to use our services</li>
                  <li>Provide accurate information</li>
                  <li>Keep your account credentials secure</li>
                  <li>Comply with all applicable laws</li>
                  <li>Respect other users and their content</li>
                </ul>
              </div>
              <div className="terms-must-card must-dont">
                <p className="must-title">✗ You Must Not</p>
                <ul className="must-list">
                  <li>Post harmful or offensive content</li>
                  <li>Engage in spam or harassment</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to hack or disrupt services</li>
                  <li>Impersonate others or misrepresent yourself</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content Guidelines */}
          <div data-reveal className="terms-card">
            <div className="terms-section-head">
              <div className="terms-icon-bubble bubble-teal"><AlertCircle size={22} /></div>
              <h2>Content Guidelines</h2>
            </div>
            <p className="terms-prose" style={{ marginBottom: 14 }}>
              When posting comments or submitting content to INKSTONE MEDIA, you agree not to post content that:
            </p>
            <div className="terms-deny-list">
              {[
                'Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable',
                'Infringes any patent, trademark, trade secret, copyright, or other proprietary rights',
                'Contains software viruses or any other computer code designed to interrupt or harm functionality',
                'Impersonates any person or entity or misrepresents your affiliation with a person or entity',
              ].map((item, i) => (
                <div key={i} className="terms-deny-item">
                  <Ban size={18} className="deny-ban" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div data-reveal className="terms-card">
            <div className="terms-section-head">
              <div className="terms-icon-bubble bubble-amber">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h2>Disclaimer</h2>
            </div>
            <div className="terms-warn terms-prose">
              <p>The materials on INKSTONE MEDIA's website are provided on an 'as is' basis. INKSTONE MEDIA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              <p>Further, INKSTONE MEDIA does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
            </div>
          </div>

          {/* Simple sections */}
          {[
            {
              title: 'Limitations of Liability',
              text: "In no event shall INKSTONE MEDIA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on INKSTONE MEDIA's website, even if INKSTONE MEDIA or an authorized representative has been notified orally or in writing of the possibility of such damage.",
            },
            {
              title: 'Accuracy of Materials',
              text: "The materials appearing on INKSTONE MEDIA's website could include technical, typographical, or photographic errors. INKSTONE MEDIA does not warrant that any of the materials on its website are accurate, complete, or current. INKSTONE MEDIA may make changes to the materials contained on its website at any time without notice.",
            },
            {
              title: 'Links to Third-Party Sites',
              text: "INKSTONE MEDIA has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by INKSTONE MEDIA of the site. Use of any such linked website is at the user's own risk.",
            },
            {
              title: 'Modifications',
              text: "INKSTONE MEDIA may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.",
            },
            {
              title: 'Governing Law',
              text: "These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
            },
          ].map((s, i) => (
            <div key={i} data-reveal className="terms-card">
              <div className="terms-plain">
                <h2>{s.title}</h2>
                <p className="terms-prose">{s.text}</p>
              </div>
            </div>
          ))}

          <div className="terms-divider" data-reveal>
            <span className="terms-divider-dot" />
            <span className="terms-divider-dot" />
            <span className="terms-divider-dot" />
          </div>

          {/* CTA */}
          <div data-reveal className="terms-cta">
            <h2>Have Questions?</h2>
            <p>If you have any questions about these Terms of Service, our team is ready to help.</p>
            <div className="terms-cta-info">
              <p><strong>Email:</strong> legal@inkstonemedia.com</p>
              <p><strong>Phone:</strong> +234 704 6678 039</p>
            </div>
            <Link to="/contact" className="terms-cta-btn">Contact Us →</Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Terms;