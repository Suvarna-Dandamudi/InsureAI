import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Shield, 
  AlertCircle, 
  BarChart3, 
  MessageSquare,
  User
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Policies', href: '/policies', icon: Shield },
    { name: 'Policy List', href: '/policy-list', icon: FileText },
    { name: 'Claims', href: '/claims', icon: AlertCircle },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Chatbot', href: '/chatbot', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-blue-900/50 dark:bg-blue-900/70 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-blue-100 dark:border-blue-900
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-100 dark:border-blue-900">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              INSUREAI
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <item.icon 
                      className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'}
                      `} 
                    />
                  </motion.div>
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-100 dark:border-blue-900">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white shadow-lg">
            <h3 className="font-semibold text-sm mb-1">AI-Powered Insurance</h3>
            <p className="text-xs opacity-90">
              Advanced fraud detection and risk assessment
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
