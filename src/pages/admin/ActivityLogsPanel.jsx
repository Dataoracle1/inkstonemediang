import React, { useState, useEffect } from 'react';
import { activityLogsAPI } from '../../utils/api';
import { PanelHeader, Badge, LoadingBlock, EmptyBlock, inputStyle } from '../../components/admin/AdminUI';
import { formatDistanceToNow } from 'date-fns';

const MODULES = ['all', 'Stories', 'Categories', 'Desks', 'Users', 'Messages', 'Newsletter', 'Media Library', 'Settings'];

const ActivityLogsPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState('all');

  useEffect(() => { fetchLogs(); }, [module]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await activityLogsAPI.getAll({ module, limit: 80 });
      setLogs(res.data.data.logs);
    } catch (error) {
      console.error('Fetch activity logs error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelHeader title="Activity Logs" description="Track all important actions across the platform." />

      <div className="ink-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          <select value={module} onChange={e => setModule(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            {MODULES.map(m => <option key={m} value={m}>{m === 'all' ? 'All Modules' : m}</option>)}
          </select>
        </div>

        {loading ? <LoadingBlock label="Loading activity..." /> : logs.length === 0 ? <EmptyBlock label="No activity logged yet." /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                  {['User', 'Action', 'Module', 'Description', 'Time'].map((h, i) => (
                    <th key={h} className="ink-mono" style={{ textAlign: i < 1 ? 'left' : 'left', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id} style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: 'var(--ink-ink)', whiteSpace: 'nowrap' }}>{log.adminName}</td>
                    <td style={{ padding: '10px 12px' }}><Badge tone="positive">{log.action}</Badge></td>
                    <td style={{ padding: '10px 12px' }}><Badge tone="neutral">{log.module}</Badge></td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{log.description}</td>
                    <td className="ink-mono" style={{ padding: '10px 12px', fontSize: 11, color: 'var(--ink-ink-soft)', whiteSpace: 'nowrap' }}>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPanel;