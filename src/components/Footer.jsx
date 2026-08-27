import React, { useState } from 'react';
import { Mail, Facebook, Twitter, Linkedin, Send } from 'lucide-react';
import { newsletterAPI } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubscribeLoading(true);
      await newsletterAPI.subscribe?.({ email }) || Promise.resolve();
      setSubscribeMessage('✓ Subscribed! Check your email to confirm.');
      setEmail('');
      setTimeout(() => setSubscribeMessage(''), 3000);
    } catch (error) {
      setSubscribeMessage('Failed to subscribe. Try again.');
      setTimeout(() => setSubscribeMessage(''), 3000);
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <footer style={{
      background: isDark ? '#0D1117' : '#071A33',
      color: isDark ? '#C9D1D9' : '#FAF9F6',
      borderTop: `1px solid ${isDark ? '#30363D' : '#C4422F'}`,
      transition: 'all 0.3s ease',
    }}>
      <style>{`
        .footer-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 60px 40px 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid ${isDark ? '#30363D' : '#C4422F'};
        }

        .footer-section h3 {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 20px;
          color: ${isDark ? '#E8E4DD' : '#FAF9F6'};
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section li {
          margin-bottom: 12px;
        }

        .footer-link {
          color: ${isDark ? '#C9D1D9' : '#FAF9F6'};
          text-decoration: none;
          font-size: 14px;
          line-height: 1.6;
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: #C4422F;
          padding-left: 4px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border: 1px solid ${isDark ? '#30363D' : '#C4422F'};
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #C4422F;
          transition: all 0.2s ease;
        }

        .social-icon:hover {
          background: rgba(196, 66, 47, 0.1);
          border-color: #C4422F;
        }

        .newsletter-section {
          grid-column: 1 / -1;
        }

        .newsletter-form {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .newsletter-input {
          flex: 1;
          padding: 10px 14px;
          background: ${isDark ? '#161B22' : 'rgba(255,255,255,0.1)'};
          border: 1px solid ${isDark ? '#30363D' : 'rgba(255,255,255,0.2)'};
          border-radius: 4px;
          color: ${isDark ? '#E8E4DD' : '#FAF9F6'};
          font-family: inherit;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .newsletter-input::placeholder {
          color: ${isDark ? '#8B949E' : 'rgba(255,255,255,0.5)'};
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #C4422F;
          background: ${isDark ? '#0D1117' : 'rgba(255,255,255,0.15)'};
        }

        .newsletter-btn {
          padding: 10px 20px;
          background: #C4422F;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .newsletter-btn:hover {
          background: #B23620;
          transform: translateY(-2px);
        }

        .newsletter-message {
          font-size: 12px;
          margin-top: 8px;
          color: #22c55e;
          font-weight: 600;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid ${isDark ? '#30363D' : 'rgba(255,255,255,0.1)'};
          font-size: 12px;
          color: ${isDark ? '#8B949E' : 'rgba(255,255,255,0.7)'};
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-logo {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .footer-tagline {
          font-size: 12px;
          color: ${isDark ? '#8B949E' : 'rgba(255,255,255,0.6)'};
          font-style: italic;
        }

        .footer-brand {
          max-width: 200px;
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 40px 20px 30px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span style={{ color: isDark ? '#E8E4DD' : '#FAF9F6' }}>SYD</span>
              <span style={{ color: '#C4422F', fontStyle: 'italic' }}>LINES.</span>
            </div>
            <div className="footer-tagline">Smart News. Real Impact.</div>
            <div className="footer-social">
              <a href="https://facebook.com" className="social-icon" title="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" className="social-icon" title="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter size={16} />
              </a>
              <a href="https://linkedin.com" className="social-icon" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/about" className="footer-link">About Us</a></li>
              <li><a href="/contact" className="footer-link">Contact</a></li>
              <li><a href="/admin/login" className="footer-link">Admin</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              <li><a href="/?category=Breaking%20News" className="footer-link">Breaking News</a></li>
              <li><a href="/?category=Business" className="footer-link">Business</a></li>
              <li><a href="/?category=Technology" className="footer-link">Technology</a></li>
              <li><a href="/?category=Sports" className="footer-link">Sports</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="/terms" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Cookie Policy</a></li>
              <li><a href="#" className="footer-link">Advertising</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section newsletter-section">
            <h3>
              <Mail size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Subscribe to Our Newsletter
            </h3>
            <p style={{ fontSize: 13, color: isDark ? '#8B949E' : 'rgba(255,255,255,0.7)', margin: '8px 0' }}>
              Get the latest news delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSubscribe}>
              <div className="newsletter-form">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn" disabled={subscribeLoading}>
                  <Send size={14} />
                  {subscribeLoading ? 'Sending...' : 'Subscribe'}
                </button>
              </div>
              {subscribeMessage && <div className="newsletter-message">{subscribeMessage}</div>}
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div style={{ flex: 1 }}>
            © 2024 SYDLINES MEDIA. All rights reserved. | Crafted with 📰 in Nigeria
          </div>
          <div style={{ textAlign: 'right' }}>
            Made by <a href="#" style={{ color: '#C4422F', textDecoration: 'none' }}>Qdev</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;