import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ title, value, change, changeType = 'up', icon: Icon, color = 'brand', delay = 0 }) {
  const colorMap = {
    brand: 'from-brand-500/20 to-brand-600/10 text-brand-400 bg-brand-500/10',
    blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 bg-blue-500/10',
    purple: 'from-violet-500/20 to-violet-600/10 text-violet-400 bg-violet-500/10',
    orange: 'from-orange-500/20 to-orange-600/10 text-orange-400 bg-orange-500/10',
    red: 'from-red-500/20 to-red-600/10 text-red-400 bg-red-500/10',
  };

  const [gradFrom, gradTo, iconColor, iconBg] = colorMap[color]?.split(' ') || colorMap.brand.split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="card p-5 hover:-translate-y-0.5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={iconColor} size={20} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${changeType === 'up' ? 'text-brand-400' : 'text-red-400'}`}>
            {changeType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-primary">{value}</p>
        <p className="text-secondary text-sm mt-1">{title}</p>
      </div>
    </motion.div>
  );
}
