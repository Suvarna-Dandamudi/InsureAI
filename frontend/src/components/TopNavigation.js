import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

import {

  Shield,

  Users,

  FileText,

  AlertTriangle,

  Bell,

  User,

  LogOut,

  Settings,

  ChevronDown,

  BarChart3,

  Menu,

  X,

  Sun,

  Moon,

  Plus

} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

import { useTheme } from '../contexts/ThemeContext';

import toast from 'react-hot-toast';



const TopNavigation = () => {

  const [showNotifications, setShowNotifications] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { logout } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();



  const handleLogout = () => {

    logout();

    navigate('/login');

    toast.success('Logged out successfully');

  };



  const notifications = [

    { id: 1, text: 'New claim submitted by John Doe', time: '2 min ago', type: 'info' },

    { id: 2, text: 'Fraud risk detected for claim #1021', time: '15 min ago', type: 'warning' },

    { id: 3, text: 'Policy renewal due in 3 days', time: '1 hour ago', type: 'info' },

    { id: 4, text: 'Claim #1022 approved successfully', time: '2 hours ago', type: 'success' },

  ];



  const navItems = [

    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },

    { name: 'Customers', icon: Users, path: '/customers' },

    { name: 'Policies', icon: FileText, path: '/policies' },

    { name: 'Add Policy', icon: Plus, path: '/add-policy' },

    { name: 'Claims', icon: AlertTriangle, path: '/claims' },

    { name: 'Add Claim', icon: Plus, path: '/add-claim' },

  ];



  return (

    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">

      <div className="max-w-full px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}

          <div className="flex items-center">

            <Link to="/dashboard" className="flex items-center space-x-3">

              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">

                <Shield className="w-5 h-5 text-white" />

              </div>

              <span className="text-xl font-bold text-white">INSUREAI</span>

            </Link>

          </div>



          {/* Desktop Navigation */}

          <div className="hidden md:flex items-center space-x-8">

            {navItems.map((item) => (

              <Link

                key={item.name}

                to={item.path}

                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"

              >

                <item.icon className="w-4 h-4" />

                <span>{item.name}</span>

              </Link>

            ))}

          </div>



          {/* Right side items */}

          <div className="flex items-center space-x-4">

            {/* Theme Toggle */}

            <button

              onClick={toggleTheme}

              className="p-2 text-gray-300 hover:text-white transition-colors duration-200"

              title="Toggle theme"

            >

              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}

            </button>



            {/* Notifications */}

            <div className="relative">

              <button

                onClick={() => setShowNotifications(!showNotifications)}

                className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"

              >

                <Bell className="w-5 h-5" />

                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

              </button>



              <AnimatePresence>

                {showNotifications && (

                  <motion.div

                    initial={{ opacity: 0, y: -10 }}

                    animate={{ opacity: 1, y: 0 }}

                    exit={{ opacity: 0, y: -10 }}

                    className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"

                  >

                    <div className="p-4 border-b border-gray-700">

                      <h3 className="text-white font-semibold">Notifications</h3>

                    </div>

                    <div className="max-h-96 overflow-y-auto">

                      {notifications.map((notification) => (

                        <div

                          key={notification.id}

                          className="p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"

                        >

                          <div className="flex items-start space-x-3">

                            <div className={`w-2 h-2 rounded-full mt-2 ${

                              notification.type === 'warning' ? 'bg-yellow-500' :

                              notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'

                            }`}></div>

                            <div className="flex-1">

                              <p className="text-sm text-gray-300">{notification.text}</p>

                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>



            {/* Profile */}

            <div className="relative">

              <button

                onClick={() => setShowProfile(!showProfile)}

                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"

              >

                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">

                  <User className="w-4 h-4 text-white" />

                </div>

                <ChevronDown className="w-4 h-4" />

              </button>



              <AnimatePresence>

                {showProfile && (

                  <motion.div

                    initial={{ opacity: 0, y: -10 }}

                    animate={{ opacity: 1, y: 0 }}

                    exit={{ opacity: 0, y: -10 }}

                    className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"

                  >

                    <Link

                      to="/profile"

                      className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"

                    >

                      <User className="w-4 h-4" />

                      <span>View Profile</span>

                    </Link>

                    <button className="flex items-center space-x-2 w-full px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors">

                      <Settings className="w-4 h-4" />

                      <span>Settings</span>

                    </button>

                    <button

                      onClick={handleLogout}

                      className="flex items-center space-x-2 w-full px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"

                    >

                      <LogOut className="w-4 h-4" />

                      <span>Logout</span>

                    </button>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>



            {/* Mobile menu button */}

            <button

              onClick={() => setShowMobileMenu(!showMobileMenu)}

              className="md:hidden p-2 text-gray-300 hover:text-white"

            >

              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}

            </button>

          </div>

        </div>



        {/* Mobile Navigation */}

        <AnimatePresence>

          {showMobileMenu && (

            <motion.div

              initial={{ opacity: 0, height: 0 }}

              animate={{ opacity: 1, height: 'auto' }}

              exit={{ opacity: 0, height: 0 }}

              className="md:hidden border-t border-gray-800"

            >

              <div className="px-2 pt-2 pb-3 space-y-1">

                {navItems.map((item) => (

                  <Link

                    key={item.name}

                    to={item.path}

                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"

                  >

                    <item.icon className="w-4 h-4" />

                    <span>{item.name}</span>

                  </Link>

                ))}

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </nav>

  );

};



export default TopNavigation;

