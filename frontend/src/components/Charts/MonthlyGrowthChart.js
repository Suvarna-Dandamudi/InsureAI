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
  Area,
  AreaChart,
} from 'recharts';

const MonthlyGrowthChart = ({ data, loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Growth</h3>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </motion.div>
    );
  }

  const growthData = data?.monthlyGrowth || [
    { month: 'Aug', policies: 45, customers: 32 },
    { month: 'Sep', policies: 52, customers: 41 },
    { month: 'Oct', policies: 48, customers: 38 },
    { month: 'Nov', policies: 61, customers: 45 },
    { month: 'Dec', policies: 55, customers: 52 },
    { month: 'Jan', policies: 67, customers: 58 },
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
          Monthly Growth
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Policies</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Customers</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={growthData}>
          <defs>
            <linearGradient id="colorPolicies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="policies"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorPolicies)"
            name="New Policies"
          />
          <Area
            type="monotone"
            dataKey="customers"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorCustomers)"
            name="New Customers"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              +{((growthData[growthData.length - 1].policies - growthData[0].policies) / growthData[0].policies * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Policy Growth</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              +{((growthData[growthData.length - 1].customers - growthData[0].customers) / growthData[0].customers * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customer Growth</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(growthData[growthData.length - 1].policies / growthData[growthData.length - 1].customers * 10) / 10}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Policies/Customer</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MonthlyGrowthChart;
