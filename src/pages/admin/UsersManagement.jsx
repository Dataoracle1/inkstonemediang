import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Key, Copy, Check, Shield, Trash2, X } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { PanelHeader, Badge, ActionBtn, Section, confirmToast, inputStyle, labelStyle } from '../../components/admin/AdminUI';

const roleTone = (role) => role === 'super-admin' ? 'accent' : role === 'editor' ? 'positive' : role === 'moderator' ? 'warn' : 'neutral';

const UsersManagement = () => {
  const { admin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [inviteCodes, setInviteCodes] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [inviteFormData, setInviteFormData] = useState({ role: 'admin', expiresInDays: 7, isSingleUse: true, maxUses: 1, note: '' });

  useEffect(() => { fetchAdmins(); fetchInviteCodes(); }, []);

  const fetchAdmins = async () => {
    try { const r = await adminAPI.getAll(); setAdmins(r.data.data.admins); } catch { toast.error('Failed to load admins'); }
  };
  const fetchInviteCodes = async () => {
    try { const r = await adminAPI.getInviteCodes(); setInviteCodes(r.data.data.inviteCodes); } catch { toast.error('Failed to load invite codes'); }
  };

  const handleDeleteAdmin = (adminId) => confirmToast('Delete this admin?', 'Access will be revoked immediately.', async () => {
    const tid = toast.loading('Deleting...');
    try { await adminAPI.deleteAdmin(adminId); toast.success('Admin deleted!', { id: tid }); fetchAdmins(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed', { id: tid }); }
  });

  const handleRevokeInvite = (id) => confirmToast('Revoke invite code?', 'It will no longer be usable.', async () => {
    const tid = toast.loading('Revoking...');
    try { await adminAPI.revokeInvite(id); toast.success('Invite revoked!', { id: tid }); fetchInviteCodes(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed', { id: tid }); }
  }, 'Revoke');

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Creating admin...');
    try {
      await adminAPI.createAdmin(adminFormData);
      toast.success('Admin created!', { id: tid });
      setShowAdminForm(false); setAdminFormData({ name: '', email: '', password: '', role: 'admin' }); fetchAdmins();
    } catch (err) { toast.error('Error: ' + (err.response?.data?.message || 'Failed'), { id: tid }); }
  };

  const handleUpdateAdmin = async (adminId, updates) => {
    const tid = toast.loading('Updating...');
    try { await adminAPI.updateAdmin(adminId, updates); toast.success('Updated!', { id: tid }); fetchAdmins(); }
    catch { toast.error('Failed to update', { id: tid }); }
  };

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Generating...');
    try {
      await adminAPI.generateInvite(inviteFormData);
      toast.success('Invite code generated!', { id: tid });
      setShowInviteForm(false);
      setInviteFormData({ role: 'admin', expiresInDays: 7, isSingleUse: true, maxUses: 1, note: '' });
      fetchInviteCodes();
    } catch (err) { toast.error('Error: ' + (err.response?.data?.message || 'Failed'), { id: tid }); }
  };

  const handleCopyInviteLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/admin/signup?code=${code}`);
    setCopiedCode(code); toast.success('Link copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div>
      <PanelHeader title="Users &amp; Roles" description="Manage users, roles, and permissions." />

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setShowAdminForm(true)} className="ink-btn ink-btn-stamp">
          <UserPlus size={15} /> Create Admin
        </button>
        <button onClick={() => setShowInviteForm(true)} className="ink-btn">
          <Key size={15} /> Generate Invite
        </button>
      </div>

      {showAdminForm && (
        <div className="ink-card" style={{ marginBottom: 20, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Create New Admin</h3>
            <button onClick={() => setShowAdminForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
            {[['Name', 'text', 'name'], ['Email', 'email', 'email'], ['Password', 'password', 'password']].map(([lbl, type, key]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl} *</label>
                <input type={type} value={adminFormData[key]} onChange={e => setAdminFormData({ ...adminFormData, [key]: e.target.value })} required style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Role *</label>
              <select value={adminFormData.role} onChange={e => setAdminFormData({ ...adminFormData, role: e.target.value })} style={inputStyle}>
                <option value="admin">Admin</option><option value="editor">Editor</option><option value="moderator">Moderator</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="ink-btn ink-btn-stamp">Create Admin</button>
            </div>
          </form>
        </div>
      )}

      {showInviteForm && (
        <div className="ink-card" style={{ marginBottom: 20, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 className="ink-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ink-ink)' }}>Generate Invite Code</h3>
            <button onClick={() => setShowInviteForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleGenerateInvite} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
              <div>
                <label style={labelStyle}>Role</label>
                <select value={inviteFormData.role} onChange={e => setInviteFormData({ ...inviteFormData, role: e.target.value })} style={inputStyle}>
                  <option value="admin">Admin</option><option value="editor">Editor</option><option value="moderator">Moderator</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Expires (Days)</label>
                <input type="number" min={1} max={365} value={inviteFormData.expiresInDays} onChange={e => setInviteFormData({ ...inviteFormData, expiresInDays: parseInt(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Max Uses</label>
                <input type="number" min={1} max={100} value={inviteFormData.maxUses} disabled={inviteFormData.isSingleUse} onChange={e => setInviteFormData({ ...inviteFormData, maxUses: parseInt(e.target.value) })} style={{ ...inputStyle, opacity: inviteFormData.isSingleUse ? .5 : 1 }} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-ink-soft)' }}>
              <input type="checkbox" checked={inviteFormData.isSingleUse} onChange={e => setInviteFormData({ ...inviteFormData, isSingleUse: e.target.checked, maxUses: e.target.checked ? 1 : inviteFormData.maxUses })} style={{ width: 16, height: 16, accentColor: 'var(--ink-stamp)' }} />
              Single Use Only
            </label>
            <div>
              <label style={labelStyle}>Note (Optional)</label>
              <input type="text" value={inviteFormData.note} onChange={e => setInviteFormData({ ...inviteFormData, note: e.target.value })} placeholder="For marketing team..." style={inputStyle} />
            </div>
            <button type="submit" className="ink-btn ink-btn-stamp" style={{ alignSelf: 'flex-start' }}>Generate Code</button>
          </form>
        </div>
      )}

      <Section title={`All Users (${admins.length})`}>
        <div className="ink-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} className="ink-mono" style={{ textAlign: h === 'Name' || h === 'Email' ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map(adminUser => (
                <tr key={adminUser._id} style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--ink-stamp)', flexShrink: 0 }}>{adminUser.name[0].toUpperCase()}</div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-ink)' }}>{adminUser.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{adminUser.email}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={roleTone(adminUser.role)}>{adminUser.role}</Badge></td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <Badge tone={adminUser.isActive ? 'positive' : 'danger'}>{adminUser.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                      {adminUser._id !== admin.id && adminUser.role !== 'super-admin' ? (
                        <>
                          <ActionBtn icon={<Shield size={14} />} onClick={() => handleUpdateAdmin(adminUser._id, { isActive: !adminUser.isActive })} title={adminUser.isActive ? 'Deactivate' : 'Activate'} tone={adminUser.isActive ? 'positive' : 'neutral'} />
                          <ActionBtn icon={<Trash2 size={14} />} onClick={() => handleDeleteAdmin(adminUser._id)} title="Delete" tone="danger" />
                        </>
                      ) : (
                        <span className="ink-mono" style={{ fontSize: 11, color: 'var(--ink-ink-soft)' }}>You</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`Invite Codes (${inviteCodes.length})`}>
        <div className="ink-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ink-rule)' }}>
                {['Code', 'Role', 'Status', 'Uses', 'Expires', 'Actions'].map(h => (
                  <th key={h} className="ink-mono" style={{ textAlign: h === 'Code' ? 'left' : 'center', padding: '10px 12px', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inviteCodes.map(invite => {
                const isExpired = new Date(invite.expiresAt) < new Date();
                const label = invite.isRevoked ? 'Revoked' : invite.isUsed ? 'Used' : isExpired ? 'Expired' : 'Active';
                const tone = invite.isRevoked ? 'danger' : invite.isUsed ? 'neutral' : isExpired ? 'warn' : 'positive';
                return (
                  <tr key={invite._id} style={{ borderBottom: '1px solid var(--ink-rule)' }}>
                    <td style={{ padding: '12px' }}>
                      <code className="ink-mono" style={{ background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', padding: '4px 10px', fontSize: 11, fontWeight: 700, border: '1px solid var(--ink-rule)' }}>{invite.code}</code>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={roleTone(invite.role)}>{invite.role}</Badge></td>
                    <td style={{ padding: '12px', textAlign: 'center' }}><Badge tone={tone}>{label}</Badge></td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13, color: 'var(--ink-ink-soft)' }}>{invite.usageCount} / {invite.maxUses}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 11, color: 'var(--ink-ink-soft)', whiteSpace: 'nowrap' }} className="ink-mono">{new Date(invite.expiresAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <ActionBtn icon={copiedCode === invite.code ? <Check size={14} /> : <Copy size={14} />} onClick={() => handleCopyInviteLink(invite.code)} title="Copy Link" tone="positive" />
                        {!invite.isRevoked && <ActionBtn icon={<X size={14} />} onClick={() => handleRevokeInvite(invite._id)} title="Revoke" tone="danger" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
};

export default UsersManagement;