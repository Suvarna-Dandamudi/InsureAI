import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  console.log('Navbar user data:', user); // Debug log

  const notificationList = [
    { id: 1, title: 'New fraud alert', message: 'Suspicious activity detected on policy #1234', time: '2 min ago', read: false },
    { id: 2, title: 'Claim update', message: 'Claim #5678 status changed to Approved', time: '1 hour ago', read: true },
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 dark:border-b border-white/[0.06] light:border-b border-surface-200 dark:bg-surface-900/80 light:bg-white/80 backdrop-blur-xl flex items-center px-4 gap-4 sticky top-0 z-10">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden dark:text-slate-400 light:text-surface-600 dark:hover:text-white light:hover:text-surface-900 p-2 rounded-lg dark:hover:bg-white/[0.06] light:hover:bg-surface-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 light:text-surface-600" size={15} />
          <input
            type="text"
            placeholder="Search policies, claims..."
            className="w-full dark:bg-white/[0.05] light:bg-white/80 dark:border border-white/[0.1] light:border border-surface-200 rounded-xl pl-10 pr-4 py-2.5 dark:text-white light:text-surface-900 dark:placeholder-white/50 light:placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:bg-white light:focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 dark:text-slate-400 light:text-surface-600 dark:hover:text-white light:hover:text-surface-900 rounded-xl dark:hover:bg-white/[0.06] light:hover:bg-surface-100 transition-all"
          title="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 dark:text-slate-400 light:text-surface-600 dark:hover:text-white light:hover:text-surface-900 rounded-xl dark:hover:bg-white/[0.06] light:hover:bg-surface-100 transition-all"
          >
            <Bell size={18} />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full dark:ring-2 ring-surface-900 light:ring-2 ring-white animate-pulse" />
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div ref={notificationRef} className="absolute right-0 mt-2 w-80 dark:bg-surface-900 light:bg-white dark:border border-white/[0.1] light:border border-surface-200 rounded-xl shadow-2xl z-50">
              <div className="p-4 dark:border-b border-white/[0.06] light:border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h3 className="dark:text-white light:text-surface-900 font-semibold">Notifications</h3>
                  <button 
                    onClick={() => setNotifications(0)}
                    className="text-xs dark:text-brand-400 light:text-brand-600 hover:dark:text-brand-300 hover:light:text-brand-500"
                  >
                    Clear all
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notificationList.map(notification => (
                  <div key={notification.id} className={`p-4 dark:border-b border-white/[0.06] light:border-b border-surface-200 hover:bg-white/[0.04] transition-colors ${!notification.read ? 'bg-brand-500/10' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1 ${!notification.read ? 'bg-brand-500' : 'bg-slate-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="dark:text-white light:text-surface-900 text-sm font-medium">{notification.title}</p>
                        <p className="dark:text-slate-400 light:text-surface-600 text-xs">{notification.message}</p>
                        <p className="dark:text-slate-500 light:text-surface-600 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 dark:border-l border-white/[0.06] light:border-l border-surface-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="dark:text-white light:text-surface-900 text-sm font-medium leading-none">{user?.name || 'Admin'}</p>
            <p className="dark:text-slate-500 light:text-surface-600 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
