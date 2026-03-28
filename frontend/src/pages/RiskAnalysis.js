import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { riskAPI } from '../utils/api';
import { mockRiskAnalysis } from '../utils/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-surface-800 border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-300 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-semibold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span></p>)}
    </div>
  );
  return null;
};

export default function RiskAnalysis() {
  const [data, setData] = useState(mockRiskAnalysis);

  useEffect(() => {
    riskAPI.getAnalysis().then(r => setData(r.data)).catch(() => {});
  }, []);

  const { riskDistribution, avgRiskScore, flaggedClaimsRate, riskByType, highRiskPolicies, aiInsights } = data;

  const radarData = riskByType?.map(r => ({ type: r._id, riskScore: Math.round(r.avgRisk), policies: r.count })) || [];
  const barData = riskByType?.map(r => ({ type: r._id, risk: Math.round(r.avgRisk) })) || [];

  const insightIcons = { warning: <AlertTriangle size={14} className="text-amber-400 shrink-0" />, info: <Info size={14} className="text-blue-400 shrink-0" />, success: <CheckCircle2 size={14} className="text-brand-400 shrink-0" /> };
  const insightColors = { warning: 'bg-amber-500/10 border-amber-500/20', info: 'bg-blue-500/10 border-blue-500/20', success: 'bg-brand-500/10 border-brand-500/20' };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Brain className="text-violet-400" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">AI Risk Analysis</h1>
          <p className="text-secondary text-sm">Machine learning risk assessment and portfolio intelligence</p>
        </div>
      </div>

      {/* Risk score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Avg Portfolio Risk', value: `${avgRiskScore?.toFixed(1) || 38.4}/100`, sub: 'Moderate Risk', color: 'text-amber-400' },
          { label: 'Flagged Claims Rate', value: `${flaggedClaimsRate || 18.5}%`, sub: 'of total claims', color: 'text-red-400' },
          { label: 'High Risk Customers', value: riskDistribution?.high || 201, sub: `of ${(riskDistribution?.high || 0) + (riskDistribution?.medium || 0) + (riskDistribution?.low || 0)} total`, color: 'text-orange-400' },
        ].map(({ label, value, sub, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card bg-surface-900 border-white/[0.06] p-5 text-center">
            <p className={`text-3xl font-display font-extrabold ${color} mb-1`}>{value}</p>
            <p className="text-white font-medium text-sm">{label}</p>
            <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {aiInsights?.map((insight, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className={`flex items-start gap-3 p-4 rounded-xl border ${insightColors[insight.type]}`}>
            {insightIcons[insight.type]}
            <p className="text-sm text-slate-300">{insight.message}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-surface-900 border-white/[0.06] p-5">
          <h3 className="font-display font-semibold text-white mb-4">Risk by Policy Type (Radar)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="Risk Score" dataKey="riskScore" stroke="#15b36d" fill="#15b36d" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-surface-900 border-white/[0.06] p-5">
          <h3 className="font-display font-semibold text-white mb-4">Average Risk Score by Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="risk" radius={[6, 6, 0, 0]} name="Avg Risk">
                {barData.map((item, i) => (
                  <Cell key={i} fill={item.risk < 40 ? '#15b36d' : item.risk < 65 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk distribution */}
      <div className="card bg-surface-900 border-white/[0.06] p-5">
        <h3 className="font-display font-semibold text-white mb-5">Customer Risk Distribution</h3>
        <div className="space-y-4">
          {[
            { level: 'Low Risk', count: riskDistribution?.low || 1102, color: 'bg-brand-500', textColor: 'text-brand-400' },
            { level: 'Medium Risk', count: riskDistribution?.medium || 589, color: 'bg-amber-500', textColor: 'text-amber-400' },
            { level: 'High Risk', count: riskDistribution?.high || 201, color: 'bg-red-500', textColor: 'text-red-400' },
          ].map(({ level, count, color, textColor }, i) => {
            const total = (riskDistribution?.low || 1102) + (riskDistribution?.medium || 589) + (riskDistribution?.high || 201);
            const pct = Math.round((count / total) * 100);
            return (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-medium ${textColor}`}>{level}</span>
                  <span className="text-slate-400">{count.toLocaleString()} customers — {pct}%</span>
                </div>
                <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.15, duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
