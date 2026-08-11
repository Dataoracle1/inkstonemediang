import React, { useState, useEffect } from 'react';
import { FileText, Eye, Heart, Newspaper, Plus, Clock } from 'lucide-react';
import { postsAPI, analyticsAPI, activityLogsAPI, desksAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { StatCard, LoadingBlock } from '../../components/admin/AdminUI';
import { formatDistanceToNow } from 'date-fns';

// Small dependency-free line chart — avoids assuming a charting library is installed
const Sparkline = ({ data }) => {
  if (!data.length) return <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>No view data yet for this range.</p>;
  const max = Math.max(...data.map(d => d.views), 1);
  const w = 600, h = 160, pad = 10;
  const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.views / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 160, display: 'block' }} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="var(--ink-stamp)" strokeWidth="2.5" />
      {data.map((d, i) => {
        const x = pad + i * stepX;
        const y = h - pad - (d.views / max) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--ink-stamp)" />;
      })}
    </svg>
  );
};

const DashboardOverview = ({ onNewStory, onGoTo }) => {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [deskCount, setDeskCount] = useState(null);
  const [overview, setOverview] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, deskRes, overviewRes, topRes] = await Promise.all([
        postsAPI.getStats(),
        desksAPI.getAll().catch(() => null),
        analyticsAPI.getOverview(7).catch(() => null),
        analyticsAPI.getTopPosts(7, 5).catch(() => null),
      ]);
      setStats(statsRes.data.data);
      if (deskRes) setDeskCount(deskRes.data.data.total);
      if (overviewRes) setOverview(overviewRes.data.data);
      if (topRes) setTopPosts(topRes.data.data.posts);

      if (isSuperAdmin) {
        const logsRes = await activityLogsAPI.getAll({ limit: 6 }).catch(() => null);
        if (logsRes) setRecentActivity(logsRes.data.data.logs);
      }
    } catch (error) {
      console.error('Dashboard overview error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading dashboard..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 4px' }}>Dashboard Overview</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', margin: 0 }}>A real-time overview of your platform's performance, content, and activity.</p>
        </div>
        <button onClick={onNewStory} className="ink-btn ink-btn-stamp">
          <Plus size={15} /> Add New Story
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Stories" value={stats?.totalPosts} icon={FileText} />
        <StatCard label="Total Views" value={stats?.totalViews?.toLocaleString()} icon={Eye} />
        <StatCard label="Total Desks" value={deskCount} icon={Newspaper} />
        <StatCard label="Total Likes" value={stats?.totalLikes?.toLocaleString()} icon={Heart} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        <style>{`@media (max-width: 900px) { .dash-grid-2 { grid-template-columns: 1fr !important; } }`}</style>
        <div className="ink-card dash-grid-2" style={{ padding: 20, gridColumn: 'span 2' }}>
          <h3 className="ink-serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 16px' }}>Views Overview (Last 7 Days)</h3>
          {overview ? <Sparkline data={overview.dailySeries} /> : <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>No analytics data yet.</p>}
        </div>
      </div>

      <div className="dash-grid-2" style={{ display: 'grid', gridTemplateColumns: isSuperAdmin ? '1fr 1fr' : '1fr', gap: 20 }}>
        <div className="ink-card" style={{ padding: 20 }}>
          <h3 className="ink-serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 16px' }}>Top Performing Stories</h3>
          {topPosts.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>No story views tracked yet this week.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topPosts.map(({ post, views }, i) => (
                <div key={post._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="ink-serif" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-stamp)', width: 16 }}>{i + 1}</span>
                  <img src={post.image} alt={post.title} style={{ width: 40, height: 40, objectFit: 'cover', border: '1px solid var(--ink-rule)', flexShrink: 0 }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-ink)', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.title}</p>
                  <span className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)', flexShrink: 0 }}>{views} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {isSuperAdmin && (
          <div className="ink-card" style={{ padding: 20 }}>
            <h3 className="ink-serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 16px' }}>Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>No recent activity logged yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentActivity.map(log => (
                  <div key={log._id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Clock size={13} color="var(--ink-ink-soft)" style={{ marginTop: 3, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--ink-ink)', margin: 0 }}>
                        <strong>{log.adminName}</strong> {log.description}
                      </p>
                      <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', margin: '2px 0 0' }}>
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;