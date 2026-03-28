import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, AlertTriangle, ClipboardList } from 'lucide-react';
import { claimsAPI } from '../utils/api';
import { mockClaims } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const CLAIM_TYPES = ['Medical', 'Accident', 'Property Damage', 'Theft', 'Natural Disaster', 'Other'];

export default function Claims() {
  const [claims, setClaims] = useState(mockClaims);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'Medical', amount: '', description: '' });

  useEffect(() => {
    claimsAPI.getAll().then(r => setClaims(r.data.claims)).catch(() => {});
  }, []);

  const filtered = claims.filter(c =>
    (c.claimNumber?.toLowerCase().includes(search.toLowerCase()) ||
     c.customer?.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || c.status === filterStatus)
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    const fraudScore = Math.floor(Math.random() * 100);
    const mock = {
      _id: Date.now(), claimNumber: 'CLM-' + Date.now().toString().slice(-6), ...form,
      customer: { name: 'New Customer' }, status: 'Pending',
      fraudScore, isFlagged: fraudScore > 60, submittedAt: new Date().toISOString()
    };
    setClaims([mock, ...claims]);
    setShowModal(false);
    toast.success(`Claim submitted. Fraud score: ${fraudScore}/100 ${fraudScore > 60 ? '⚠️ Flagged' : '✓ Clear'}`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Claims</h1>
          <p className="text-secondary text-sm mt-0.5">{claims.filter(c => c.isFlagged).length} flagged for fraud review</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> File Claim
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claims..."
            className="w-full bg-surface-900 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand-500/50" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-surface-900 border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none">
          <option value="">All Status</option>
          {['Pending', 'Under Review', 'Approved', 'Rejected', 'Paid'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card bg-surface-900 border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02]">
              <tr className="border-b border-white/[0.06]">
                {['Claim #', 'Type', 'Customer', 'Amount (₹)', 'Status', 'Fraud Score', 'Submitted', 'Actions'].map(h => (
                  <th key={h} className="text-left text-slate-500 font-medium py-3 px-4 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className={`hover:bg-white/[0.02] transition-colors ${c.isFlagged ? 'bg-red-500/[0.03]' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {c.isFlagged && <AlertTriangle size={12} className="text-red-400 shrink-0" />}
                      <span className="font-mono text-xs text-slate-400">{c.claimNumber}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{c.type}</td>
                  <td className="py-3 px-4 text-slate-200 font-medium">{c.customer?.name || '—'}</td>
                  <td className="py-3 px-4 text-slate-300">{Number(c.amount).toLocaleString()}</td>
                  <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.fraudScore < 40 ? 'bg-brand-500' : c.fraudScore < 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${c.fraudScore}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${c.fraudScore > 60 ? 'text-red-400' : 'text-slate-400'}`}>{c.fraudScore}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{new Date(c.submittedAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">Review</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <ClipboardList size={32} className="mx-auto mb-3 opacity-30" />
              <p>No claims found</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/[0.1] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-display font-bold text-white mb-5">File New Claim</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Claim Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  {CLAIM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Claim Amount (₹)</label>
                <input type="number" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder="50000" className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the incident..." className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none resize-none" />
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400">
                ⚡ AI fraud detection will automatically analyze this claim upon submission.
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-white/[0.1] text-slate-300 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.04] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">Submit Claim</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
