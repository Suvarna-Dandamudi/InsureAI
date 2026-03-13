import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const RiskDistributionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Distribution</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </motion.div>
    );
  }

  const riskData = data?.riskDistribution || [
    { range: '0-20', count: 120, color: '#10b981' },
    { range: '21-40', count: 180, color: '#3b82f6' },
    { range: '41-60', count: 150, color: '#f59e0b' },
    { range: '61-80', count: 80, color: '#ef4444' },
    { range: '81-100', count: 30, color: '#dc2626' },
  ];

  const getRiskLabel = (range) => {
    const labels = {
      '0-20': 'Very Low Risk',
      '21-40': 'Low Risk',
      '41-60': 'Moderate Risk',
      '61-80': 'High Risk',
      '81-100': 'Very High Risk',
    };
    return labels[range] || range;
  };

  const getRiskColor = (range) => {
    const colors = {
      '0-20': '#10b981',
      '21-40': '#3b82f6',
      '41-60': '#f59e0b',
      '61-80': '#ef4444',
      '81-100': '#dc2626',
    };
    return colors[range] || '#6b7280';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">
            {getRiskLabel(data.range)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} policies
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {((data.count / riskData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Risk Distribution
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          AI Risk Assessment
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={riskData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {riskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6">
        <div className="grid grid-cols-2 gap-3">
          {riskData.map((risk, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: risk.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {getRiskLabel(risk.range)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {risk.count} policies
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {riskData.reduce((sum, item) => sum + item.count, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Policies</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {((riskData.filter(item => item.range === '41-60' || item.range === '61-80' || item.range === '81-100')
                .reduce((sum, item) => sum + item.count, 0) / 
                riskData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Medium-High Risk</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskDistributionChart;
