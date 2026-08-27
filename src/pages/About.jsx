import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Target, Globe } from 'lucide-react';

const About = () => {
  return (
    <div style={{ background: '#FAF9F6' }}>
      <style>{`
        .about-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 18px;
          box-sizing: border-box;
        }
        .about-hero {
          padding: 80px 0;
          text-align: center;
          border-bottom: 1px solid #e8e4dd;
        }
        .about-hero h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 700;
          color: #071A33;
          margin: 0 0 16px;
          line-height: 1.2;
        }
        .about-hero p {
          font-size: 18px;
          color: #64748B;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .about-values {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 60px 0;
          border-bottom: 1px solid #e8e4dd;
        }
        .value-card {
          text-align: center;
        }
        .value-icon {
          width: 60px;
          height: 60px;
          background: rgba(196, 66, 47, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #C4422F;
        }
        .value-title {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          color: #071A33;
          margin: 0 0 8px;
        }
        .value-desc {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          line-height: 1.6;
        }
        .about-section {
          padding: 60px 0;
          border-bottom: 1px solid #e8e4dd;
        }
        .about-section h2 {
          font-family: "Playfair Display", serif;
          font-size: 36px;
          font-weight: 700;
          color: #071A33;
          margin: 0 0 24px;
          line-height: 1.2;
        }
        .about-section p {
          font-size: 16px;
          color: #17202A;
          line-height: 1.8;
          margin: 0 0 16px;
        }
        .about-section a {
          color: #C4422F;
          text-decoration: none;
          font-weight: 600;
        }
        .about-section a:hover {
          text-decoration: underline;
        }
        .cta-section {
          padding: 60px 0;
          text-align: center;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #C4422F;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          font-family: "IBM Plex Mono", monospace;
          letter-spacing: .08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity .15s;
        }
        .cta-btn:hover {
          opacity: 0.9;
        }
        @media (max-width: 1024px) {
          .about-values { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .about-hero { padding: 40px 0; }
          .about-hero h1 { font-size: 28px; }
          .about-values { grid-template-columns: 1fr; gap: 20px; }
          .about-section { padding: 40px 0; }
          .about-section h2 { font-size: 24px; }
        }
      `}</style>

      {/* HERO */}
      <div className="about-container">
        <div className="about-hero">
          <h1>About SYDLINES</h1>
          <p>Delivering smart news with real impact. We're committed to covering Africa's most important stories with depth, accuracy, and integrity.</p>
        </div>

        {/* VALUES */}
        <div className="about-values">
          <div className="value-card">
            <div className="value-icon"><Award size={28} /></div>
            <h3 className="value-title">Excellence</h3>
            <p className="value-desc">Highest standards of journalism and storytelling</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Globe size={28} /></div>
            <h3 className="value-title">Global Reach</h3>
            <p className="value-desc">Covering stories that matter across Africa</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Target size={28} /></div>
            <h3 className="value-title">Impact</h3>
            <p className="value-desc">Real news for real change and progress</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Users size={28} /></div>
            <h3 className="value-title">Community</h3>
            <p className="value-desc">Building trust through transparent reporting</p>
          </div>
        </div>

        {/* MISSION */}
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            SYDLINES is Africa's premium news platform dedicated to delivering smart, contextual journalism. We believe in the power of well-reported stories to inform, inspire, and drive meaningful change across the continent.
          </p>
          <p>
            Our team of experienced journalists, editors, and technologists work collaboratively to bring you stories that matter — from breaking news to in-depth investigations, from business and technology to culture and politics.
          </p>
        </div>

        {/* VALUES SECTION */}
        <div className="about-section">
          <h2>Our Values</h2>
          <p>
            <strong>Accuracy:</strong> We verify every story with rigorous editorial standards before publication. Our commitment to truth is unwavering.
          </p>
          <p>
            <strong>Integrity:</strong> We maintain editorial independence and transparent sourcing. Our readers trust us because we earn it daily.
          </p>
          <p>
            <strong>Impact:</strong> We're not just reporting the news — we're contributing to informed public discourse and positive change.
          </p>
        </div>

        {/* CONTACT CTA */}
        <div className="cta-section">
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 700, color: '#071A33', margin: '0 0 24px' }}>
            Get In Touch
          </h2>
          <p style={{ fontSize: 16, color: '#64748B', marginBottom: 32 }}>
            Have a story tip, question, or advertising inquiry? We'd love to hear from you.
          </p>
          <Link to="/contact" className="cta-btn">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default About;