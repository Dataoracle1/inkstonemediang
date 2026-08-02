import { Users, Target, Award, Zap, Mail, MapPin, Phone } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Articles Published', value: '10,000+', icon: Award },
    { label: 'Active Readers', value: '500K+', icon: Users },
    { label: 'Countries Reached', value: '150+', icon: MapPin },
    { label: 'Daily Updates', value: '50+', icon: Zap },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Editor in Chief',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: '15+ years in journalism with focus on investigative reporting.',
    },
    {
      name: 'Michael Chen',
      role: 'Lead Tech Reporter',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Covering technology trends and innovation for over a decade.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Politics Editor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Award-winning political analyst and columnist.',
    },
    {
      name: 'David Kim',
      role: 'Business Correspondent',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Expert in global markets and economic policy.',
    },
  ];

  const values = [
    { icon: Target, title: 'Accuracy First', description: 'We verify every fact and source before publishing, ensuring our readers get reliable information.' },
    { icon: Users, title: 'Reader-Focused', description: 'Our content is crafted with you in mind, delivering news that matters to your daily life.' },
    { icon: Zap, title: 'Breaking News', description: 'Stay ahead with real-time updates on the stories shaping our world.' },
    { icon: Award, title: 'Quality Journalism', description: 'Our team of experienced journalists brings depth and context to every story.' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'var(--ink-wire)', padding: '64px 18px 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: 'radial-gradient(circle, var(--ink-wire-bright) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="ink-stamp-badge ink-live" style={{ marginBottom: 20 }}>
            <span className="ink-dot" />About Us
          </div>
          <h1 className="ink-serif" style={{ fontSize: 'clamp(36px,7vw,60px)', fontWeight: 600, color: '#eeeadf', marginBottom: 20, lineHeight: 1.05 }}>
            About Ink<em style={{ fontStyle: 'italic', color: 'var(--ink-stamp)' }}>stone</em>
          </h1>
          <p className="ink-mono" style={{ color: 'rgba(238,234,223,.7)', fontSize: 14, maxWidth: 620, margin: '0 auto', lineHeight: 1.8 }}>
            Delivering truth, transparency, and timely news to readers worldwide since 2010.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '-48px auto 0', padding: '0 18px 48px', position: 'relative', zIndex: 1 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 56 }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="ink-card" style={{ padding: '24px 18px', textAlign: 'center' }}>
                <Icon size={26} color="var(--ink-stamp)" style={{ margin: '0 auto 10px' }} />
                <div className="ink-serif" style={{ fontSize: 'clamp(24px,4vw,30px)', fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 56 }} className="ink-about-grid">
          <style>{`@media (max-width:900px){ .ink-about-grid { grid-template-columns: 1fr !important; } }`}</style>
          <div>
            <h2 className="ink-serif" style={{ fontSize: 32, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 20 }}>Our Mission</h2>
            <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', lineHeight: 1.8, marginBottom: 14 }}>
              At Sydlines, we believe in the power of informed citizens. Our mission is to deliver accurate, unbiased news coverage that empowers readers to make informed decisions.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', lineHeight: 1.8, marginBottom: 14 }}>
              We're committed to journalistic integrity, thorough fact-checking, and presenting diverse perspectives on the issues that matter most.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', lineHeight: 1.8 }}>
              Whether it's breaking news, in-depth analysis, or investigative reporting, we strive to be your trusted source for information in an ever-changing world.
            </p>
          </div>
          <div className="ink-card" style={{ overflow: 'hidden', height: 340 }}>
            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800" alt="Newsroom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Values */}
        <div className="ink-card" style={{ padding: '40px 28px', marginBottom: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 className="ink-serif" style={{ fontSize: 32, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 12 }}>Our Values</h2>
            <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', maxWidth: 560, margin: '0 auto' }}>
              The principles that guide our newsroom and editorial decisions every day.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28 }}>
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <Icon size={24} color="var(--ink-stamp)" />
                  </div>
                  <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 10 }}>{value.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', lineHeight: 1.7 }}>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 className="ink-serif" style={{ fontSize: 32, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 12 }}>Meet Our Team</h2>
            <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', maxWidth: 560, margin: '0 auto' }}>
              Experienced journalists dedicated to bringing you the news that matters.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 18 }}>
            {team.map((member, i) => (
              <div key={i} className="ink-card" style={{ overflow: 'hidden' }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
                <div style={{ padding: 20 }}>
                  <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 4 }}>{member.name}</h3>
                  <p className="ink-mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-stamp)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.04em' }}>{member.role}</p>
                  <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', lineHeight: 1.6 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: 'var(--ink-wire)', borderRadius: 2, padding: '40px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 className="ink-serif" style={{ fontSize: 32, fontWeight: 600, color: '#eeeadf', marginBottom: 12 }}>Get In Touch</h2>
            <p className="ink-mono" style={{ fontSize: 13, color: 'rgba(238,234,223,.7)' }}>Have a story tip or question? We'd love to hear from you.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Mail size={22} color="var(--ink-stamp)" />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#eeeadf' }}>Email Us</h3>
              <a href="mailto:contact@sydlines.com" className="ink-mono" style={{ color: 'rgba(238,234,223,.75)', textDecoration: 'none', fontSize: 13 }}>
                contact@sydlines.com
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Phone size={22} color="var(--ink-stamp)" />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#eeeadf' }}>Call Us</h3>
              <a href="tel:+1234567890" className="ink-mono" style={{ color: 'rgba(238,234,223,.75)', textDecoration: 'none', fontSize: 13 }}>
                +1 (234) 567-890
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <MapPin size={22} color="var(--ink-stamp)" />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#eeeadf' }}>Visit Us</h3>
              <p className="ink-mono" style={{ color: 'rgba(238,234,223,.75)', fontSize: 13, lineHeight: 1.6 }}>
                123 News Street<br />New York, NY 10001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;