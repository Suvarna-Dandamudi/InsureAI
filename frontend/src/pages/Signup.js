import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      console.log('Attempting signup with:', { name: form.name, email: form.email });
      const result = await signup(form.name, form.email, form.password);
      console.log('Signup successful:', result);
      toast.success('Account created! Welcome to InsurAI.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password);

  return (
    <div className="min-h-screen bg-surface-950 bg-grid flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500 mb-4 glow-green">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Start automating insurance with AI</p>
        </div>

        <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Arjun Sharma' },
              { key: 'email', label: 'Work Email', type: 'email', placeholder: 'you@company.com' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                  className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:bg-white/[0.06] transition-all text-sm ${errors[key] ? 'border-red-500/60' : 'border-white/[0.08] focus:border-brand-500/60'}`}
                />
                {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters"
                  className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 pr-10 text-white placeholder-slate-500 focus:outline-none focus:bg-white/[0.06] transition-all text-sm ${errors.password ? 'border-red-500/60' : 'border-white/[0.08] focus:border-brand-500/60'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className={`h-1 flex-1 rounded-full ${strength ? 'bg-brand-500' : 'bg-amber-500'}`} />
                  <span className={`text-xs ${strength ? 'text-brand-400' : 'text-amber-400'}`}>{strength ? 'Strong' : 'Weak'}</span>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Re-enter password"
                className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:bg-white/[0.06] transition-all text-sm ${errors.confirm ? 'border-red-500/60' : 'border-white/[0.08] focus:border-brand-500/60'}`}
              />
              {form.confirm && form.confirm === form.password && (
                <p className="text-brand-400 text-xs mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> Passwords match</p>
              )}
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold text-sm transition-all mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
