
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
    {
      icon: Target,
      title: 'Accuracy First',
      description: 'We verify every fact and source before publishing, ensuring our readers get reliable information.',
    },
    {
      icon: Users,
      title: 'Reader-Focused',
      description: 'Our content is crafted with you in mind, delivering news that matters to your daily life.',
    },
    {
      icon: Zap,
      title: 'Breaking News',
      description: 'Stay ahead with real-time updates on the stories shaping our world.',
    },
    {
      icon: Award,
      title: 'Quality Journalism',
      description: 'Our team of experienced journalists brings depth and context to every story.',
    },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#f8fafc', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        @keyframes pulse  { 0%,100%{opacity:1;}50%{opacity:.5;} }
      `}</style>

      {/* Hero Header */}
      <div style={{ background:'linear-gradient(135deg,#0f1a12 0%,#14532d 60%,#166534 100%)', padding:'80px 24px 120px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-30%', right:'-5%', width:600, height:600, borderRadius:'50%', background:'rgba(74,222,128,.05)' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(74,222,128,.12)', border:'1px solid rgba(74,222,128,.25)', borderRadius:100, padding:'5px 14px', marginBottom:20 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'block', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:12, fontWeight:700, color:'#4ade80', letterSpacing:1 }}>ABOUT US</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(40px,7vw,68px)', fontWeight:800, color:'white', marginBottom:20, lineHeight:1.1 }}>
            About Inkstone
          </h1>
          <p style={{ color:'#86efac', fontSize:'clamp(16px,2vw,22px)', maxWidth:680, margin:'0 auto', lineHeight:1.7 }}>
            Delivering truth, transparency, and timely news to readers worldwide since 2010.
          </p>
        </div>
        <div style={{ position:'absolute', bottom:-2, left:0, right:0 }}>
          <svg viewBox="0 0 1440 48" fill="#f8fafc" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:48 }}>
            <path d="M0,28 C360,60 1080,0 1440,28 L1440,48 L0,48 Z"/>
          </svg>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'-68px auto 0', padding:'0 24px 48px', position:'relative', zIndex:1 }}>

        {/* Stats Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:64, animation:'fadeUp .5s ease' }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} style={{ background:'white', borderRadius:20, padding:'28px 20px', textAlign:'center', border:'1px solid #f3f4f6', boxShadow:'0 8px 24px rgba(0,0,0,.08)', transition:'.2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                <Icon size={32} color="#16a34a" style={{ margin:'0 auto 12px' }} />
                <div style={{ fontSize:'clamp(28px,4vw,36px)', fontWeight:800, color:'#0f1a12', marginBottom:6, fontFamily:"'Playfair Display',serif" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize:13, color:'#6b7280', fontWeight:600 }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Mission Section */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center', marginBottom:64, animation:'fadeUp .5s ease .1s both' }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, color:'#0f1a12', marginBottom:24 }}>
              Our Mission
            </h2>
            <p style={{ fontSize:16, color:'#374151', lineHeight:1.8, marginBottom:16 }}>
              At Inkstone, we believe in the power of informed citizens. Our mission is to deliver accurate, unbiased news coverage that empowers readers to make informed decisions.
            </p>
            <p style={{ fontSize:16, color:'#374151', lineHeight:1.8, marginBottom:16 }}>
              We're committed to journalistic integrity, thorough fact-checking, and presenting diverse perspectives on the issues that matter most.
            </p>
            <p style={{ fontSize:16, color:'#374151', lineHeight:1.8 }}>
              Whether it's breaking news, in-depth analysis, or investigative reporting, we strive to be your trusted source for information in an ever-changing world.
            </p>
          </div>
          <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 12px 32px rgba(0,0,0,.12)', border:'1px solid #f3f4f6', height:380 }}>
            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800" alt="Newsroom" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
        </div>

        {/* Values Section */}
        <div style={{ background:'white', borderRadius:28, padding:'48px 32px', marginBottom:64, boxShadow:'0 4px 20px rgba(0,0,0,.07)', border:'1px solid #f3f4f6', animation:'fadeUp .5s ease .15s both' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, color:'#0f1a12', marginBottom:16 }}>
              Our Values
            </h2>
            <p style={{ fontSize:17, color:'#6b7280', maxWidth:600, margin:'0 auto' }}>
              The principles that guide our newsroom and editorial decisions every day.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:32 }}>
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} style={{ textAlign:'center', padding:24, borderRadius:16, transition:'.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                    <Icon size={28} color="#16a34a" />
                  </div>
                  <h3 style={{ fontSize:18, fontWeight:800, color:'#0f1a12', marginBottom:12, fontFamily:"'Playfair Display',serif" }}>
                    {value.title}
                  </h3>
                  <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.7 }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div style={{ marginBottom:64, animation:'fadeUp .5s ease .2s both' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, color:'#0f1a12', marginBottom:16 }}>
              Meet Our Team
            </h2>
            <p style={{ fontSize:17, color:'#6b7280', maxWidth:600, margin:'0 auto' }}>
              Experienced journalists dedicated to bringing you the news that matters.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {team.map((member, i) => (
              <div key={i} style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,.08)', border:'1px solid #f3f4f6', transition:'.2s' }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.12)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,.08)'}>
                <img src={member.image} alt={member.name} style={{ width:'100%', height:260, objectFit:'cover' }} />
                <div style={{ padding:24 }}>
                  <h3 style={{ fontSize:18, fontWeight:800, color:'#0f1a12', marginBottom:4, fontFamily:"'Playfair Display',serif" }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize:14, fontWeight:700, color:'#16a34a', marginBottom:12 }}>
                    {member.role}
                  </p>
                  <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.6 }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ background:'#0f1a12', color:'white', borderRadius:28, padding:'48px 32px', boxShadow:'0 12px 40px rgba(0,0,0,.15)', animation:'fadeUp .5s ease .25s both' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, marginBottom:16 }}>
              Get In Touch
            </h2>
            <p style={{ fontSize:17, color:'#86efac' }}>
              Have a story tip or question? We'd love to hear from you.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:32, maxWidth:900, margin:'0 auto' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(74,222,128,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Mail size={28} color="#4ade80" />
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Email Us</h3>
              <a href="mailto:contact@inkstone.com" style={{ color:'#86efac', textDecoration:'none', fontSize:15, transition:'.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#4ade80'}
                onMouseLeave={e=>e.currentTarget.style.color='#86efac'}>
                contact@inkstone.com
              </a>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(74,222,128,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Phone size={28} color="#4ade80" />
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Call Us</h3>
              <a href="tel:+1234567890" style={{ color:'#86efac', textDecoration:'none', fontSize:15, transition:'.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#4ade80'}
                onMouseLeave={e=>e.currentTarget.style.color='#86efac'}>
                +1 (234) 567-890
              </a>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(74,222,128,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <MapPin size={28} color="#4ade80" />
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Visit Us</h3>
              <p style={{ color:'#86efac', fontSize:15, lineHeight:1.6 }}>
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