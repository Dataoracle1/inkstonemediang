import React, { useState, useEffect } from 'react';
import { Eye, Users, Clock, TrendingDown } from 'lucide-react';
import { analyticsAPI } from '../../utils/api';
import { PanelHeader, StatCard, LoadingBlock } from '../../components/admin/AdminUI';

const RANGES = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
];

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const BarChart = ({ data }) => {
  if (!data.length) return <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>No view data yet for this range.</p>;
  const max = Math.max(...data.map(d => d.views), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: '100%', height: Math.max((d.views / max) * 130, 3), background: 'var(--ink-stamp)', opacity: .85 }} title={`${d.date}: ${d.views} views`} />
          <span className="ink-mono" style={{ fontSize: 8.5, color: 'var(--ink-ink-soft)', writingMode: data.length > 20 ? 'vertical-rl' : 'horizontal-tb' }}>
            {d.date.slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsPanel = () => {
  const [days, setDays] = useState(7);
  const [overview, setOverview] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [days]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewRes, topRes] = await Promise.all([
        analyticsAPI.getOverview(days),
        analyticsAPI.getTopPosts(days, 5),
      ]);
      setOverview(overviewRes.data.data);
      setTopPosts(topRes.data.data.posts);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Analytics"
        description="Dive deeper into your performance insights."
        action={
          <div style={{ display: 'flex', gap: 4 }}>
            {RANGES.map(r => (
              <button key={r.days} onClick={() => setDays(r.days)} className="ink-mono"
                style={{ padding: '7px 14px', border: '1px solid var(--ink-rule)', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: days === r.days ? 'var(--ink-ink)' : 'transparent', color: days === r.days ? 'var(--ink-paper)' : 'var(--ink-ink-soft)' }}>
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      {loading ? <LoadingBlock label="Loading analytics..." /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
            <StatCard label="Total Views" value={overview?.totalViews?.toLocaleString()} icon={Eye} />
            <StatCard label="Unique Visitors" value={overview?.uniqueVisitors?.toLocaleString()} icon={Users} />
            <StatCard label="Avg. Time on Page" value={formatDuration(overview?.avgTimeSeconds)} icon={Clock} />
            <StatCard label="Bounce Rate" value={`${overview?.bounceRate ?? 0}%`} icon={TrendingDown} />
          </div>

          <div className="ink-card" style={{ padding: 20, marginBottom: 24 }}>
            <h3 className="ink-serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 18px' }}>Views Overview</h3>
            {overview && <BarChart data={overview.dailySeries} />}
          </div>

          <div className="ink-card" style={{ padding: 20 }}>
            <h3 className="ink-serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 16px' }}>Top Performing Stories</h3>
            {topPosts.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>No story views tracked yet for this range.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {topPosts.map(({ post, views }, i) => (
                  <div key={post._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="ink-serif" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-stamp)', width: 20 }}>{i + 1}</span>
                    <img src={post.image} alt={post.title} style={{ width: 48, height: 48, objectFit: 'cover', border: '1px solid var(--ink-rule)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                      <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-wire-bright)', margin: '3px 0 0' }}>{post.category}</p>
                    </div>
                    <span className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)', flexShrink: 0, fontWeight: 700 }}>{views} views</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPanel;