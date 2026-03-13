import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const ClaimsChart = ({ data, loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Claims Analysis</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </motion.div>
    );
  }

  const claimsData = data?.claimsPerMonth || [
    { month: 'Jan', total: 45, approved: 30, rejected: 15 },
    { month: 'Feb', total: 52, approved: 35, rejected: 17 },
    { month: 'Mar', total: 48, approved: 32, rejected: 16 },
    { month: 'Apr', total: 61, approved: 40, rejected: 21 },
    { month: 'May', total: 55, approved: 38, rejected: 17 },
    { month: 'Jun', total: 67, approved: 45, rejected: 22 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Claims Analysis
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Total</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Rejected</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={claimsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#111827', fontWeight: 600 }}
          />
          <Legend />
          <Bar 
            dataKey="total" 
            fill="#3b82f6" 
            radius={[8, 8, 0, 0]}
            name="Total Claims"
          />
          <Bar 
            dataKey="approved" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
            name="Approved"
          />
          <Bar 
            dataKey="rejected" 
            fill="#ef4444" 
            radius={[8, 8, 0, 0]}
            name="Rejected"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {claimsData.reduce((sum, item) => sum + item.total, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Claims</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round((claimsData.reduce((sum, item) => sum + item.approved, 0) / claimsData.reduce((sum, item) => sum + item.total, 0)) * 100)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${Math.round(claimsData.reduce((sum, item) => sum + (item.approved * 1000), 0) / 1000).toLocaleString()}k
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Payout</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClaimsChart;
