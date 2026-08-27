import React from 'react';
import { Share2, Copy, MessageCircle, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SocialShare = ({ url, title, excerpt }) => {
  const { showToast } = useToast();

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareText = encodeURIComponent(excerpt || title);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      color: '#25D366',
    },
    {
      name: 'Twitter',
      icon: Share2,
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      color: '#1DA1F2',
    },
    {
      name: 'Facebook',
      icon: Heart,
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: '#4267B2',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: 'clamp(6px, 2vw, 12px)',
      alignItems: 'center',
      margin: '16px 0',
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: 'clamp(10px, 1.5vw, 12px)',
        fontWeight: 600,
        color: 'var(--ink-ink-soft)',
        textTransform: 'uppercase',
        letterSpacing: '.08em',
      }}>
        SHARE
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${link.name}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'clamp(28px, 4vw, 32px)',
            height: 'clamp(28px, 4vw, 32px)',
            borderRadius: '50%',
            backgroundColor: link.color,
            color: 'white',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.opacity = 0.8}
          onMouseLeave={(e) => e.target.style.opacity = 1}
        >
          <link.icon size={14} />
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        title="Copy link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'clamp(28px, 4vw, 32px)',
          height: 'clamp(28px, 4vw, 32px)',
          borderRadius: '50%',
          backgroundColor: 'var(--ink-rule)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ink-ink)',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.opacity = 0.8}
        onMouseLeave={(e) => e.target.style.opacity = 1}
      >
        <Copy size={14} />
      </button>
    </div>
  );
};

export default SocialShare;