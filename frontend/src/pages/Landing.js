import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Brain, ShieldAlert, BarChart3, CheckCircle2, ArrowRight, Zap, Globe, Lock, ChevronRight } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Risk Analysis', desc: 'Machine learning models assess policy risk in real-time with 94% accuracy, enabling smarter underwriting decisions.' },
  { icon: ShieldAlert, title: 'Fraud Detection Engine', desc: 'Advanced behavioral analytics and pattern recognition flags suspicious claims before they cost your business.' },
  { icon: BarChart3, title: 'Predictive Analytics', desc: 'Deep insights into claims trends, customer lifetime value, and portfolio health through intelligent dashboards.' },
  { icon: Zap, title: 'Automated Processing', desc: 'Reduce manual workload by 70% with AI-driven policy validation, claim routing, and decision support.' },
  { icon: Globe, title: 'Omnichannel Assistant', desc: '24/7 conversational AI handles customer queries, claim updates, and coverage questions across all channels.' },
  { icon: Lock, title: 'Compliance & Audit', desc: 'Full audit trail, role-based access control, and regulatory compliance built in from the ground up.' },
];

const pricing = [
  { name: 'Starter', price: '₹4,999', period: '/month', features: ['Up to 500 policies', '100 claims/month', 'Basic analytics', 'Email support'], color: 'border-white/10' },
  {
    name: 'Professional', price: '₹14,999', period: '/month', popular: true,
    features: ['Up to 5,000 policies', 'Unlimited claims', 'AI fraud detection', 'Risk analysis', 'Priority support'],
    color: 'border-brand-500/50'
  },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited everything', 'Custom AI models', 'White-label option', 'Dedicated success manager', 'SLA guarantee'], color: 'border-white/10' },
];

const stats = [
  { value: '98.7%', label: 'Fraud Detection Accuracy' },
  { value: '70%', label: 'Reduction in Manual Processing' },
  { value: '3.2x', label: 'Faster Claims Resolution' },
  { value: '50+', label: 'Enterprise Clients' },
];

export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">InsurAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stats" className="hover:text-white transition-colors">Why InsurAI</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5">Login</Link>
            <Link to="/signup" className="text-sm bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Powered by Artificial Intelligence
            </div>
            <h1 className="text-5xl sm:text-6xl font-display font-extrabold leading-tight mb-6">
              The Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
                Insurance Intelligence
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              InsurAI automates policy management, detects fraud with AI precision, and delivers real-time risk intelligence — transforming how insurance companies operate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white px-8 py-3.5 rounded-xl font-semibold transition-all">
                View Demo <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-4 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl font-display font-extrabold text-brand-400 mb-1">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold mb-4">Everything your team needs</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A comprehensive AI platform built specifically for insurance companies of all sizes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-surface-900 border border-white/[0.06] rounded-2xl p-6 hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon className="text-brand-400" size={20} />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-surface-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Choose the plan that fits your business. Upgrade anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map(({ name, price, period, features: feats, popular, color }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative bg-surface-900 border ${color} rounded-2xl p-6 ${popular ? 'ring-1 ring-brand-500/30' : ''}`}>
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-lg mb-2">{name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-extrabold text-white">{price}</span>
                    <span className="text-slate-400 text-sm">{period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {feats.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 size={15} className="text-brand-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${popular ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10'}`}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-display font-bold mb-4">Ready to transform your insurance operations?</h2>
            <p className="text-slate-400 mb-8">Join 50+ enterprise clients using InsurAI to automate processes, reduce fraud, and deliver exceptional customer experiences.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:scale-105">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="text-brand-400" size={16} />
            <span className="font-display font-bold text-sm">InsurAI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2025 InsurAI. Corporate Policy Automation & Intelligence System.</p>
        </div>
      </footer>
    </div>
  );
}
