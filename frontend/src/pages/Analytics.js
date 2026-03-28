import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../utils/api';
import { mockAnalytics, MONTHS } from '../utils/mockData';
import KPICard from '../components/KPICard';
import { FileText, ClipboardList, Users, TrendingUp } from 'lucide-react';

const COLORS = ['#15b36d', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-surface-800 border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name || p.dataKey}: <span className="font-semibold">{p.value}</span></p>)}
    </div>
  );
  return null;
};

export default function Analytics() {
  const [data, setData] = useState(mockAnalytics);

  useEffect(() => {
    analyticsAPI.get().then(r => setData(r.data)).catch(() => {});
  }, []);

  const { kpis, monthlyPolicies, claimsByStatus, policyByType, customerRisk } = data;

  const lineData = monthlyPolicies?.map(m => ({ month: MONTHS[m._id.month - 1], policies: m.count, claims: Math.floor(m.count * 0.22) })) || [];
  const claimsData = claimsByStatus?.map(c => ({ name: c._id, value: c.count })) || [];
  const typesData = policyByType?.map(p => ({ type: p._id, count: p.count })) || [];
  const riskData = customerRisk?.map(r => ({ risk: r._id, count: r.count })) || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-primary">Analytics</h1>
        <p className="text-secondary text-sm mt-0.5">Business intelligence and performance metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Policies" value={kpis?.totalPolicies?.toLocaleString()} change="+8.2%" icon={FileText} color="brand" delay={0} />
        <KPICard title="Total Claims" value={kpis?.totalClaims?.toLocaleString()} change="+3.1%" icon={ClipboardList} color="blue" delay={0.05} />
        <KPICard title="Customers" value={kpis?.totalCustomers?.toLocaleString()} change="+12.4%" icon={Users} color="purple" delay={0.1} />
        <KPICard title="Revenue" value={kpis?.totalRevenue ? `₹${(kpis.totalRevenue / 100000).toFixed(1)}L` : '₹48.2L'} change="+5.7%" icon={TrendingUp} color="orange" delay={0.15} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-surface-900 border-white/[0.06] p-5">
          <h3 className="font-display font-semibold text-white mb-4">Policy & Claims Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={lineData}>
              <defs>
                {[['policies', '#15b36d'], ['claims', '#3b82f6']].map(([key, color]) => (
                  <linearGradient key={key} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
              <Area type="monotone" dataKey="policies" stroke="#15b36d" strokeWidth={2} fill="url(#grad_policies)" name="Policies" />
              <Area type="monotone" dataKey="claims" stroke="#3b82f6" strokeWidth={2} fill="url(#grad_claims)" name="Claims" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-surface-900 border-white/[0.06] p-5">
          <h3 className="font-display font-semibold text-white mb-4">Claims Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={claimsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                  {claimsData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {claimsData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-surface-900 border-white/[0.06] p-5">
          <h3 className="font-display font-semibold text-white mb-4">Policies by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typesData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Count">
                {typesData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-surface-900 border-white/[0.06] p-5">
          <h3 className="font-display font-semibold text-white mb-4">Customer Risk Profile</h3>
          <div className="space-y-4 mt-6">
            {riskData.map((item, i) => {
              const total = riskData.reduce((s, r) => s + r.count, 0);
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              const colors = { Low: 'bg-brand-500', Medium: 'bg-amber-500', High: 'bg-red-500' };
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-medium">{item.risk} Risk</span>
                    <span className="text-slate-400">{item.count} customers ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${colors[item.risk]}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/[0.06]">
            <div className="text-center">
              <p className="text-xl font-display font-bold text-white">{kpis?.approvedClaims || 398}</p>
              <p className="text-xs text-slate-500">Approved</p>
            </div>
            <div className="text-center border-x border-white/[0.06]">
              <p className="text-xl font-display font-bold text-amber-400">{kpis?.pendingClaims || 127}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-display font-bold text-red-400">{kpis?.rejectedClaims || 109}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
