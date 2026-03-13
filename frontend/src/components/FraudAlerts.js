import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, User, Shield } from 'lucide-react';

const FraudAlerts = ({ alerts, loading }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fraud Alerts</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-48 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Fraud Alerts
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Shield className="w-4 h-4" />
          <span>AI Detection</span>
        </div>
      </div>

      {alerts && alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.title || `Claim #${alert.claimNumber || index + 1}`}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {alert.timeAgo || '2h ago'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {alert.description || `Suspicious activity detected in claim ${alert.claimNumber || '#' + (index + 1)}`}
                </p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <User className="w-3 h-3" />
                    <span>{alert.customer || 'Customer #' + (index + 1)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : 'Today'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No fraud alerts detected
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            AI monitoring is active and will alert you of any suspicious activity
          </p>
        </div>
      )}

      {alerts && alerts.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
            View all alerts ({alerts.length})
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default FraudAlerts;
