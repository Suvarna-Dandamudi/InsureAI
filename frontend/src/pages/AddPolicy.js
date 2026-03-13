import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  IndianRupee,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService, policyService } from '../services/api';
import toast from 'react-hot-toast';
import TopNavigation from '../components/TopNavigation';
import BeautifulBackground from '../components/BeautifulBackground';

const AddPolicy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    policyId: '',
    customerId: '',
    policyType: '',
    policyName: '',
    coverageAmount: '',
    premiumAmount: '',
    startDate: '',
    endDate: '',
    paymentFrequency: 'monthly',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  // Generate auto policy ID
  const generatePolicyId = () => {
    const prefix = formData.policyType === 'health' ? 'HLTH' :
                   formData.policyType === 'life' ? 'LIFE' :
                   formData.policyType === 'vehicle' ? 'VEH' :
                   formData.policyType === 'property' ? 'PROP' : 'POL';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const response = await customerService.getCustomers({ limit: 100 });
        setCustomers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load customers');
      } finally {
        setCustomersLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Update policy ID when policy type changes
  useEffect(() => {
    if (formData.policyType) {
      setFormData(prev => ({ ...prev, policyId: generatePolicyId() }));
    }
  }, [formData.policyType]);

  // Auto-fill policy name based on type
  useEffect(() => {
    if (formData.policyType) {
      const policyNames = {
        health: 'Health Insurance Policy',
        life: 'Life Insurance Policy',
        vehicle: 'Vehicle Insurance Policy',
        property: 'Property Insurance Policy'
      };
      setFormData(prev => ({ ...prev, policyName: policyNames[formData.policyType] || '' }));
    }
  }, [formData.policyType]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer selection is mandatory';
    }
    
    if (!formData.policyType) {
      newErrors.policyType = 'Policy type selection is mandatory';
    }
    
    if (!formData.policyName.trim()) {
      newErrors.policyName = 'Policy name is required';
    }
    
    if (!formData.coverageAmount || parseFloat(formData.coverageAmount) <= 0) {
      newErrors.coverageAmount = 'Coverage amount must be greater than ₹0';
    }
    
    if (!formData.premiumAmount || parseFloat(formData.premiumAmount) <= 0) {
      newErrors.premiumAmount = 'Premium amount must be greater than ₹0';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Policy start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Policy end date is required';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Policy end date must be after start date';
    }
    
    if (!formData.paymentFrequency) {
      newErrors.paymentFrequency = 'Payment frequency selection is mandatory';
    }
    
    // Additional business validation
    if (formData.coverageAmount && formData.premiumAmount) {
      const coverage = parseFloat(formData.coverageAmount);
      const premium = parseFloat(formData.premiumAmount);
      
      if (premium > coverage * 0.1) { // Premium shouldn't exceed 10% of coverage
        newErrors.premiumAmount = 'Premium amount seems too high for the coverage amount';
      }
      
      if (coverage < 10000) {
        newErrors.coverageAmount = 'Minimum coverage amount should be ₹10,000';
      }
      
      if (premium < 100) {
        newErrors.premiumAmount = 'Minimum premium amount should be ₹100';
      }
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
      const policyData = {
        policyNumber: formData.policyId,
        customer: formData.customerId,
        type: formData.policyType,
        name: formData.policyName,
        coverage: parseFloat(formData.coverageAmount),
        premium: parseFloat(formData.premiumAmount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        paymentFrequency: formData.paymentFrequency,
        status: formData.status,
        description: `${formData.policyName} - Coverage: ₹${parseFloat(formData.coverageAmount).toLocaleString()}`,
        terms: 'Standard insurance terms and conditions apply'
      };
      
      await policyService.createPolicy(policyData);
      toast.success('Policy Added Successfully');
      
      // Redirect to policy list after successful submission
      setTimeout(() => {
        navigate('/policy-list');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating policy:', error);
      toast.error(error.response?.data?.message || 'Failed to add policy');
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
              onClick={() => navigate('/policy-list')}
              className="flex items-center text-gray-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Policy List
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2">Add New Policy</h1>
              <p className="text-gray-400">Create a new insurance policy for your customer</p>
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
              {/* Policy ID (Auto-generated) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Policy ID
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.policyId}
                    disabled
                    className="w-full bg-gray-700 border border-gray-600 text-gray-300 p-3 pl-10 rounded-lg cursor-not-allowed"
                    placeholder="Auto-generated"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-generated based on policy type</p>
              </div>

              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Customer *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleInputChange('customerId', e.target.value)}
                    className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white appearance-none cursor-pointer ${
                      errors.customerId ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    disabled={customersLoading}
                  >
                    <option value="">
                      {customersLoading ? 'Loading customers...' : 'Select a customer'}
                    </option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name} - {customer.email}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.customerId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.customerId}
                  </p>
                )}
              </div>

              {/* Policy Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Policy Type *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.policyType}
                    onChange={(e) => handleInputChange('policyType', e.target.value)}
                    className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white appearance-none cursor-pointer ${
                      errors.policyType ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="">Select policy type</option>
                    <option value="health">Health Insurance</option>
                    <option value="life">Life Insurance</option>
                    <option value="vehicle">Vehicle Insurance</option>
                    <option value="property">Property Insurance</option>
                  </select>
                </div>
                {errors.policyType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.policyType}
                  </p>
                )}
              </div>

              {/* Policy Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Policy Name *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.policyName}
                    onChange={(e) => handleInputChange('policyName', e.target.value)}
                    className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white ${
                      errors.policyName ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter policy name"
                  />
                </div>
                {errors.policyName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.policyName}
                  </p>
                )}
              </div>

              {/* Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Coverage Amount (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.coverageAmount}
                      onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
                      className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white ${
                        errors.coverageAmount ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="₹50,000"
                      min="10000"
                      step="1000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum coverage: ₹10,000</p>
                  {errors.coverageAmount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.coverageAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Premium Amount (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.premiumAmount}
                      onChange={(e) => handleInputChange('premiumAmount', e.target.value)}
                      className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white ${
                        errors.premiumAmount ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="₹1,500"
                      min="100"
                      step="50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum premium: ₹100 per month</p>
                  {errors.premiumAmount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.premiumAmount}
                    </p>
                  )}
                </div>
              </div>

              {/* Date Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Policy Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white ${
                        errors.startDate ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Policy End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white ${
                        errors.endDate ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Frequency *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.paymentFrequency}
                    onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                    className={`w-full bg-gray-700 border p-3 pl-10 rounded-lg text-white appearance-none cursor-pointer ${
                      errors.paymentFrequency ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                {errors.paymentFrequency && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.paymentFrequency}
                  </p>
                )}
              </div>

              {/* Policy Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Policy Status
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 p-3 pl-10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/policy-list')}
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
                      Adding Policy...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Policy
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

export default AddPolicy;
