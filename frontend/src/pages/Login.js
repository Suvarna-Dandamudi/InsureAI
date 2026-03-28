import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo login
  const demoLogin = async () => {
    setForm({ email: 'demo@insurai.com', password: 'demo1234' });
    setLoading(true);
    try {
      await login('demo@insurai.com', 'demo1234');
      toast.success('Demo login successful!');
      navigate('/dashboard');
    } catch {
      // If backend not running, simulate login with mock user
      localStorage.setItem('insurai_user', JSON.stringify({ _id: 'demo', name: 'Demo Admin', email: 'demo@insurai.com', role: 'admin', token: 'demo-token' }));
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 bg-grid flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500 mb-4 glow-green">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your InsurAI account</p>
        </div>

        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 focus:bg-white/[0.06] transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 focus:bg-white/[0.06] transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold text-sm transition-all">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.08]" /></div>
            <div className="relative text-center text-xs text-slate-500 bg-surface-900 px-2 w-fit mx-auto">or</div>
          </div>

          <button onClick={demoLogin} disabled={loading}
            className="w-full border border-brand-500/30 hover:border-brand-500/60 text-brand-400 hover:text-brand-300 py-2.5 rounded-xl font-medium text-sm transition-all bg-brand-500/5 hover:bg-brand-500/10">
            Try Demo Account
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            No account yet? <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Create one</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          <Link to="/" className="hover:text-slate-400 transition-colors">← Back to InsurAI homepage</Link>
        </p>
      </motion.div>
    </div>
  );
}
