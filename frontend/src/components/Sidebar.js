import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, ClipboardList, Users, BarChart3,
  ShieldAlert, Brain, MessageSquare, Settings, LogOut, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/policies', icon: FileText, label: 'Policies' },
  { to: '/claims', icon: ClipboardList, label: 'Claims' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/fraud-detection', icon: ShieldAlert, label: 'Fraud Detection' },
  { to: '/risk-analysis', icon: Brain, label: 'AI Risk Analysis' },
  { to: '/chatbot', icon: MessageSquare, label: 'AI Assistant' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Sidebar user data:', user); // Debug log

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        initial={false}
        className={`
          fixed top-0 left-0 h-full w-64 z-30
          dark:bg-surface-900 light:bg-white dark:border-r border-white/[0.06] light:border-r border-surface-200
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 dark:border-b border-white/[0.06] light:border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center glow-blue">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="dark:text-white light:text-surface-900 font-display font-bold text-lg leading-none">InsurAI</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) =>
                `nav-link ${isActive
                  ? 'bg-brand-500/15 text-brand-500 border-r-2 border-brand-500 rounded-r-none mr-0'
                  : 'dark:text-slate-400 light:text-surface-600 dark:hover:text-white light:hover:text-surface-900 hover:bg-white/[0.04] transition-colors'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="p-4 dark:border-t border-white/[0.06] light:border-t border-surface-200">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl dark:hover:bg-white/[0.04] light:hover:bg-surface-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="dark:text-white light:text-surface-900 text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="dark:text-slate-500 light:text-surface-600 text-xs truncate">Admin</p>
            </div>
            <button onClick={handleLogout} className="dark:text-slate-500 light:text-surface-600 dark:hover:text-red-400 light:hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
