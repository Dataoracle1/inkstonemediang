import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, Users, Zap } from 'lucide-react';

const AnalyticsPanel = () => {
  const [analytics, setAnalytics] = useState({
    totalViews: 45230,
    uniqueUsers: 12450,
    avgSessionTime: '3m 42s',
    topPost: 'Breaking News Article',
    topPostViews: 1250,
  });

  const stats = [
    { icon: Eye, label: 'Total Page Views', value: analytics.totalViews, change: '+12.5%' },
    { icon: Users, label: 'Unique Visitors', value: analytics.uniqueUsers, change: '+8.2%' },
    { icon: Zap, label: 'Avg. Session Time', value: analytics.avgSessionTime, change: '+2.1%' },
    { icon: TrendingUp, label: 'Bounce Rate', value: '42.3%', change: '-5.4%' },
  ];

  return (
    <div>
      <style>{`
        .analytics-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .analytics-card { background: white; border: 1px solid #e8e4dd; border-radius: 8px; padding: 20px; }
        .analytics-icon { width: 48px; height: 48px; background: rgba(196,66,47,.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #C4422F; margin-bottom: 12px; }
        .analytics-label { font-family: "IBM Plex Mono", monospace; font-size: 11px; color: #64748B; letter-spacing: .08em; }
        .analytics-value { font-family: "Playfair Display", serif; font-size: 32px; font-weight: 700; color: #071A33; margin: 8px 0 0; }
        .analytics-change { font-size: 12px; color: #22c55e; font-weight: 600; margin-top: 8px; }
        .top-posts-section { background: white; border: 1px solid #e8e4dd; border-radius: 8px; padding: 24px; }
        .top-posts-title { font-family: "Playfair Display", serif; font-size: 18px; font-weight: 700; color: #071A33; margin: 0 0 20px; }
        .post-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #e8e4dd; }
        .post-item:last-child { border-bottom: none; padding-bottom: 0; }
        .post-name { font-weight: 600; color: #071A33; }
        .post-views { font-size: 12px; color: #64748B; font-family: "IBM Plex Mono", monospace; }
      `}</style>

      <h1 className="analytics-header">Analytics</h1>

      <div className="analytics-grid">
        {stats.map((stat, i) => (
          <div key={i} className="analytics-card">
            <div className="analytics-icon">
              <stat.icon size={24} />
            </div>
            <div className="analytics-label">{stat.label}</div>
            <div className="analytics-value">{stat.value}</div>
            <div className="analytics-change">{stat.change} from last month</div>
          </div>
        ))}
      </div>

      <div className="top-posts-section">
        <h2 className="top-posts-title">Top Performing Posts</h2>
        <div className="post-item">
          <span className="post-name">{analytics.topPost}</span>
          <span className="post-views">{analytics.topPostViews} views</span>
        </div>
        <div className="post-item">
          <span className="post-name">Technology Update</span>
          <span className="post-views">950 views</span>
        </div>
        <div className="post-item">
          <span className="post-name">Sports Highlights</span>
          <span className="post-views">820 views</span>
        </div>
        <div className="post-item">
          <span className="post-name">Business News</span>
          <span className="post-views">750 views</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;