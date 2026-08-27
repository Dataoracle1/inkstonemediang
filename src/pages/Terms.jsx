import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Terms = () => {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: isDark ? '#0f1419' : '#ffffff', color: isDark ? '#fff' : '#000', minHeight: '100vh', padding: '60px 20px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '20px' }}>Terms of Service</h1>
        <p style={{ fontSize: '13px', color: isDark ? '#999' : '#666', marginBottom: '30px' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>1. Acceptance of Terms</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          By accessing and using SYDLINES, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>2. Use License</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software</li>
          <li>Remove any copyright or proprietary notations</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>3. Disclaimer</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          The materials on SYDLINES are provided on an 'as is' basis. SYDLINES makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>4. Limitations</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          In no event shall SYDLINES or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SYDLINES.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>5. Accuracy of Materials</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          The materials appearing on SYDLINES could include technical, typographical, or photographic errors. SYDLINES does not warrant that any of the materials on our website are accurate, complete, or current.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>6. Links</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          SYDLINES has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SYDLINES of the site. Use of any such linked website is at the user's own risk.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>7. Modifications</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          SYDLINES may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
        </p>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', marginTop: '30px' }}>8. Governing Law</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '16px' }}>
          These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in Lagos, Nigeria.
        </p>
      </div>
    </div>
  );
};

export default Terms;