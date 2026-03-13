import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  CheckCircle,
  IndianRupee,
  Activity,
  PieChart,
  BarChart3,
  Award,
  Target
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import TopNavigation from '../components/TopNavigation';
import BeautifulBackground from '../components/BeautifulBackground';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Demo data with Indian Rupee
  const statsCards = [
    {
      title: 'Total Customers',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Policies',
      value: '3,892',
      change: '+8.2%',
      trend: 'up',
      icon: Shield,
      color: 'green'
    },
    {
      title: 'Pending Claims',
      value: '89',
      change: '-3.1%',
      trend: 'down',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Approved Claims',
      value: '456',
      change: '+15.7%',
      trend: 'up',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      title: 'Fraud Alerts',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const policiesByTypeData = [
    { name: 'Health Insurance', value: 1250, color: '#3B82F6' },
    { name: 'Car Insurance', value: 980, color: '#10B981' },
    { name: 'Travel Insurance', value: 650, color: '#F59E0B' },
    { name: 'Life Insurance', value: 1012, color: '#8B5CF6' }
  ];

  const monthlyClaimsData = [
    { month: 'Jan', claims: 45 },
    { month: 'Feb', claims: 52 },
    { month: 'Mar', claims: 38 },
    { month: 'Apr', claims: 65 },
    { month: 'May', claims: 48 },
    { month: 'Jun', claims: 58 }
  ];

  const recentClaims = [
    { id: '#1021', customer: 'John Doe', policy: 'Health Insurance', status: 'pending', amount: '₹5,20,000' },
    { id: '#1022', customer: 'Priya Sharma', policy: 'Car Insurance', status: 'approved', amount: '₹12,50,000' },
    { id: '#1023', customer: 'Rahul Verma', policy: 'Travel Insurance', status: 'rejected', amount: '₹3,80,000' },
    { id: '#1024', customer: 'Sarah Khan', policy: 'Life Insurance', status: 'pending', amount: '₹50,00,000' },
    { id: '#1025', customer: 'David Lee', policy: 'Health Insurance', status: 'approved', amount: '₹8,90,000' }
  ];

  const revenueStats = [
    { month: 'Revenue', amount: '₹2,45,67,890' },
    { month: 'Claims Paid', amount: '₹45,23,456' },
    { month: 'Premium Collected', amount: '₹1,89,34,567' }
  ];

  const topCustomers = [
    { name: 'Rajesh Kumar', policies: 5, premium: '₹45,000/month', avatar: 'RK' },
    { name: 'Anita Sharma', policies: 3, premium: '₹32,000/month', avatar: 'AS' },
    { name: 'Vikram Singh', policies: 4, premium: '₹38,000/month', avatar: 'VS' },
    { name: 'Priya Patel', policies: 2, premium: '₹28,000/month', avatar: 'PP' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      green: 'bg-green-500/10 text-green-500 border-green-500/20',
      yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      red: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      approved: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[status] || colors.pending;
  };

  return (
    <BeautifulBackground>
      <TopNavigation />
      
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {user?.name || 'Admin'}! 👋
                </h1>
                <p className="text-gray-400 text-lg">
                  Here's what's happening with your insurance platform today.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Time</p>
                <p className="text-xl font-semibold text-white">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg border ${getColorClasses(card.color)}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{card.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                  <p className="text-sm text-gray-400">{card.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Revenue Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {revenueStats.map((stat, index) => (
              <div key={stat.month} className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.month}</p>
                    <p className="text-3xl font-bold text-white">{stat.amount}</p>
                  </div>
                  <IndianRupee className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Policies by Type Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Policies by Type</h2>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={policiesByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {policiesByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {policiesByTypeData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Monthly Claims Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Monthly Claims Filed</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyClaimsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="claims" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Top Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Top Customers</h2>
              <Award className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{customer.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{customer.name}</p>
                      <p className="text-gray-400 text-sm">{customer.policies} policies</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-medium">{customer.premium}</span>
                    <Target className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Claims</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                    <th className="pb-3 font-medium">Claim ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Policy Type</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClaims.map((claim, index) => (
                    <tr key={claim.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 text-white font-medium">{claim.id}</td>
                      <td className="py-4 text-gray-300">{claim.customer}</td>
                      <td className="py-4 text-gray-300">{claim.policy}</td>
                      <td className="py-4 text-gray-300 font-medium">{claim.amount}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </BeautifulBackground>
  );
};

export default Dashboard;
