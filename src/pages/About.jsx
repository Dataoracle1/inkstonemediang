import React from 'react';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { isDark } = useTheme();

  return (
    <div style={{ backgroundColor: isDark ? '#0f1419' : '#ffffff', color: isDark ? '#fff' : '#000', minHeight: '100vh', padding: '60px 20px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '20px', color: isDark ? '#fff' : '#000' }}>
          About SYDLINES
        </h1>
        
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '24px' }}>
          SYDLINES is Nigeria's premier news platform dedicated to delivering smart news with real impact. Founded with a mission to provide accurate, timely, and insightful coverage of stories that matter to Nigerians and the world.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: isDark ? '#fff' : '#000', marginTop: '40px' }}>
          Our Mission
        </h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '24px' }}>
          To bring you news that shapes narratives, empowers decisions, and connects communities across Africa and beyond.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: isDark ? '#fff' : '#000', marginTop: '40px' }}>
          What We Cover
        </h2>
        <ul style={{ fontSize: '16px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginBottom: '24px', marginLeft: '20px' }}>
          <li>Breaking News - First on the story, always</li>
          <li>Technology - Innovation shaping Africa</li>
          <li>Business & Markets - Trends driving growth</li>
          <li>Sports - Where passion meets competition</li>
          <li>Entertainment - Culture and creativity</li>
          <li>Politics & Opinion - Analysis and perspectives</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: isDark ? '#fff' : '#000', marginTop: '40px' }}>
          Why Choose SYDLINES?
        </h2>
        <ul style={{ fontSize: '16px', lineHeight: 1.8, color: isDark ? '#aaa' : '#666', marginLeft: '20px' }}>
          <li>✓ Verified reporting from trusted journalists</li>
          <li>✓ Multiple perspectives on complex stories</li>
          <li>✓ Real-time updates on breaking news</li>
          <li>✓ In-depth analysis and investigations</li>
          <li>✓ Community-driven conversations</li>
        </ul>
      </div>
    </div>
  );
};

export default About;