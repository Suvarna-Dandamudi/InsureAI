import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ClipboardList, Users, DollarSign, ShieldAlert, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import { analyticsAPI } from '../utils/api';
import { mockAnalytics, mockPolicies, MONTHS } from '../utils/mockData';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#15b36d', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-surface-800 border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-semibold">{p.value}</span></p>)}
    </div>
  );
  return null;
};

export default function Dashboard() {
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analyticsAPI.get().then(r => setAnalytics(r.data)).catch(() => setAnalytics(mockAnalytics));
  }, []);

  const { kpis, monthlyPolicies, claimsByStatus, policyByType } = analytics;

  const lineData = monthlyPolicies?.map(m => ({
    month: MONTHS[(m._id.month - 1)], policies: m.count
  })) || [];

  const barData = claimsByStatus?.map(c => ({ status: c._id, count: c.count })) || [];
  const pieData = policyByType?.map(p => ({ name: p._id, value: p.count })) || [];

  const recentActivity = [
    { action: 'New policy created', detail: 'Health Policy - Arjun Sharma', time: '2 min ago', color: 'brand' },
    { action: 'Fraud alert raised', detail: 'Suspicious claim CLM-20241003', time: '15 min ago', color: 'red' },
    { action: 'Claim approved', detail: 'CLM-20241005 — ₹18,500', time: '1 hr ago', color: 'brand' },
    { action: 'New customer registered', detail: 'Kavitha Nair — KYC Pending', time: '2 hr ago', color: 'blue' },
    { action: 'Policy renewed', detail: 'POL-20241001 — Auto renewal', time: '3 hr ago', color: 'purple' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Dashboard</h1>
          <p className="text-secondary text-sm mt-0.5">Welcome back — here's your InsurAI overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-500 dark:bg-brand-500/10 light:bg-brand-50 dark:border border-brand-500/20 light:border border-brand-200 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          AI systems online
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Policies" value={kpis?.totalPolicies?.toLocaleString() || '—'} change="+8.2%" icon={FileText} color="brand" delay={0} />
        <KPICard title="Active Claims" value={kpis?.pendingClaims?.toLocaleString() || '—'} change="+3.1%" changeType="up" icon={ClipboardList} color="blue" delay={0.05} />
        <KPICard title="Total Admins" value={kpis?.totalCustomers?.toLocaleString()} change="+12.4%" icon={Users} color="purple" delay={0.1} />
        <KPICard title="Total Revenue" value={kpis?.totalRevenue ? `₹${(kpis.totalRevenue / 100000).toFixed(1)}L` : '—'} change="+5.7%" icon={DollarSign} color="orange" delay={0.15} />
      </div>

      {/* Fraud alerts banner */}
      {kpis?.fraudAlerts > 0 && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 dark:bg-red-500/10 light:bg-red-50 dark:border border-red-500/20 light:border border-red-200 rounded-xl px-4 py-3">
          <ShieldAlert className="dark:text-red-400 light:text-red-600 shrink-0" size={18} />
          <p className="dark:text-red-300 light:text-red-800 text-sm">
            <span className="font-semibold">{kpis.fraudAlerts} open fraud alerts</span> require immediate attention.
          </p>
        </motion.div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Policy growth line chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-display font-semibold text-primary mb-4">Policy Growth (6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} />
              <XAxis dataKey="month" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="policies" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} name="Policies" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-primary mb-4">Policies by Type</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {pieData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-secondary">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Claims bar chart + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-display font-semibold text-primary mb-4">Claims by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} />
              <XAxis dataKey="status" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Claims">
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-brand-500" size={16} />
            <h3 className="font-display font-semibold text-primary">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  item.color === 'brand' ? 'bg-brand-500' : item.color === 'red' ? 'bg-red-500' :
                  item.color === 'blue' ? 'bg-blue-500' : 'bg-violet-500'
                }`} />
                <div>
                  <p className="text-primary text-sm font-medium">{item.action}</p>
                  <p className="text-secondary text-xs">{item.detail}</p>
                  <p className="text-muted text-xs mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Policies Table */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-primary mb-4">Recent Policies</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="dark:border-b border-white/[0.06] light:border-b border-surface-200">
                {['Policy #', 'Type', 'Holder', 'Premium', 'Coverage', 'Status', 'Risk Score'].map(h => (
                  <th key={h} className="text-left text-muted font-medium pb-3 pr-4 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="dark:divide-y divide-white/[0.04] light:divide-y divide-surface-100">
              {mockPolicies.map((p) => (
                <tr key={p._id} className="dark:hover:bg-white/[0.02] light:hover:bg-surface-50 transition-colors">
                  <td className="py-3 pr-4 text-secondary font-mono text-xs">{p.policyNumber}</td>
                  <td className="py-3 pr-4 text-secondary">{p.type}</td>
                  <td className="py-3 pr-4 text-primary font-medium">{p.holder.name}</td>
                  <td className="py-3 pr-4 text-secondary">₹{p.premium.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-muted">₹{(p.coverageAmount / 100000).toFixed(1)}L</td>
                  <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.riskScore < 40 ? 'bg-brand-500' : p.riskScore < 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p.riskScore}%` }} />
                      </div>
                      <span className="text-xs text-muted">{p.riskScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
