import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { fraudAPI } from '../utils/api';
import { mockFraudAlerts } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function FraudDetection() {
  const [alerts, setAlerts] = useState(mockFraudAlerts);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fraudAPI.getAlerts().then(r => setAlerts(r.data)).catch(() => {});
  }, []);

  const resolve = (id) => {
    setAlerts(alerts.map(a => a._id === id ? { ...a, status: 'Resolved' } : a));
    toast.success('Alert resolved');
  };

  const markFalse = (id) => {
    setAlerts(alerts.map(a => a._id === id ? { ...a, status: 'False Positive' } : a));
    toast.success('Marked as false positive');
  };

  const filtered = alerts.filter(a => !filter || a.severity === filter);

  const stats = [
    { label: 'Open Alerts', value: alerts.filter(a => a.status === 'Open').length, icon: AlertTriangle, color: 'text-red-400 bg-red-500/10' },
    { label: 'Investigating', value: alerts.filter(a => a.status === 'Investigating').length, icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Resolved', value: alerts.filter(a => a.status === 'Resolved').length, icon: CheckCircle, color: 'text-brand-400 bg-brand-500/10' },
    { label: 'Avg Fraud Score', value: Math.round(alerts.reduce((s, a) => s + a.fraudScore, 0) / alerts.length), icon: TrendingUp, color: 'text-blue-400 bg-blue-500/10' },
  ];

  const severityColors = { Critical: 'border-l-red-500 bg-red-500/[0.03]', High: 'border-l-orange-500 bg-orange-500/[0.03]', Medium: 'border-l-amber-500 bg-amber-500/[0.03]', Low: 'border-l-blue-500 bg-blue-500/[0.03]' };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <ShieldAlert className="text-red-400" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Fraud Detection</h1>
          <p className="text-secondary text-sm">AI-powered fraud monitoring and alert management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card bg-surface-900 border-white/[0.06] p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.split(' ')[1]}`}>
              <Icon className={color.split(' ')[0]} size={18} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Notice */}
      <div className="bg-gradient-to-r from-brand-500/10 to-transparent border border-brand-500/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-brand-400 text-sm font-bold">AI</span>
        </div>
        <div>
          <p className="text-brand-300 font-medium text-sm">AI Fraud Engine Active</p>
          <p className="text-slate-400 text-xs mt-1">Real-time behavioral analysis scanning {alerts.length} flagged cases. Machine learning models detected patterns with 94.2% accuracy this month.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['', 'Critical', 'High', 'Medium', 'Low'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-brand-500 text-white' : 'bg-white/[0.05] text-slate-400 hover:bg-white/[0.08]'}`}>
            {s || 'All Alerts'}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filtered.map((alert, i) => (
          <motion.div key={alert._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`card bg-surface-900 border-white/[0.06] border-l-4 ${severityColors[alert.severity] || ''} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-white font-semibold text-sm">{alert.alertType}</span>
                  <StatusBadge status={alert.severity} />
                  <StatusBadge status={alert.status} />
                </div>
                <p className="text-slate-400 text-sm">{alert.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Customer: <span className="text-slate-300">{alert.customer?.name || 'Unknown'}</span></span>
                  <span>Detected: {new Date(alert.detectedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {/* Fraud score gauge */}
                <div className="text-center">
                  <div className={`text-2xl font-display font-bold ${alert.fraudScore > 80 ? 'text-red-400' : alert.fraudScore > 60 ? 'text-amber-400' : 'text-brand-400'}`}>
                    {alert.fraudScore}
                  </div>
                  <div className="text-xs text-slate-500">Fraud Score</div>
                </div>
                {alert.status === 'Open' || alert.status === 'Investigating' ? (
                  <div className="flex gap-2">
                    <button onClick={() => markFalse(alert._id)}
                      className="text-xs text-slate-400 hover:text-slate-200 border border-white/[0.1] hover:border-white/20 px-2.5 py-1.5 rounded-lg transition-all">
                      False Positive
                    </button>
                    <button onClick={() => resolve(alert._id)}
                      className="text-xs text-brand-400 hover:text-brand-300 border border-brand-500/30 hover:border-brand-500/60 px-2.5 py-1.5 rounded-lg transition-all">
                      Resolve
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            {/* Score bar */}
            <div className="mt-3 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${alert.fraudScore > 80 ? 'bg-red-500' : alert.fraudScore > 60 ? 'bg-amber-500' : 'bg-brand-500'}`}
                style={{ width: `${alert.fraudScore}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
