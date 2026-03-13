import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Users, Plus, CheckCircle, XCircle } from 'lucide-react';

const RecentActivity = ({ data, loading }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'policy':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'claim':
        return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'customer':
        return <Users className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default:
        return <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const activities = [
    ...(data?.recentPolicies?.map(policy => ({
      id: policy._id,
      type: 'policy',
      title: `New Policy Created`,
      description: `Policy ${policy.policyNumber} for ${policy.customer?.name || 'Customer'}`,
      time: policy.createdAt,
      status: policy.status,
      amount: `$${policy.premium}/mo`
    })) || []),
    ...(data?.recentClaims?.map(claim => ({
      id: claim._id,
      type: 'claim',
      title: `Claim ${claim.status}`,
      description: `Claim ${claim.claimNumber} for $${claim.claimAmount}`,
      time: claim.createdAt,
      status: claim.status,
      amount: `$${claim.claimAmount}`
    })) || [])
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(activity.status)}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(activity.time)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {activity.description}
                </p>
                
                {activity.amount && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {activity.amount}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'approved' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : activity.status === 'rejected'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Activity will appear here as policies and claims are created
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentActivity;
