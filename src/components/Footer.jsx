

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
      showToast(response.data.message || 'Please check your email to confirm subscription! 🎉', 'success');
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
    // Category paths now use slugs via categoryPath()
    'Categories': [
      { name: 'Breaking News', path: categoryPath('Breaking News') },
      { name: 'Sports',        path: categoryPath('Sports') },
      { name: 'Entertainment', path: categoryPath('Entertainment') },
      { name: 'Technology',    path: categoryPath('Technology') },
    ],
    'Follow Us': [
      { name: 'Facebook',  icon: Facebook,  url: 'https://facebook.com/inkstonemedia' },
      { name: 'Twitter',   icon: Twitter,   url: 'https://twitter.com/inkstonemedia' },
      { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/inkstonemedia' },
      { name: 'YouTube',   icon: Youtube,   url: 'https://youtube.com/@inkstonemedia' },
    ]
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes scaleIn { from{opacity:0;transform:scale(.92);}to{opacity:1;transform:scale(1);} }
        @keyframes fadeIn  { from{opacity:0;}to{opacity:1;} }
        .footer-link { color:#9ca3af; font-size:14px; text-decoration:none; transition:.2s; display:block; padding:6px 0; }
        .footer-link:hover { color:#16a34a; }
        .social-btn {
          width:44px; height:44px; border-radius:12px; display:flex; align-items:center;
          justify-content:center; background:#1a2a1f; transition:.2s; text-decoration:none; color:#9ca3af;
        }
        .social-btn:hover { background:#16a34a; color:white; transform:translateY(-2px); box-shadow:0 8px 20px rgba(22,163,74,.4); }
      `}</style>

      <footer style={{ fontFamily: "'DM Sans',sans-serif", background: '#0f1a12', color: '#9ca3af', marginTop: 64 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 40, marginBottom: 40 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <img src="https://i.postimg.cc/Rh7CTkm7/inkstonelogo-green.png" alt="Inkstone Media" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  INKSTONE <span style={{ color: '#16a34a' }}>MEDIA</span>
                </h3>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                Your trusted source for breaking news, sports updates, and entertainment stories from around the world.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {footerLinks['Follow Us'].map(({ name, icon: Icon, url }) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="social-btn" title={name}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 16, fontSize: 16 }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {footerLinks['Quick Links'].map(link => (
                  <Link key={link.name} to={link.path} className="footer-link">{link.name}</Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 16, fontSize: 16 }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {footerLinks['Categories'].map(link => (
                  <Link key={link.name} to={link.path} className="footer-link"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 16, fontSize: 16 }}>Newsletter</h4>
              <p style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>
                Subscribe to get the latest news delivered to your inbox.
              </p>
              <button onClick={() => setShowSubscribeModal(true)}
                style={{ width: '100%', padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <Mail size={16} />
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: '1px solid #1a2a1f', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 14 }}>
              © {currentYear} <span style={{ color: '#16a34a', fontWeight: 700 }}>INKSTONE MEDIA</span>. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 20, fontSize: 14 }}>
              <Link to="/terms" className="footer-link" style={{ padding: 0 }}>Terms of Service</Link>
              <Link to="/privacy" className="footer-link" style={{ padding: 0 }}>Privacy Policy</Link>
              <Link to="/admin/login" className="footer-link" style={{ padding: 0 }}>Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Subscribe Modal — unchanged */}
      {showSubscribeModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .2s ease' }}
          onClick={() => setShowSubscribeModal(false)}>
          <div className="subscribe-modal" style={{ background: 'white', borderRadius: 24, boxShadow: '0 24px 64px rgba(0,0,0,.2)', maxWidth: 480, width: '100%', padding: 32, animation: 'scaleIn .22s ease' }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail color="#16a34a" size={22} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, color: '#0f1a12' }}>
                  Subscribe
                </h3>
              </div>
              <button onClick={() => setShowSubscribeModal(false)}
                style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', transition: '.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = '#f9fafb'}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 24, lineHeight: 1.7 }}>
              Get the latest news and updates delivered to your inbox. Stay informed with INKSTONE MEDIA.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .3 }}>
                  Email Address
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit"
                  style={{ flex: 1, padding: '13px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 16px rgba(22,163,74,.35)', transition: '.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Subscribe Now
                </button>
                <button type="button" onClick={() => setShowSubscribeModal(false)}
                  style={{ padding: '13px 24px', background: 'white', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: '.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
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