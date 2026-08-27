import React from 'react';

const Terms = () => {
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
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="policy-section">
          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using the sydlines.media website and services, you accept and agree to be bound by and comply 
            with these Terms of Service. If you do not agree to abide by these terms, please do not use this website.
          </p>
        </div>

        <div className="policy-section">
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on SYDLINES' 
            website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of 
            title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>Disclaimer</h2>
          <p>
            The materials on SYDLINES' website are provided on an 'as is' basis. SYDLINES makes no warranties, expressed 
            or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties 
            or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property 
            or other violation of rights.
          </p>
        </div>

        <div className="policy-section">
          <h2>Limitations</h2>
          <p>
            In no event shall SYDLINES or its suppliers be liable for any damages (including, without limitation, damages 
            for loss of data or profit, or due to business interruption) arising out of the use or inability to use the 
            materials on SYDLINES' website.
          </p>
        </div>

        <div className="policy-section">
          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on SYDLINES' website could include technical, typographical, or photographic errors. 
            SYDLINES does not warrant that any of the materials on its website are accurate, complete, or current. SYDLINES 
            may make changes to the materials contained on its website at any time without notice.
          </p>
        </div>

        <div className="policy-section">
          <h2>Links</h2>
          <p>
            SYDLINES has not reviewed all of the sites linked to its website and is not responsible for the contents of any 
            such linked site. The inclusion of any link does not imply endorsement by SYDLINES of the site. Use of any such 
            linked website is at the user's own risk.
          </p>
        </div>

        <div className="policy-section">
          <h2>Modifications</h2>
          <p>
            SYDLINES may revise these Terms of Service for its website at any time without notice. By using this website, 
            you are agreeing to be bound by the then current version of these Terms of Service.
          </p>
        </div>

        <div className="policy-section">
          <h2>Governing Law</h2>
          <p>
            These Terms of Service and all related policies and notices are governed by and construed in accordance with the 
            laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </div>

        <div className="policy-section">
          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@sydlines.com" style={{ color: '#C4422F', textDecoration: 'none', fontWeight: 600 }}>
              legal@sydlines.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;