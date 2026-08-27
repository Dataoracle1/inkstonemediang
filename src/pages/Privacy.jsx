import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Privacy = () => {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: isDark ? '#0f1419' : '#ffffff', color: isDark ? '#fff' : '#000', minHeight: '100vh', padding: '60px 20px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '20px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '13px', color: isDark ? '#999' : '#666', marginBottom: '30px' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>1. Information We Collect</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          We collect information you voluntarily provide, such as when you subscribe to our newsletter, submit contact forms, or create an account. We also collect usage data through analytics to improve our service.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>2. How We Use Your Information</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          Your information is used to deliver our services, send newsletters, respond to inquiries, and improve user experience. We never sell or share your personal data with third parties without consent.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>3. Cookies and Tracking</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          We use cookies to enhance your browsing experience. You can control cookie settings in your browser. We also use analytics to understand how readers interact with our content.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>4. Data Security</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          We implement industry-standard security measures to protect your data. However, no online platform is completely secure. We encourage you to use strong passwords and report any security concerns.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>5. Your Rights</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          You have the right to access, modify, or delete your personal data. Contact our support team to exercise these rights or to file a complaint.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>6. Changes to This Policy</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          We may update this privacy policy from time to time. We will notify you of any significant changes via email or through a prominent notice on our website.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>7. Contact Us</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          If you have questions about our privacy practices, please contact us at privacy@sydlines.media
        </p>
      </div>
    </div>
  );
};

export default Privacy;