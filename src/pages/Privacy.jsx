import React from 'react';

const Privacy = () => {
  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      <style>{`
        .policy-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 18px;
          box-sizing: border-box;
        }
        .policy-header h1 {
          font-family: "Playfair Display", serif;
          font-size: 42px;
          font-weight: 700;
          color: #071A33;
          margin: 0 0 16px;
          line-height: 1.2;
        }
        .policy-header p {
          font-size: 14px;
          color: #64748B;
          margin: 0;
          font-family: "IBM Plex Mono", monospace;
          letter-spacing: .08em;
        }
        .policy-header {
          padding-bottom: 32px;
          border-bottom: 1px solid #e8e4dd;
          margin-bottom: 40px;
        }
        .policy-section {
          margin-bottom: 40px;
        }
        .policy-section h2 {
          font-family: "Playfair Display", serif;
          font-size: 24px;
          font-weight: 700;
          color: #071A33;
          margin: 0 0 16px;
          line-height: 1.2;
        }
        .policy-section h3 {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          color: #071A33;
          margin: 24px 0 12px;
        }
        .policy-section p,
        .policy-section li {
          font-size: 15px;
          color: #17202A;
          line-height: 1.8;
          margin: 0 0 12px;
        }
        .policy-section ul {
          margin: 16px 0;
          padding-left: 24px;
        }
        .policy-section li {
          margin-bottom: 8px;
        }
      `}</style>

      <div className="policy-container">
        <div className="policy-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="policy-section">
          <h2>Introduction</h2>
          <p>
            SYDLINES Media ("we," "us," "our," or "Company") operates the sydlines.media website and related services. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you 
            visit our website.
          </p>
        </div>

        <div className="policy-section">
          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li>Name, email address, and other contact details when you subscribe or contact us</li>
            <li>Profile information if you create an account</li>
            <li>Comments, messages, and other content you submit</li>
          </ul>
          <h3>Information We Collect Automatically</h3>
          <ul>
            <li>Device information (browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, links clicked)</li>
            <li>IP address and location data</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Deliver and improve our services</li>
            <li>Send newsletters and updates you've subscribed to</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Analyze usage patterns and improve our website</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
            Internet or electronic storage is completely secure.
          </p>
        </div>

        <div className="policy-section">
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your information</li>
            <li>Unsubscribe from marketing communications</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
            <a href="mailto:privacy@sydlines.com" style={{ color: '#C4422F', textDecoration: 'none', fontWeight: 600 }}>
              privacy@sydlines.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;