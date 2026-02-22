import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';

// ── Dark mode hook (syncs with Navbar toggle) ──────────────────────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
};

const Privacy = () => {
  const isDark = useDarkMode();

  const c = {
    pageBg:     isDark ? '#0f172a' : '#f9fafb',
    cardBg:     isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : '#f3f4f6',
    cardShadow: isDark ? '0 4px 20px rgba(0,0,0,.25)' : '0 4px 20px rgba(0,0,0,.07)',
    heading:    isDark ? '#f1f5f9' : '#0f1a12',
    body:       isDark ? '#cbd5e1' : '#374151',
    muted:      isDark ? '#94a3b8' : '#6b7280',
    faint:      isDark ? '#64748b' : '#9ca3af',
    iconBg:     isDark ? 'rgba(22,163,74,.15)' : '#f0fdf4',
    divider:    isDark ? '#334155' : '#e5e7eb',
    green:      '#16a34a',
    greenDark:  '#15803d',
    greenLight: isDark ? '#4ade80' : '#15803d',
  };

  const card = {
    background: c.cardBg,
    borderRadius: 24,
    border: `1px solid ${c.cardBorder}`,
    boxShadow: c.cardShadow,
    padding: '28px 32px',
    transition: 'background .3s, border-color .3s',
    marginBottom: 24,
  };

  const SectionIcon = ({ icon: Icon, color }) => (
    <div style={{ width: 44, height: 44, background: c.iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color={color || c.green} />
    </div>
  );

  const SectionHeading = ({ icon: Icon, children, iconColor }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <SectionIcon icon={Icon} color={iconColor} />
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: c.heading, margin: 0 }}>
        {children}
      </h2>
    </div>
  );

  const CheckItem = ({ children }) => (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <span style={{ color: c.green, fontWeight: 800, marginTop: 1, flexShrink: 0 }}>✓</span>
      <span style={{ fontSize: 14, color: c.body, lineHeight: 1.7 }}>{children}</span>
    </li>
  );

  const BulletItem = ({ children }) => (
    <li style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 6, paddingLeft: 4 }}>
      {children}
    </li>
  );

  const RightCard = ({ title, children }) => (
    <div style={{ background: c.cardBg, borderRadius: 24, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, padding: '24px 28px', marginBottom: 20, transition: 'background .3s, border-color .3s' }}>
      <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 800, color: c.heading, marginBottom: 8, marginTop: 0 }}>{title}</h4>
      <p style={{ fontSize: 14, color: c.muted, lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg, fontFamily: 'DM Sans, sans-serif', transition: 'background .3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .privacy-link:hover { color: #16a34a !important; }
      `}</style>

      {/* ── Hero Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 60%, #166534 100%)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.85)', textDecoration: 'none', fontSize: 14, fontWeight: 600, marginBottom: 28, transition: 'color .2s' }}
            className="privacy-link">
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={30} color="white" />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.15)', padding: '5px 14px', borderRadius: 100, marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.9)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Legal</span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'white', margin: '0 0 6px', lineHeight: 1.15 }}>
                Privacy Policy
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', margin: 0 }}>Last updated: February 15, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, alignItems: 'start' }}>

          {/* ══ LEFT — Main content ══ */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>

            {/* Introduction */}
            <div style={{ ...card }}>
              <p style={{ fontSize: 16, color: c.body, lineHeight: 1.8, margin: 0 }}>
                At <strong style={{ color: c.green }}>INKSTONE MEDIA</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </div>

            {/* Information We Collect */}
            <div style={{ ...card }}>
              <SectionHeading icon={FileText}>Information We Collect</SectionHeading>

              <div style={{ paddingLeft: 20, borderLeft: `4px solid ${c.green}`, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: c.heading, marginBottom: 10, marginTop: 0 }}>Personal Information</h3>
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

              <div style={{ paddingLeft: 20, borderLeft: '4px solid #3b82f6' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: c.heading, marginBottom: 10, marginTop: 0 }}>Automatically Collected Information</h3>
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

            {/* How We Use Your Information */}
            <div style={{ ...card }}>
              <SectionHeading icon={UserCheck} iconColor="#16a34a">How We Use Your Information</SectionHeading>
              <div style={{ background: isDark ? 'rgba(22,163,74,.08)' : '#f0fdf4', borderRadius: 16, padding: '20px 24px' }}>
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

            {/* Cookies */}
            <div style={{ ...card }}>
              <SectionHeading icon={Eye} iconColor="#f97316">Cookies and Tracking Technologies</SectionHeading>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 18 }}>
                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small data files stored on your device.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
                <div style={{ background: isDark ? 'rgba(59,130,246,.1)' : '#eff6ff', borderRadius: 14, padding: '16px 18px' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#93c5fd' : '#1d4ed8', marginBottom: 6, marginTop: 0 }}>Essential Cookies</h4>
                  <p style={{ fontSize: 13, color: c.muted, margin: 0, lineHeight: 1.6 }}>Required for the website to function properly. These cannot be disabled.</p>
                </div>
                <div style={{ background: isDark ? 'rgba(139,92,246,.1)' : '#faf5ff', borderRadius: 14, padding: '16px 18px' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#c4b5fd' : '#7c3aed', marginBottom: 6, marginTop: 0 }}>Analytics Cookies</h4>
                  <p style={{ fontSize: 13, color: c.muted, margin: 0, lineHeight: 1.6 }}>Help us understand how visitors interact with our website.</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </div>

            {/* Data Security */}
            <div style={{ ...card }}>
              <SectionHeading icon={Lock} iconColor="#ef4444">Data Security</SectionHeading>
              <div style={{ background: isDark ? 'rgba(239,68,68,.08)' : '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '0 14px 14px 0', padding: '18px 22px' }}>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 10, marginTop: 0 }}>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                  However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>
            </div>

            {/* Third-Party Links */}
            <div style={{ ...card }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: c.heading, marginBottom: 14, marginTop: 0 }}>Third-Party Links</h2>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                Our website may contain links to third-party websites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.
              </p>
            </div>

            {/* Changes */}
            <div style={{ ...card }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: c.heading, marginBottom: 14, marginTop: 0 }}>Changes to This Privacy Policy</h2>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, margin: 0 }}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact CTA */}
            <div style={{ background: isDark ? 'rgba(22,163,74,.1)' : '#f0fdf4', borderRadius: 24, border: `1px solid ${isDark ? 'rgba(22,163,74,.25)' : '#bbf7d0'}`, padding: '32px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, background: c.iconBg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={24} color={c.green} />
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: c.heading, margin: 0 }}>Contact Us</h2>
              </div>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.7, marginBottom: 16 }}>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {[
                  { label: 'Email', value: 'privacy@inkstonemedia.com' },
                  { label: 'Phone', value: '+234 704 6678 039' },
                  { label: 'Address', value: '123 Media Avenue, Victoria Island, Lagos, Nigeria' },
                ].map(({ label, value }) => (
                  <p key={label} style={{ fontSize: 14, color: c.body, margin: 0 }}>
                    <strong style={{ color: c.heading }}>{label}:</strong> <span style={{ color: c.muted }}>{value}</span>
                  </p>
                ))}
              </div>
              <Link to="/contact"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(to right, #16a34a, #15803d)', color: 'white', textDecoration: 'none', padding: '13px 28px', borderRadius: 14, fontWeight: 800, fontSize: 14, boxShadow: '0 4px 16px rgba(22,163,74,.35)', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(22,163,74,.35)'; }}>
                <Mail size={17} />
                Send Us a Message
              </Link>
            </div>

            {/* Consent footer */}
            <p style={{ textAlign: 'center', fontSize: 13, color: c.faint, marginTop: 28 }}>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>

          {/* ══ RIGHT — Sidebar ══ */}
          <div>

            {/* Your Rights */}
            <div style={{ background: c.cardBg, borderRadius: 24, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, padding: '28px', marginBottom: 20, transition: 'background .3s, border-color .3s' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: c.heading, margin: '0 0 20px' }}>
                Your Privacy Rights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <RightCard title="Access & Portability">
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

            {/* Quick Links */}
            <div style={{ background: c.cardBg, borderRadius: 24, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, padding: '28px', marginBottom: 20, transition: 'background .3s, border-color .3s' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: c.heading, margin: '0 0 20px' }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/contact', label: 'Contact Us' },
                  { href: '/terms', label: 'Terms of Service' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="privacy-link"
                    style={{ fontSize: 14, color: c.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, transition: 'color .2s' }}>
                    <span style={{ color: c.green, fontWeight: 800 }}>→</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* At a Glance */}
            <div style={{ background: isDark ? 'rgba(22,163,74,.08)' : '#f0fdf4', borderRadius: 24, border: `1px solid ${isDark ? 'rgba(22,163,74,.2)' : '#bbf7d0'}`, padding: '28px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: c.heading, margin: '0 0 16px' }}>
                At a Glance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'We never sell your data',
                  'You can delete your info anytime',
                  'Cookies can be disabled',
                  'We respond within 24–48 hrs',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, background: c.green, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: 'white', fontWeight: 800 }}>✓</span>
                    </div>
                    <span style={{ fontSize: 14, color: c.body, fontWeight: 500 }}>{item}</span>
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