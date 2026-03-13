import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { analyticsService } from '../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('12months');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDetailedAnalytics({ period });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const revenueData = data?.revenueAnalytics || {
    totalRevenue: 2500000,
    averagePremium: 250,
    policyCount: 1000,
  };

  const claimsData = data?.claimsAnalytics || [
    { _id: 'approved', count: 450, totalAmount: 2250000, averageAmount: 5000 },
    { _id: 'rejected', count: 150, totalAmount: 0, averageAmount: 0 },
    { _id: 'pending', count: 100, totalAmount: 500000, averageAmount: 5000 },
  ];

  const customerData = data?.customerAnalytics || { newCustomers: 250 };

  const fraudData = data?.fraudAnalytics || [
    { _id: 'open', count: 25 },
    { _id: 'investigating', count: 15 },
    { _id: 'resolved', count: 60 },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 180000, policies: 720 },
    { month: 'Feb', revenue: 195000, policies: 780 },
    { month: 'Mar', revenue: 210000, policies: 840 },
    { month: 'Apr', revenue: 225000, policies: 900 },
    { month: 'May', revenue: 240000, policies: 960 },
    { month: 'Jun', revenue: 255000, policies: 1020 },
  ];

  const policyTypes = [
    { name: 'Auto', value: 35, color: '#3b82f6' },
    { name: 'Home', value: 25, color: '#10b981' },
    { name: 'Life', value: 20, color: '#8b5cf6' },
    { name: 'Health', value: 15, color: '#f59e0b' },
    { name: 'Business', value: 5, color: '#ef4444' },
  ];

  const claimTrends = [
    { month: 'Jan', claims: 45, approved: 30, rejected: 15 },
    { month: 'Feb', claims: 52, approved: 35, rejected: 17 },
    { month: 'Mar', claims: 48, approved: 32, rejected: 16 },
    { month: 'Apr', claims: 61, approved: 40, rejected: 21 },
    { month: 'May', claims: 55, approved: 38, rejected: 17 },
    { month: 'Jun', claims: 67, approved: 45, rejected: 22 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">
            ${(revenueData.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm opacity-90 mt-2">+12% from last period</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Active Policies</h3>
          <p className="text-3xl font-bold mt-2">
            {revenueData.policyCount.toLocaleString()}
          </p>
          <p className="text-sm opacity-90 mt-2">+8% growth</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">New Customers</h3>
          <p className="text-3xl font-bold mt-2">
            {customerData.newCustomers}
          </p>
          <p className="text-sm opacity-90 mt-2">+15% acquisition</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Avg Premium</h3>
          <p className="text-3xl font-bold mt-2">
            ${revenueData.averagePremium}
          </p>
          <p className="text-sm opacity-90 mt-2">+5% increase</p>
        </div>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Policy Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Policy Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={policyTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {policyTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Claims Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="_id" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Claim Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Claim Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={claimTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="claims" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Fraud Cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Fraud Cases Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fraudData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {item.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {item._id.replace('_', ' ')}
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(item.count / fraudData.reduce((sum, f) => sum + f.count, 0)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
