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
                :root {
          --g0: var(--ink-paper);
          --g1: var(--ink-paper-dim);
          --g2: var(--ink-rule);
          --g3: var(--ink-rule);
          --g4: var(--ink-wire-bright);
          --g5: var(--ink-wire-bright);
          --g6: var(--ink-stamp);
          --g7: var(--ink-stamp);
          --g8: var(--ink-wire);
          --g9: var(--ink-wire);
          --gdark: var(--ink-paper-dark);
          --ink: var(--ink-ink);
          --muted: var(--ink-ink-soft);
          --card-bg: var(--ink-paper-dim);
          --card-border: var(--ink-rule);
          --shadow: none;
          --shadow-hover: none;
        }

        .terms-page * { box-sizing: border-box; }

        .terms-page {
          font-family: 'Source Sans 3', sans-serif;
          background: var(--g0);
          min-height: 100vh;
          color: var(--ink);
        }

        /* ── HERO ── */
        .terms-hero {
          position: relative;
          background: var(--ink-wire);
          padding: 72px 24px 80px;
          overflow: hidden;
        }

        .terms-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(0,0,0,0.25) 0%, transparent 55%);
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
          font-family: 'Fraunces', serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 600;
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
        .bubble-green, .bubble-teal, .bubble-lime, .bubble-emerald, .bubble-amber {
          background: var(--ink-paper-dim);
          color: var(--ink-stamp);
          border: 1.5px solid var(--ink-stamp);
        }

        .terms-section-head h2 {
          font-family: 'Fraunces', serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--g8);
          margin: 0;
        }

        /* ── PROSE ── */
        .terms-prose {
          font-size: 15px;
          line-height: 1.8;
          color: var(--ink-ink-soft);
        }
        .terms-prose strong { color: var(--g7); }
        .terms-prose p { margin-bottom: 14px; }
        .terms-prose p:last-child { margin-bottom: 0; }

        /* ── HIGHLIGHTED BLOCK ── */
        .terms-highlight {
          border-left: 4px solid var(--g5);
          background: var(--ink-paper-dim);
          border-radius: 0 12px 12px 0;
          padding: 18px 22px;
          margin: 8px 0;
        }

        /* ── WARN BLOCK ── */
        .terms-warn {
          border-left: 4px solid var(--ink-stamp);
          background: var(--ink-paper-dim);
          border-radius: 0 12px 12px 0;
          padding: 18px 22px;
          margin: 8px 0;
        }

        /* ── DENY LIST ── */
        .terms-deny-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--ink-paper-dim);
          border: 1px solid var(--ink-rule);
          border-radius: 14px;
          padding: 20px 22px;
          margin-top: 12px;
        }
        .terms-deny-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14.5px;
          color: var(--ink-ink-soft);
          line-height: 1.6;
        }
        .deny-x {
          flex-shrink: 0;
          width: 22px; height: 22px;
          background: var(--ink-paper-dim);
          color: var(--ink-stamp);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px;
          margin-top: 2px;
        }
        .deny-ban {
          flex-shrink: 0;
          color: var(--ink-stamp);
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
          background: var(--ink-paper-dim);
          border-color: var(--ink-rule);
        }
        .must-dont {
          background: var(--ink-paper-dim);
          border-color: var(--ink-stamp-dim);
        }
        .must-title {
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .must-do .must-title   { color: var(--ink-wire-bright); }
        .must-dont .must-title { color: var(--ink-stamp); }
        .must-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 7px;
        }
        .must-list li {
          font-size: 13.5px;
          color: var(--ink-ink-soft);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }
        .must-do .must-list li::before    { content: '✓'; color: var(--ink-wire-bright); font-weight: 700; flex-shrink: 0; }
        .must-dont .must-list li::before  { content: '✗'; color: var(--ink-stamp); font-weight: 700; flex-shrink: 0; }

        /* ── INTRO BANNER ── */
        .terms-intro-banner {
          background: var(--ink-wire);
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
          background: var(--ink-wire);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 0;
          position: relative;
          overflow: hidden;
        }
        .terms-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 90% at 90% -10%, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .terms-cta h2 {
          font-family: 'Fraunces', serif;
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
          color: var(--ink-stamp);
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
          font-family: 'Fraunces', serif;
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
          background: var(--ink-paper-dark);
          color: var(--ink-ink-dark);
        }

        /* Hero arc cut-out matches dark bg */
        .dark .terms-hero-arc {
          background: var(--ink-paper-dark);
        }

        /* Cards */
        .dark .terms-card {
          background: var(--ink-paper-dim);
          border-color: var(--ink-rule);
        }

        /* Section headings */
        .dark .terms-section-head h2 { color: var(--ink-wire-bright); }
        .dark .terms-plain h2        { color: var(--ink-wire-bright); border-left-color: var(--ink-wire-bright); }

        /* Prose */
        .dark .terms-prose        { color: var(--ink-ink-soft); }
        .dark .terms-prose strong { color: var(--ink-stamp); }

        /* Highlighted block (agreement) */
        .dark .terms-highlight {
          background: var(--ink-paper-dim);
          border-left-color: var(--ink-wire-bright);
        }

        /* Warn block (disclaimer) */
        .dark .terms-warn {
          background: var(--ink-paper-dim);
          border-left-color: var(--ink-stamp);
        }

        /* Deny list */
        .dark .terms-deny-list  { background: var(--ink-paper-dim); border-color: var(--ink-rule); }
        .dark .terms-deny-item  { color: var(--ink-ink-soft); }
        .dark .deny-x           { background: var(--ink-paper); color: var(--ink-stamp); }
        .dark .deny-ban         { color: var(--ink-stamp); }

        /* Icon bubbles */
        .dark .bubble-green, .dark .bubble-teal, .dark .bubble-lime, .dark .bubble-emerald, .dark .bubble-amber {
          background: var(--ink-paper);
          color: var(--ink-stamp);
          border-color: var(--ink-stamp);
        }

        /* Must/Must-Not cards */
        .dark .must-do                    { background: var(--ink-paper); border-color: var(--ink-rule); }
        .dark .must-do .must-title        { color: var(--ink-wire-bright); }
        .dark .must-do .must-list li      { color: var(--ink-ink-soft); }
        .dark .must-do .must-list li::before { color: var(--ink-wire-bright); }

        .dark .must-dont                  { background: var(--ink-paper); border-color: var(--ink-stamp-dim); }
        .dark .must-dont .must-title      { color: var(--ink-stamp); }
        .dark .must-dont .must-list li    { color: var(--ink-ink-soft); }
        .dark .must-dont .must-list li::before { color: var(--ink-stamp); }

        /* Divider */
        .dark .terms-divider-dot { background: var(--ink-wire-bright); }
        .dark .terms-divider::before,
        .dark .terms-divider::after { background: linear-gradient(to right, transparent, var(--ink-wire-bright), transparent); }

        /* CTA contact button */
        .dark .terms-cta-btn       { background: #fff; color: var(--ink-stamp); }
        .dark .terms-cta-btn:hover { background: var(--ink-paper-dim); }
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
              Welcome to <strong>SYDLINES MEDIA</strong>. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
            </p>
          </div>

          {/* Agreement */}
          <div data-reveal className="terms-card">
            <div className="terms-section-head">
              <div className="terms-icon-bubble bubble-green"><FileText size={22} /></div>
              <h2>Agreement to Terms</h2>
            </div>
            <div className="terms-highlight terms-prose">
              <p>By accessing and using SYDLINES MEDIA, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
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
              Permission is granted to temporarily access the materials on SYDLINES MEDIA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <div className="terms-deny-list">
              {[
                'Modify or copy the materials',
                'Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)',
                'Attempt to decompile or reverse engineer any software contained on SYDLINES MEDIA\'s website',
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
              When posting comments or submitting content to SYDLINES MEDIA, you agree not to post content that:
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
              <p>The materials on SYDLINES MEDIA's website are provided on an 'as is' basis. SYDLINES MEDIA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              <p>Further, SYDLINES MEDIA does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
            </div>
          </div>

          {/* Simple sections */}
          {[
            {
              title: 'Limitations of Liability',
              text: "In no event shall SYDLINES MEDIA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SYDLINES MEDIA's website, even if SYDLINES MEDIA or an authorized representative has been notified orally or in writing of the possibility of such damage.",
            },
            {
              title: 'Accuracy of Materials',
              text: "The materials appearing on SYDLINES MEDIA's website could include technical, typographical, or photographic errors. SYDLINES MEDIA does not warrant that any of the materials on its website are accurate, complete, or current. SYDLINES MEDIA may make changes to the materials contained on its website at any time without notice.",
            },
            {
              title: 'Links to Third-Party Sites',
              text: "SYDLINES MEDIA has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SYDLINES MEDIA of the site. Use of any such linked website is at the user's own risk.",
            },
            {
              title: 'Modifications',
              text: "SYDLINES MEDIA may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.",
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
              <p><strong>Email:</strong> legal@sydlinesmedia.com</p>
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