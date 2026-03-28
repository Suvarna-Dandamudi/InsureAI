import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { policiesAPI } from '../utils/api';
import { mockPolicies } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const TYPES = ['Health', 'Auto', 'Life', 'Property', 'Travel', 'Business'];

export default function Policies() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'Health', premium: '', coverageAmount: '', startDate: '', endDate: '', policyholderName: '', description: '', riskScore: 50 });

  useEffect(() => {
    policiesAPI.getAll().then(r => setPolicies(r.data.policies)).catch(() => {});
  }, []);

  const filtered = policies.filter(p =>
    (p.policyNumber?.toLowerCase().includes(search.toLowerCase()) ||
     p.holder?.name?.toLowerCase().includes(search.toLowerCase()) ||
     p.policyholderName?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || p.status === filterStatus)
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await policiesAPI.create(form);
      setPolicies([data, ...policies]);
      setShowModal(false);
      toast.success('Policy created successfully');
    } catch {
      // Add mock entry for demo
      const mock = { _id: Date.now(), policyNumber: 'POL-' + Date.now().toString().slice(-6), ...form, holder: { name: form.policyholderName || 'New Customer' }, status: 'Active' };
      setPolicies([mock, ...policies]);
      setShowModal(false);
      toast.success('Policy added (demo mode)');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Policies</h1>
          <p className="text-secondary text-sm mt-0.5">{policies.length} total policies</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> New Policy
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search policies..."
            className="input-field w-full pl-9 pr-4 focus:outline-none focus:border-brand-500/50" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="input-field px-4 focus:outline-none focus:border-brand-500/50">
          <option value="">All Status</option>
          {['Active', 'Expired', 'Cancelled', 'Pending'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="dark:bg-white/[0.02] light:bg-surface-50">
              <tr className="dark:border-b border-white/[0.06] light:border-b border-surface-200">
                {['Policy #', 'Type', 'Holder', 'Premium (₹)', 'Coverage (₹)', 'Status', 'Risk', 'Actions'].map(h => (
                  <th key={h} className="text-left text-muted font-medium py-3 px-4 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="dark:divide-y divide-white/[0.04] light:divide-y divide-surface-100">
              {filtered.map((p, i) => (
                <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="dark:hover:bg-white/[0.02] light:hover:bg-surface-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-muted">{p.policyNumber}</td>
                  <td className="py-3 px-4">
                    <span className="text-secondary">{p.type}</span>
                  </td>
                  <td className="py-3 px-4 text-primary font-medium">{p.holder?.name || p.policyholderName || '—'}</td>
                  <td className="py-3 px-4 text-secondary">{Number(p.premium).toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted">{(Number(p.coverageAmount) / 100000).toFixed(1)}L</td>
                  <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.riskScore < 40 ? 'bg-brand-500' : p.riskScore < 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p.riskScore}%` }} />
                      </div>
                      <span className="text-xs text-muted">{p.riskScore}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">View</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p>No policies found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-display font-bold text-primary mb-5">Create New Policy</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Policyholder Name</label>
                  <input type="text" required value={form.policyholderName} onChange={e => setForm({ ...form, policyholderName: e.target.value })}
                    placeholder="Enter policyholder's full name" className="input-field w-full focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Policy Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="input-field w-full focus:outline-none">
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-secondary mb-1">Risk Score (0-100)</label>
                <input type="number" min="0" max="100" value={form.riskScore} onChange={e => setForm({ ...form, riskScore: e.target.value })}
                  className="input-field w-full focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Premium (₹)</label>
                  <input type="number" required value={form.premium} onChange={e => setForm({ ...form, premium: e.target.value })}
                    placeholder="15000" className="input-field w-full focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Coverage Amount (₹)</label>
                  <input type="number" required value={form.coverageAmount} onChange={e => setForm({ ...form, coverageAmount: e.target.value })}
                    placeholder="500000" className="input-field w-full focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Start Date</label>
                  <input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="input-field w-full focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">End Date</label>
                  <input type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="input-field w-full focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-secondary mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field w-full focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  Create Policy
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
