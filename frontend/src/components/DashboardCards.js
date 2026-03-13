import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  DollarSign
} from 'lucide-react';

const DashboardCards = ({ data, loading }) => {
  const cards = [
    {
      title: 'Total Policies',
      value: data?.stats?.totalPolicies || data?.counts?.totalPolicies || 0,
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'Total Claims',
      value: data?.stats?.totalClaims || data?.counts?.totalClaims || 0,
      change: '+8%',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      title: 'Total Customers',
      value: data?.stats?.activeUsers || data?.counts?.totalCustomers || 0,
      change: '+15%',
      changeType: 'positive',
      icon: Users,
      color: 'green',
    },
    {
      title: 'Revenue',
      value: `$${(data?.stats?.revenue || data?.counts?.revenue || 0).toLocaleString()}`,
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Fraud Alerts',
      value: data?.stats?.fraudAlerts || data?.counts?.fraudAlerts || 0,
      change: '-5%',
      changeType: 'negative',
      icon: Shield,
      color: 'red',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="mt-4">
              <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colorClasses = {
          blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
          yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
          green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
          red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
          purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        };
        return (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className={`text-sm font-medium ${
                card.changeType === 'positive' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {card.change}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {card.value.toLocaleString()}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardCards;
