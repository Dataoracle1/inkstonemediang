import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { newsletterAPI } from '../utils/api';
import { categoryPath } from '../utils/categoryUtils';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    try {
      const response = await newsletterAPI.subscribe(email.trim());
      showToast(response.data.message || 'Please check your email to confirm subscription!', 'success');
      setEmail('');
      setShowSubscribeModal(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Subscription failed. Please try again.';
      showToast(errorMsg, 'error');
    }
  };

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    'Categories': [
      { name: 'Breaking News', path: categoryPath('Breaking News') },
      { name: 'Sports', path: categoryPath('Sports') },
      { name: 'Entertainment', path: categoryPath('Entertainment') },
      { name: 'Technology', path: categoryPath('Technology') },
    ],
    'Follow Us': [
      { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/sydlinesmedia' },
      { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/sydlinesmedia' },
      { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/sydlinesmedia' },
      { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@sydlinesmedia' },
    ],
  };

  return (
    <>
      <style>{`
        .ink-footer-link { color: rgba(238,234,223,.7); font-size: 13px; text-decoration: none; transition: .15s; display: block; padding: 6px 0; font-family: 'IBM Plex Mono', monospace; }
        .ink-footer-link:hover { color: var(--ink-stamp); }
        .ink-social-btn {
          width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; border: 1px solid rgba(238,234,223,.2); transition: .2s;
          text-decoration: none; color: rgba(238,234,223,.7);
        }
        .ink-social-btn:hover { background: var(--ink-stamp); border-color: var(--ink-stamp); color: #fff; transform: translateY(-2px); }
      `}</style>

      <footer style={{ background: 'var(--ink-wire)', color: 'rgba(238,234,223,.75)', marginTop: 64 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 36, marginBottom: 36 }}>

            {/* Brand */}
            <div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src="/sydlines-icon.png" alt="Sydlines" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
                  <h3 className="ink-serif" style={{ fontSize: 26, fontWeight: 600, color: '#eeeadf', lineHeight: .9, margin: 0 }}>
                    SYD<em style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--ink-stamp)' }}>LINES</em>
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                  <span style={{ width: 18, height: 1, background: 'rgba(238,234,223,.25)' }} />
                  <span className="ink-mono" style={{ fontSize: 9, letterSpacing: '.28em', color: 'rgba(238,234,223,.55)', fontWeight: 600 }}>MEDIA</span>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
                Your trusted wire for breaking news, sports, and entertainment stories from around the world.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {footerLinks['Follow Us'].map(({ name, icon: Icon, url }) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="ink-social-btn" title={name}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="ink-mono" style={{ color: '#eeeadf', fontWeight: 600, marginBottom: 14, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {footerLinks['Quick Links'].map(link => (
                  <Link key={link.name} to={link.path} className="ink-footer-link">{link.name}</Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="ink-mono" style={{ color: '#eeeadf', fontWeight: 600, marginBottom: 14, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>Desks</h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {footerLinks['Categories'].map(link => (
                  <Link key={link.name} to={link.path} className="ink-footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="ink-mono" style={{ color: '#eeeadf', fontWeight: 600, marginBottom: 14, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>Newsletter</h4>
              <p style={{ fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
                Subscribe to get the wire delivered to your inbox.
              </p>
              <button onClick={() => setShowSubscribeModal(true)} className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
                <Mail size={14} />
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: '1px solid rgba(238,234,223,.12)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p className="ink-mono" style={{ fontSize: 11, letterSpacing: '.05em' }}>
              &copy; {currentYear} SYDLINES MEDIA &mdash; REPORTED, NOT REPEATED
            </p>
            <div style={{ display: 'flex', gap: 18 }}>
              <Link to="/terms" className="ink-footer-link" style={{ padding: 0 }}>Terms of Service</Link>
              <Link to="/privacy" className="ink-footer-link" style={{ padding: 0 }}>Privacy Policy</Link>
              <Link to="/admin/login" className="ink-footer-link" style={{ padding: 0 }}>Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowSubscribeModal(false)}
        >
          <div
            style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, boxShadow: '0 24px 64px rgba(0,0,0,.2)', maxWidth: 460, width: '100%', padding: 32 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail color="var(--ink-stamp)" size={20} />
                </div>
                <h3 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>Subscribe</h3>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 14, color: 'var(--ink-ink-soft)', marginBottom: 22, lineHeight: 1.6 }}>
              Get the latest news and updates delivered to your inbox. Stay informed with SYDLINES MEDIA.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  Email Address
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ width: '100%', padding: '11px 15px', border: '1px solid var(--ink-rule)', borderRadius: 4, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="ink-btn ink-btn-stamp" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  Subscribe Now
                </button>
                <button type="button" onClick={() => setShowSubscribeModal(false)} className="ink-btn" style={{ justifyContent: 'center', padding: '12px 20px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;