import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Shield,
  Calendar,
  FileText,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  IndianRupee,
  Save,
  ArrowLeft,
  Car,
  Heart,
  Home,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { claimService, policyService } from '../services/api';
import toast from 'react-hot-toast';
import TopNavigation from '../components/TopNavigation';
import BeautifulBackground from '../components/BeautifulBackground';

const AddClaim = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    claimId: '',
    policyId: '',
    customerName: '',
    claimAmount: '',
    claimDate: '',
    claimType: '',
    claimDescription: '',
    status: 'submitted'
  });
  const [errors, setErrors] = useState({});

  // Generate auto claim ID
  const generateClaimId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `CLM-${timestamp}`;
  };

  // Fetch policies for dropdown
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setPoliciesLoading(true);
        const response = await policyService.getPolicies({ limit: 100 });
        setPolicies(response.data.data || []);
      } catch (error) {
        console.error('Error fetching policies:', error);
        toast.error('Failed to load policies');
      } finally {
        setPoliciesLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  // Initialize claim ID on component mount
  useEffect(() => {
    setFormData(prev => ({ ...prev, claimId: generateClaimId() }));
  }, []);

  // Auto-fill customer name when policy is selected
  useEffect(() => {
    if (formData.policyId) {
      const policy = policies.find(p => p._id === formData.policyId);
      if (policy) {
        setSelectedPolicy(policy);
        setFormData(prev => ({
          ...prev,
          customerName: policy.customer?.name || '',
          coverageAmount: policy.coverage || 0
        }));
      }
    } else {
      setSelectedPolicy(null);
      setFormData(prev => ({
        ...prev,
        customerName: '',
        coverageAmount: 0
      }));
    }
  }, [formData.policyId, policies]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.policyId) {
      newErrors.policyId = 'Policy selection is mandatory';
    }
    
    if (!formData.claimAmount || parseFloat(formData.claimAmount) <= 0) {
      newErrors.claimAmount = 'Claim amount must be greater than ₹0';
    }
    
    // Check if claim amount exceeds coverage
    if (selectedPolicy && formData.claimAmount) {
      const coverageAmount = selectedPolicy.coverage || 0;
      const claimAmount = parseFloat(formData.claimAmount);
      if (claimAmount > coverageAmount) {
        newErrors.claimAmount = `Claim amount (₹${claimAmount.toLocaleString()}) cannot exceed coverage amount (₹${coverageAmount.toLocaleString()})`;
      }
      
      // Additional business validation
      if (claimAmount < 1000) {
        newErrors.claimAmount = 'Minimum claim amount should be ₹1,000';
      }
      
      if (claimAmount > coverageAmount * 0.8) { // Warning if claim is close to coverage limit
        newErrors.claimAmount = `Claim amount (₹${claimAmount.toLocaleString()}) is very close to coverage limit (₹${coverageAmount.toLocaleString()})`;
      }
    }
    
    if (!formData.claimDate) {
      newErrors.claimDate = 'Claim date is required';
    }
    
    // Check if claim date is in the future
    if (formData.claimDate && new Date(formData.claimDate) > new Date()) {
      newErrors.claimDate = 'Claim date cannot be in the future';
    }
    
    // Check if claim date is too old (more than 1 year)
    if (formData.claimDate) {
      const claimDate = new Date(formData.claimDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      if (claimDate < oneYearAgo) {
        newErrors.claimDate = 'Claim date cannot be more than 1 year old';
      }
    }
    
    if (!formData.claimType) {
      newErrors.claimType = 'Claim type selection is mandatory';
    }
    
    if (!formData.claimDescription.trim()) {
      newErrors.claimDescription = 'Claim description is required';
    }
    
    if (formData.claimDescription && formData.claimDescription.trim().length < 20) {
      newErrors.claimDescription = 'Claim description must be at least 20 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      const claimData = {
        claimNumber: formData.claimId,
        policy: formData.policyId,
        claimAmount: parseFloat(formData.claimAmount),
        claimDate: formData.claimDate,
        claimType: formData.claimType,
        description: formData.claimDescription,
        status: formData.status,
        incidentDate: formData.claimDate, // Using claim date as incident date
        fraudFlag: false // Default to no fraud flag
      };
      
      await claimService.createClaim(claimData);
      toast.success('Claim Submitted Successfully');
      
      // Redirect to claims page after successful submission
      setTimeout(() => {
        navigate('/claims');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating claim:', error);
      toast.error(error.response?.data?.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getClaimTypeIcon = (type) => {
    switch (type) {
      case 'accident': return <Car className="w-4 h-4" />;
      case 'medical': return <Heart className="w-4 h-4" />;
      case 'theft': return <AlertTriangle className="w-4 h-4" />;
      case 'natural': return <Zap className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <BeautifulBackground>
      <TopNavigation />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/claims')}
              className="flex items-center text-gray-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Claims
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2">File New Claim</h1>
              <p className="text-gray-400">Submit an insurance claim for your policy</p>
            </motion.div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Claim ID (Auto-generated) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Claim ID
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.claimId}
                    disabled
                    className="w-full bg-gray-700 border border-gray-600 text-gray-300 p-3 pl-10 rounded-lg cursor-not-allowed"
                    placeholder="Auto-generated"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-generated claim reference number</p>
              </div>

              {/* Policy Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Policy *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.policyId}
                    onChange={(e) => handleInputChange('policyId', e.target.value)}
                    className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white appearance-none cursor-pointer ${
                      errors.policyId ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    disabled={policiesLoading}
                  >
                    <option value="">
                      {policiesLoading ? 'Loading policies...' : 'Select a policy'}
                    </option>
                    {policies.map((policy) => (
                      <option key={policy._id} value={policy._id}>
                        {policy.policyNumber} - {policy.customer?.name} ({policy.type?.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.policyId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.policyId}
                  </p>
                )}
              </div>

              {/* Customer Name (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.customerName}
                    disabled
                    className="w-full bg-gray-700 border border-gray-600 text-gray-300 p-3 pl-10 rounded-lg cursor-not-allowed"
                    placeholder="Auto-filled from policy"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-filled based on selected policy</p>
              </div>

              {/* Coverage Information */}
              {selectedPolicy && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Policy Coverage Amount</p>
                      <p className="text-lg font-semibold text-green-400">
                        ₹{selectedPolicy.coverage?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Policy Type</p>
                      <p className="text-lg font-semibold text-blue-400">
                        {selectedPolicy.type?.toUpperCase() || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Claim Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Claim Amount (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.claimAmount}
                    onChange={(e) => handleInputChange('claimAmount', e.target.value)}
                    className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white ${
                      errors.claimAmount ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="₹5,000"
                    min="1000"
                    step="500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum claim: ₹1,000</p>
                {errors.claimAmount && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.claimAmount}
                  </p>
                )}
                {selectedPolicy && formData.claimAmount && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum claimable amount: ₹{selectedPolicy.coverage?.toLocaleString() || '0'}
                  </p>
                )}
              </div>

              {/* Claim Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Claim Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.claimDate}
                    onChange={(e) => handleInputChange('claimDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white ${
                      errors.claimDate ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                {errors.claimDate && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.claimDate}
                  </p>
                )}
              </div>

              {/* Claim Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Claim Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'accident', label: 'Accident', icon: Car },
                    { value: 'medical', label: 'Medical', icon: Heart },
                    { value: 'theft', label: 'Theft', icon: AlertTriangle },
                    { value: 'natural', label: 'Natural Disaster', icon: Zap }
                  ].map((type) => (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInputChange('claimType', type.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.claimType === type.value
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        {type.icon && <type.icon className="w-5 h-5" />}
                        <span className="text-xs font-medium">{type.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {errors.claimType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.claimType}
                  </p>
                )}
              </div>

              {/* Claim Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Claim Description *
                </label>
                <textarea
                  value={formData.claimDescription}
                  onChange={(e) => handleInputChange('claimDescription', e.target.value)}
                  className={`w-full bg-gray-700 border p-3 rounded-lg text-white resize-none ${
                    errors.claimDescription ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Describe the incident or circumstances leading to this claim..."
                  rows={4}
                />
                {errors.claimDescription && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.claimDescription}
                  </p>
                )}
              </div>

              {/* Claim Status (Default: Submitted) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Claim Status
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 p-3 pl-10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">Default status is "Submitted"</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/claims')}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors mr-4"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting Claim...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Submit Claim
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </BeautifulBackground>
  );
};

export default AddClaim;
