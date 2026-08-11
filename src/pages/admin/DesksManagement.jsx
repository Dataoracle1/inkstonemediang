import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { desksAPI, adminAPI } from '../../utils/api';
import { PanelHeader, Badge, ActionBtn, confirmToast, LoadingBlock, EmptyBlock, inputStyle, labelStyle } from '../../components/admin/AdminUI';

const DesksManagement = () => {
  const [desks, setDesks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [canAssignEditor, setCanAssignEditor] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', editor: '', status: 'active' });

  useEffect(() => { fetchDesks(); fetchAdmins(); }, []);

  const fetchDesks = async () => {
    try {
      setLoading(true);
      const res = await desksAPI.getAll();
      setDesks(res.data.data.desks);
    } catch (error) {
      console.error('Fetch desks error:', error);
      toast.error('Failed to load desks');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await adminAPI.getAll();
      setAdmins(res.data.data.admins);
    } catch {
      // Only super admins can list all admins — non-super admins simply
      // won't get an editor picker; the field disables gracefully below.
      setCanAssignEditor(false);
    }
  };

  const openNew = () => { setEditing(null); setForm({ name: '', editor: '', status: 'active' }); setShowForm(true); };
  const openEdit = (desk) => { setEditing(desk); setForm({ name: desk.name, editor: desk.editor?._id || '', status: desk.status }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading(editing ? 'Updating desk...' : 'Creating desk...');
    try {
      const payload = { ...form, editor: form.editor || null };
      if (editing) await desksAPI.update(editing._id, payload);
      else await desksAPI.create(payload);
      toast.success(editing ? 'Desk updated!' : 'Desk created!', { id: tid });
      setShowForm(false);
      fetchDesks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save desk', { id: tid });
    }
  };

  const handleDelete = (desk) => confirmToast(`Delete "${desk.name}"?`, 'Stories assigned to this desk will keep their history but lose the desk link.', async () => {
    const tid = toast.loading('Deleting...');
    try {
      await desksAPI.delete(desk._id);
      toast.success('Desk deleted!', { id: tid });
      fetchDesks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete', { id: tid });
    }
  });

  const filtered = desks.filter(d => !search.trim() || d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PanelHeader
        title="Desks"
        description="Manage news desks and assign editors."
        action={<button onClick={openNew} className="ink-btn ink-btn-stamp"><Plus size={15} /> Add Desk</button>}
      />

      {showForm && (
        <div className="ink-card" style={{ padding: 22, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>{editing ? 'Edit Desk' : 'New Desk'}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Editor {!canAssignEditor && '(super admin only)'}</label>
              <select value={form.editor} onChange={e => setForm({ ...form, editor: e.target.value })} disabled={!canAssignEditor} style={{ ...inputStyle, opacity: canAssignEditor ? 1 : .6 }}>
                <option value="">Unassigned</option>
                {admins.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="ink-btn ink-btn-stamp">{editing ? 'Update' : 'Create'} Desk</button>
            </div>
          </form>
        </div>
      )}

      <div className="ink-card" style={{ padding: 20 }}>
        <div style={{ position: 'relative', width: 240, marginBottom: 16 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
          <input type="text" placeholder="Search desks..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 32 }} />
        </div>

        {loading ? <LoadingBlock label="Loading desks..." /> : filtered.length === 0 ? <EmptyBlock label="No desks yet." /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                  {['Desk', 'Editor', 'Stories', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className="ink-mono" style={{ textAlign: i === 0 ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(desk => (
                  <tr key={desk._id} style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, fontSize: 13, color: 'var(--ink-ink)' }}>{desk.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{desk.editor?.name || '—'}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{desk.storyCount || 0}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={desk.status === 'active' ? 'positive' : 'neutral'}>{desk.status}</Badge></td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <ActionBtn icon={<Edit2 size={14} />} onClick={() => openEdit(desk)} title="Edit" tone="positive" />
                        <ActionBtn icon={<Trash2 size={14} />} onClick={() => handleDelete(desk)} title="Delete" tone="danger" />
                      </div>
                    </td>
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

export default DesksManagement;