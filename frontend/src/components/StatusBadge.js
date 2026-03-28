import React from 'react';

const statusConfig = {
  Active: 'bg-brand-500/15 text-brand-400 ring-brand-500/20',
  Expired: 'bg-slate-500/15 text-slate-400 ring-slate-500/20',
  Cancelled: 'bg-red-500/15 text-red-400 ring-red-500/20',
  Pending: 'bg-amber-500/15 text-amber-400 ring-amber-500/20',
  Approved: 'bg-brand-500/15 text-brand-400 ring-brand-500/20',
  Rejected: 'bg-red-500/15 text-red-400 ring-red-500/20',
  'Under Review': 'bg-blue-500/15 text-blue-400 ring-blue-500/20',
  Paid: 'bg-violet-500/15 text-violet-400 ring-violet-500/20',
  Open: 'bg-red-500/15 text-red-400 ring-red-500/20',
  Investigating: 'bg-amber-500/15 text-amber-400 ring-amber-500/20',
  Resolved: 'bg-brand-500/15 text-brand-400 ring-brand-500/20',
  'False Positive': 'bg-slate-500/15 text-slate-400 ring-slate-500/20',
  Verified: 'bg-brand-500/15 text-brand-400 ring-brand-500/20',
  Failed: 'bg-red-500/15 text-red-400 ring-red-500/20',
  Low: 'bg-brand-500/15 text-brand-400 ring-brand-500/20',
  Medium: 'bg-amber-500/15 text-amber-400 ring-amber-500/20',
  High: 'bg-red-500/15 text-red-400 ring-red-500/20',
  Critical: 'bg-red-600/25 text-red-300 ring-red-500/30',
};

export default function StatusBadge({ status }) {
  const cls = statusConfig[status] || 'bg-slate-500/15 text-slate-400';
  return (
    <span className={`badge ring-1 ${cls}`}>{status}</span>
  );
}
