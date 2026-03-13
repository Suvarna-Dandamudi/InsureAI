import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Brain, 
  FileText, 
  Users, 
  BarChart3, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle, 
  Lock, 
  Zap,
  TrendingUp,
  Eye,
  Target,
  Github,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Brain,
      title: 'Fraud Detection AI',
      description: 'Advanced machine learning algorithms detect suspicious patterns and prevent fraudulent claims in real-time.',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Target,
      title: 'Risk Scoring System',
      description: 'Intelligent risk assessment powered by AI to evaluate policy applications and calculate accurate premiums.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Claims Automation',
      description: 'Streamlined claims processing with automated workflows, reducing manual effort and improving efficiency.',
      color: 'from-blue-400 to-blue-500'
    },
    {
      icon: FileText,
      title: 'Policy Management',
      description: 'Comprehensive policy lifecycle management with digital documents, automated renewals, and smart analytics.',
      color: 'from-blue-700 to-blue-800'
    },
    {
      icon: Users,
      title: 'Customer Analytics',
      description: 'Deep insights into customer behavior, preferences, and patterns to enhance service and retention.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'AI Chatbot Assistant',
      description: '24/7 intelligent customer support with natural language processing and personalized assistance.',
      color: 'from-blue-400 to-blue-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Login / Signup',
      description: 'Secure authentication with multiple login options including Google OAuth for quick access.',
      icon: Lock
    },
    {
      number: '02',
      title: 'Manage Customers & Policies',
      description: 'Create and manage customer profiles, issue policies, and track all insurance-related documents.',
      icon: Users
    },
    {
      number: '03',
      title: 'Process Claims',
      description: 'Handle claim submissions efficiently with automated workflows and real-time status tracking.',
      icon: FileText
    },
    {
      number: '04',
      title: 'AI Analyzes Fraud Risk',
      description: 'Our AI engine automatically analyzes each claim for fraud indicators and risk factors.',
      icon: Brain
    },
    {
      number: '05',
      title: 'View Analytics Dashboard',
      description: 'Comprehensive insights into your business performance with interactive charts and reports.',
      icon: BarChart3
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">INSUREAI</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-8"
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                AI-Powered Insurance Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              INSUREAI
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Transform your insurance operations with advanced AI technology. 
              Detect fraud, assess risks, and automate processes with our intelligent platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Login to Dashboard
                <Eye className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fraud Detection Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Process Automation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">AI Support</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to modernize your insurance operations with AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-20 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with INSUREAI in 5 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-2 border-blue-600 flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 -translate-x-8"></div>
                  )}
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{step.number}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Insurance Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of insurance companies leveraging AI to streamline operations and reduce fraud.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
              >
                Request Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className={`py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">INSUREAI</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered insurance intelligence platform for modern insurance companies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#security" className="hover:text-blue-600 transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#about" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <Phone className="w-5 h-5" />
                </a>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  info@insureai.com
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 INSUREAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
