import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users } from 'lucide-react';
import { customersAPI } from '../utils/api';
import { mockCustomers } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function Customers() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', occupation: '', riskCategory: 'Low', gender: 'Male' });

  useEffect(() => {
    customersAPI.getAll().then(r => setCustomers(r.data.customers)).catch(() => {});
  }, []);

  const filtered = customers.filter(c =>
    (c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterRisk || c.riskCategory === filterRisk)
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    const mock = { _id: Date.now(), ...form, kycStatus: 'Pending', totalPolicies: 0, totalClaims: 0, lifetimeValue: 0 };
    setCustomers([mock, ...customers]);
    setShowModal(false);
    toast.success('Admin created successfully');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Customers</h1>
          <p className="text-secondary text-sm mt-0.5">{customers.length} registered customers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            className="w-full bg-surface-900 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand-500/50" />
        </div>
        <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
          className="bg-surface-900 border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none">
          <option value="">All Risk Levels</option>
          {['Low', 'Medium', 'High'].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Customer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card bg-surface-900 border-white/[0.06] p-5 hover:border-white/[0.12] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400/30 to-brand-600/20 flex items-center justify-center text-brand-400 font-display font-bold text-lg">
                  A
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Admin</p>
                  <p className="text-slate-500 text-xs">admin@insurai.com</p>
                </div>
              </div>
              <StatusBadge status={c.kycStatus} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>{c.phone}</span>
              <StatusBadge status={c.riskCategory} />
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3">
              <div className="text-center">
                <p className="text-white font-semibold text-sm">{c.totalPolicies}</p>
                <p className="text-slate-500 text-xs">Policies</p>
              </div>
              <div className="text-center border-x border-white/[0.06]">
                <p className="text-white font-semibold text-sm">{c.totalClaims}</p>
                <p className="text-slate-500 text-xs">Claims</p>
              </div>
              <div className="text-center">
                <p className="text-brand-400 font-semibold text-sm">₹{(c.lifetimeValue / 1000).toFixed(0)}K</p>
                <p className="text-slate-500 text-xs">LTV</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>No customers found</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/[0.1] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-display font-bold text-primary mb-5">Add New Customer</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Customer Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Customer Name"
                    className="input-field w-full focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Customer Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="customer@company.com"
                    className="input-field w-full focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-secondary mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91-9876543210"
                  className="input-field w-full focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-secondary mb-1">Occupation</label>
                <input type="text" value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })} placeholder="Software Engineer"
                  className="input-field w-full focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Gender</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                    {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Risk Category</label>
                  <select value={form.riskCategory} onChange={e => setForm({ ...form, riskCategory: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                    {['Low', 'Medium', 'High'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-white/[0.1] text-slate-300 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.04] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">Add Customer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
