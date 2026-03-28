import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Brain, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Section = ({ title, icon: Icon, children }) => (
  <div className="card p-6">
    <div className="flex items-center gap-2 mb-5">
      <Icon className="text-brand-500" size={18} />
      <h3 className="font-display font-semibold text-primary">{title}</h3>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between py-3 dark:border-b border-white/[0.04] light:border-b border-surface-200 last:border-0">
    <div>
      <p className="text-primary text-sm font-medium">{label}</p>
      {description && <p className="text-secondary text-xs mt-0.5">{description}</p>}
    </div>
    <button onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-all relative ${value ? 'bg-brand-500' : 'bg-white/[0.1]'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
    </button>
  </div>
);

export default function Settings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [notifications, setNotifications] = useState({ fraudAlerts: true, claimUpdates: true, policyExpiry: true, weeklyReport: false });
  const [ai, setAi] = useState({ autoFraudDetection: true, riskScoring: true, chatbot: true, autoUnderwriting: false });

  const saveProfile = () => toast.success('Profile updated successfully');

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
          <SettingsIcon className="text-slate-400" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Settings</h1>
          <p className="text-secondary text-sm">Manage your account and platform preferences</p>
        </div>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Section title="Profile" icon={User}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-display font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <span className="badge bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/20 mt-1">Admin</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { key: 'name', label: 'Full Name' },
              { key: 'email', label: 'Email Address', type: 'email' },
            ].map(({ key, label, type = 'text' }) => (
              <div key={key}>
                <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
                <input type={type} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50" />
              </div>
            ))}
            <button onClick={saveProfile} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Notifications" icon={Bell}>
          <Toggle label="Fraud Alerts" description="Real-time notifications for suspicious activity" value={notifications.fraudAlerts} onChange={v => setNotifications({ ...notifications, fraudAlerts: v })} />
          <Toggle label="Claim Updates" description="Get notified when claim status changes" value={notifications.claimUpdates} onChange={v => setNotifications({ ...notifications, claimUpdates: v })} />
          <Toggle label="Policy Expiry Reminders" description="30-day advance policy renewal reminders" value={notifications.policyExpiry} onChange={v => setNotifications({ ...notifications, policyExpiry: v })} />
          <Toggle label="Weekly Summary Report" description="Receive weekly analytics digest via email" value={notifications.weeklyReport} onChange={v => setNotifications({ ...notifications, weeklyReport: v })} />
        </Section>
      </motion.div>

      {/* AI Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="AI & Automation" icon={Brain}>
          <Toggle label="Auto Fraud Detection" description="Automatically score and flag suspicious claims" value={ai.autoFraudDetection} onChange={v => setAi({ ...ai, autoFraudDetection: v })} />
          <Toggle label="Real-time Risk Scoring" description="AI risk assessment for all new policies" value={ai.riskScoring} onChange={v => setAi({ ...ai, riskScoring: v })} />
          <Toggle label="AI Chatbot" description="Enable virtual assistant for customer queries" value={ai.chatbot} onChange={v => setAi({ ...ai, chatbot: v })} />
          <Toggle label="Auto-underwriting (Beta)" description="AI-assisted policy approval for standard cases" value={ai.autoUnderwriting} onChange={v => setAi({ ...ai, autoUnderwriting: v })} />
        </Section>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Appearance" icon={Shield}>
          <Toggle label="Dark Mode" description="Toggle between dark and light interface themes" value={isDark} onChange={toggleTheme} />
        </Section>
      </motion.div>
    </div>
  );
}
