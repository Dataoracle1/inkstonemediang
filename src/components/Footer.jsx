import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  const footerSections = [
    {
      title: 'Breaking News',
      icon: '📰',
      description: 'Stay updated',
    },
    {
      title: 'Sports',
      icon: '⚽',
      description: 'Scores & updates',
    },
    {
      title: 'Entertainment',
      icon: '⭐',
      description: 'Celebs & culture',
    },
    {
      title: 'Technology',
      icon: '⚙️',
      description: 'Gadgets & trends',
    },
    {
      title: 'Politics',
      icon: '🏛️',
      description: 'Policy & leaders',
    },
    {
      title: 'Business',
      icon: '📊',
      description: 'Markets & economy',
    },
    {
      title: 'World',
      icon: '🌍',
      description: 'Global updates',
    },
    {
      title: 'Opinion',
      icon: '💬',
      description: 'Views & analysis',
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: isDark ? '#0f1419' : '#f9f9f9',
        borderTop: isDark ? '1px solid #333' : '1px solid #e0e0e0',
        padding: '40px 20px 20px',
        marginTop: '60px',
      }}
    >
      {/* Categories Grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
          paddingBottom: '40px',
          borderBottom: isDark ? '1px solid #333' : '1px solid #e0e0e0',
        }}
      >
        {footerSections.map((section) => (
          <Link
            key={section.title}
            to={`/category/${section.title.toLowerCase().replace(/\s+/g, '-')}`}
            style={{
              textDecoration: 'none',
              padding: '16px',
              backgroundColor: isDark ? '#1a1f2e' : '#ffffff',
              borderRadius: '8px',
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#2a2f3e' : '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#1a1f2e' : '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{section.icon}</div>
            <div
              style={{
                fontWeight: 600,
                fontSize: '13px',
                color: isDark ? '#fff' : '#000',
                marginBottom: '4px',
              }}
            >
              {section.title}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: isDark ? '#999' : '#666',
              }}
            >
              {section.description}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Links & Info */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: isDark ? '#fff' : '#000',
              marginBottom: '8px',
            }}
          >
            <span>SYDLINES</span>
            <span style={{ color: '#d32f2f', fontStyle: 'italic' }}>.</span>
          </div>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              fontWeight: 600,
              color: isDark ? '#999' : '#666',
            }}
          >
            SMART NEWS. REAL IMPACT.
          </div>
          <p
            style={{
              fontSize: '13px',
              color: isDark ? '#aaa' : '#666',
              marginTop: '12px',
              lineHeight: 1.6,
            }}
          >
            Breaking news, sports, entertainment, technology, politics, business, world news, and opinion - all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#000',
              marginBottom: '12px',
            }}
          >
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' },
              { label: 'Privacy Policy', path: '/privacy' },
              { label: 'Terms & Conditions', path: '/terms' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '13px',
                  color: isDark ? '#999' : '#666',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#d32f2f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#999' : '#666')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#000',
              marginBottom: '12px',
            }}
          >
            Stay Updated
          </h4>
          <p
            style={{
              fontSize: '12px',
              color: isDark ? '#aaa' : '#666',
              marginBottom: '12px',
            }}
          >
            Subscribe to our newsletter for daily news updates.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="Your email"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '3px',
                fontSize: '12px',
                backgroundColor: isDark ? '#2a2f3e' : '#fff',
                color: isDark ? '#fff' : '#000',
              }}
            />
            <button
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: isDark ? '1px solid #333' : '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: isDark ? '#999' : '#666',
          }}
        >
          © {new Date().getFullYear()} SYDLINES Media. All rights reserved.
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
            <a
              key={social}
              href="#"
              style={{
                fontSize: '12px',
                color: isDark ? '#999' : '#666',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#d32f2f')}
              onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#999' : '#666')}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;