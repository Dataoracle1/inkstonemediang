import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';

const Privacy = () => {
  const c = {
    heading: 'var(--ink-ink)',
    body: 'var(--ink-ink-soft)',
    muted: 'var(--ink-ink-soft)',
    faint: 'var(--ink-ink-soft)',
    stamp: 'var(--ink-stamp)',
  };

  const card = { marginBottom: 20, padding: '28px 28px' };

  const SectionIcon = ({ icon: Icon }) => (
    <div style={{ width: 40, height: 40, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={19} color="var(--ink-stamp)" />
    </div>
  );

  const SectionHeading = ({ icon: Icon, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <SectionIcon icon={Icon} />
      <h2 className="ink-serif" style={{ fontSize: 21, fontWeight: 600, color: c.heading, margin: 0 }}>{children}</h2>
    </div>
  );

  const CheckItem = ({ children }) => (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <span style={{ color: c.stamp, fontWeight: 800, marginTop: 1, flexShrink: 0 }}>&#10003;</span>
      <span style={{ fontSize: 14, color: c.body, lineHeight: 1.7 }}>{children}</span>
    </li>
  );

  const BulletItem = ({ children }) => (
    <li style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 6, paddingLeft: 4 }}>{children}</li>
  );

  const RightCard = ({ title, children }) => (
    <div className="ink-card" style={{ padding: '18px 20px', marginBottom: 14 }}>
      <h4 className="ink-serif" style={{ fontSize: 15, fontWeight: 600, color: c.heading, marginBottom: 8, marginTop: 0 }}>{title}</h4>
      <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`.ink-privacy-link:hover { color: var(--ink-stamp) !important; }`}</style>

      {/* Hero */}
      <div style={{ background: 'var(--ink-wire)', padding: '48px 18px 40px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link to="/" className="ink-mono ink-privacy-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(238,234,223,.75)', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={26} color="var(--ink-stamp)" />
            </div>
            <div>
              <div className="ink-stamp-badge" style={{ marginBottom: 8 }}>Legal</div>
              <h1 className="ink-serif" style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 600, color: '#eeeadf', margin: '0 0 6px', lineHeight: 1.1 }}>
                Privacy Policy
              </h1>
              <p className="ink-mono" style={{ fontSize: 12, color: 'rgba(238,234,223,.6)', margin: 0 }}>Last updated: February 15, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 18px 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>

          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>

            <div className="ink-card" style={card}>
              <p style={{ fontSize: 15, color: c.body, lineHeight: 1.8, margin: 0 }}>
                At <strong style={{ color: c.stamp }}>SYDLINES MEDIA</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </div>

            <div className="ink-card" style={card}>
              <SectionHeading icon={FileText}>Information We Collect</SectionHeading>

              <div style={{ paddingLeft: 18, borderLeft: '3px solid var(--ink-stamp)', marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: c.heading, marginBottom: 10, marginTop: 0 }}>Personal Information</h3>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 10 }}>
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <BulletItem>Subscribe to our newsletter</BulletItem>
                  <BulletItem>Submit comments on articles</BulletItem>
                  <BulletItem>Contact us through our contact form</BulletItem>
                </ul>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
                  This may include your name, email address, phone number, and any other information you choose to provide.
                </p>
              </div>

              <div style={{ paddingLeft: 18, borderLeft: '3px solid var(--ink-wire-bright)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: c.heading, marginBottom: 10, marginTop: 0 }}>Automatically Collected Information</h3>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 10 }}>
                  When you visit our website, we automatically collect certain information about your device, including:
                </p>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <BulletItem>IP address and browser type</BulletItem>
                  <BulletItem>Operating system and device information</BulletItem>
                  <BulletItem>Pages visited and time spent on pages</BulletItem>
                  <BulletItem>Referring website addresses</BulletItem>
                  <BulletItem>Cookie data and unique identifiers</BulletItem>
                </ul>
              </div>
            </div>

            <div className="ink-card" style={card}>
              <SectionHeading icon={UserCheck}>How We Use Your Information</SectionHeading>
              <div style={{ background: 'var(--ink-paper-dim)', padding: '18px 20px', border: '1px solid var(--ink-rule)' }}>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 14, marginTop: 0 }}>We use the information we collect to:</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  <CheckItem>Provide, operate, and maintain our website and services</CheckItem>
                  <CheckItem>Send you newsletters, updates, and promotional materials (with your consent)</CheckItem>
                  <CheckItem>Respond to your comments, questions, and provide customer support</CheckItem>
                  <CheckItem>Analyze usage patterns and improve our content and user experience</CheckItem>
                  <CheckItem>Detect, prevent, and address technical issues or fraudulent activity</CheckItem>
                  <CheckItem>Comply with legal obligations and protect our rights</CheckItem>
                </ul>
              </div>
            </div>

            <div className="ink-card" style={card}>
              <SectionHeading icon={Eye}>Cookies and Tracking Technologies</SectionHeading>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 16 }}>
                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small data files stored on your device.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)', padding: '14px 16px' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: c.heading, marginBottom: 6, marginTop: 0 }}>Essential Cookies</h4>
                  <p style={{ fontSize: 13, color: c.muted, margin: 0, lineHeight: 1.6 }}>Required for the website to function properly. These cannot be disabled.</p>
                </div>
                <div style={{ background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)', padding: '14px 16px' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: c.heading, marginBottom: 6, marginTop: 0 }}>Analytics Cookies</h4>
                  <p style={{ fontSize: 13, color: c.muted, margin: 0, lineHeight: 1.6 }}>Help us understand how visitors interact with our website.</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </div>

            <div className="ink-card" style={card}>
              <SectionHeading icon={Lock}>Data Security</SectionHeading>
              <div style={{ borderLeft: '3px solid var(--ink-stamp)', background: 'var(--ink-paper-dim)', padding: '16px 20px' }}>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 10, marginTop: 0 }}>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                  However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>
            </div>

            <div className="ink-card" style={card}>
              <h2 className="ink-serif" style={{ fontSize: 21, fontWeight: 600, color: c.heading, marginBottom: 14, marginTop: 0 }}>Third-Party Links</h2>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                Our website may contain links to third-party websites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.
              </p>
            </div>

            <div className="ink-card" style={card}>
              <h2 className="ink-serif" style={{ fontSize: 21, fontWeight: 600, color: c.heading, marginBottom: 14, marginTop: 0 }}>Changes to This Privacy Policy</h2>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div style={{ background: 'var(--ink-wire)', padding: '28px 30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={21} color="var(--ink-stamp)" />
                </div>
                <h2 className="ink-serif" style={{ fontSize: 21, fontWeight: 600, color: '#eeeadf', margin: 0 }}>Contact Us</h2>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(238,234,223,.75)', lineHeight: 1.7, marginBottom: 16 }}>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {[
                  { label: 'Email', value: 'privacy@sydlinesmedia.com' },
                  { label: 'Phone', value: '+234 704 6678 039' },
                  { label: 'Address', value: '123 Media Avenue, Victoria Island, Lagos, Nigeria' },
                ].map(({ label, value }) => (
                  <p key={label} className="ink-mono" style={{ fontSize: 13, margin: 0, color: 'rgba(238,234,223,.75)' }}>
                    <strong style={{ color: '#eeeadf' }}>{label}:</strong> {value}
                  </p>
                ))}
              </div>
              <Link to="/contact" className="ink-btn ink-btn-stamp">
                <Mail size={15} />
                Send Us a Message
              </Link>
            </div>

            <p className="ink-mono" style={{ textAlign: 'center', fontSize: 12, color: c.faint, marginTop: 24 }}>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>

          {/* Sidebar */}
          <div>
            <div className="ink-card" style={{ padding: 24, marginBottom: 18 }}>
              <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, color: c.heading, margin: '0 0 18px' }}>Your Privacy Rights</h3>
              <div>
                <RightCard title="Access &amp; Portability">
                  You have the right to request a copy of the personal information we hold about you.
                </RightCard>
                <RightCard title="Correction">
                  You can request that we correct any inaccurate or incomplete personal information.
                </RightCard>
                <RightCard title="Deletion">
                  You may request that we delete your personal information, subject to certain legal exceptions.
                </RightCard>
                <RightCard title="Opt-Out">
                  You can unsubscribe from our marketing communications at any time by clicking the unsubscribe link in our emails.
                </RightCard>
              </div>
            </div>

            <div className="ink-card" style={{ padding: 24, marginBottom: 18 }}>
              <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, color: c.heading, margin: '0 0 18px' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/contact', label: 'Contact Us' },
                  { href: '/terms', label: 'Terms of Service' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="ink-privacy-link" style={{ fontSize: 13, color: c.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <span style={{ color: c.stamp }}>&rarr;</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)', padding: 24 }}>
              <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, color: c.heading, margin: '0 0 16px' }}>At a Glance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'We never sell your data',
                  'You can delete your info anytime',
                  'Cookies can be disabled',
                  'We respond within 24–48 hrs',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, background: 'var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: '#fff', fontWeight: 800 }}>&#10003;</span>
                    </div>
                    <span style={{ fontSize: 13, color: c.body, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Privacy;