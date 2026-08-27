import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Users, MessageCircle, TrendingUp, Eye } from 'lucide-react';
import { adminAPI, postsAPI, commentsAPI } from '../utils/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats?.() || { data: { data: {} } };
        setStats(response.data.data || {});
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: FileText, label: 'Total Posts', value: stats?.totalPosts || 0, color: '#C4422F' },
    { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: '#071A33' },
    { icon: MessageCircle, label: 'Total Comments', value: stats?.totalComments || 0, color: '#64748B' },
    { icon: Eye, label: 'Total Views', value: stats?.totalViews || 0, color: '#22c55e' },
  ];

  return (
    <div style={{ padding: '32px 0' }}>
      <style>{`
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .stat-card { background: white; border: 1px solid #e8e4dd; border-radius: 8px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: all .2s; }
        .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); transform: translateY(-2px); }
        .stat-icon { width: 60px; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; flex-shrink: 0; }
        .stat-content h3 { font-family: "IBM Plex Mono", monospace; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #64748B; margin: 0 0 8px; font-weight: 600; }
        .stat-value { font-family: "Playfair Display", serif; font-size: 42px; font-weight: 700; color: #071A33; margin: 0; line-height: 1; }
        .overview-section h2 { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 20px; padding-bottom: 16px; border-bottom: 2px solid #C4422F; }
      `}</style>

      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 36, fontWeight: 700, color: '#071A33', margin: '0 0 40px' }}>Dashboard Overview</h1>

      <div className="stat-grid">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: card.color }}>
              <card.icon size={28} />
            </div>
            <div className="stat-content">
              <h3>{card.label}</h3>
              <div className="stat-value">{card.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-section">
        <h2>Quick Summary</h2>
        <div style={{ background: 'white', border: '1px solid #e8e4dd', borderRadius: 8, padding: 24 }}>
          <p style={{ fontSize: 16, color: '#17202A', lineHeight: 1.8, margin: 0 }}>
            Welcome to the SYDLINES admin dashboard. Here you can manage all aspects of your news platform, 
            including stories, categories, comments, users, and more. Use the sidebar menu to navigate to 
            different management sections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;