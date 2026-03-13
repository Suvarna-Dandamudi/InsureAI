import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Shield, DollarSign, Calendar, TrendingUp, User, FileText, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import { policyService, customerService } from '../services/api';
import toast from 'react-hot-toast';
import TopNavigation from '../components/TopNavigation';
import BeautifulBackground from '../components/BeautifulBackground';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    search: '',
    filters: {},
  });
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    customer: '',
    type: 'auto',
    premium: '',
    coverage: '',
    deductible: '',
    startDate: '',
    endDate: '',
    status: 'active',
    policyNumber: '',
    description: '',
    terms: '',
    additionalInfo: {
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehicleVin: '',
      propertyType: '',
      propertyAddress: '',
      lifeCoverageType: '',
      beneficiary: '',
      healthCoverageType: '',
      preExistingConditions: '',
    }
  });

  useEffect(() => {
    fetchPolicies();
    fetchCustomers();
  }, [pagination.page, pagination.search, pagination.filters]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: pagination.search,
        ...pagination.filters,
      };
      
      const response = await policyService.getPolicies(params);
      setPolicies(response.data.data);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getCustomers({ limit: 100 });
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPolicy) {
        await policyService.updatePolicy(editingPolicy._id, formData);
        toast.success('Policy updated successfully');
      } else {
        await policyService.createPolicy(formData);
        toast.success('Policy created successfully');
      }
      
      resetForm();
      fetchPolicies();
    } catch (error) {
      console.error('Error saving policy:', error);
      toast.error(error.response?.data?.message || 'Error saving policy');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingPolicy(null);
    setFormData({
      customer: '',
      type: 'auto',
      premium: '',
      coverage: '',
      deductible: '',
      startDate: '',
      endDate: '',
      status: 'active',
      policyNumber: '',
      description: '',
      terms: '',
      additionalInfo: {
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleVin: '',
        propertyType: '',
        propertyAddress: '',
        lifeCoverageType: '',
        beneficiary: '',
        healthCoverageType: '',
        preExistingConditions: '',
      }
    });
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setFormData({
      customer: policy?.customer?._id || '',
      type: policy?.type || 'auto',
      premium: policy?.premium || '',
      coverage: policy?.coverage || '',
      deductible: policy?.deductible || '',
      startDate: policy?.startDate ? new Date(policy.startDate).toISOString().split('T')[0] : '',
      endDate: policy?.endDate ? new Date(policy.endDate).toISOString().split('T')[0] : '',
      status: policy?.status || 'active',
      policyNumber: policy?.policyNumber || '',
      description: policy?.description || '',
      terms: policy?.terms || '',
      additionalInfo: {
        vehicleMake: policy?.additionalInfo?.vehicleMake || '',
        vehicleModel: policy?.additionalInfo?.vehicleModel || '',
        vehicleYear: policy?.additionalInfo?.vehicleYear || '',
        vehicleVin: policy?.additionalInfo?.vehicleVin || '',
        propertyType: policy?.additionalInfo?.propertyType || '',
        propertyAddress: policy?.additionalInfo?.propertyAddress || '',
        lifeCoverageType: policy?.additionalInfo?.lifeCoverageType || '',
        beneficiary: policy?.additionalInfo?.beneficiary || '',
        healthCoverageType: policy?.additionalInfo?.healthCoverageType || '',
        preExistingConditions: policy?.additionalInfo?.preExistingConditions || '',
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (policy) => {
    if (!window.confirm(`Delete policy ${policy.policyNumber}?`)) return;
    
    try {
      await policyService.deletePolicy(policy._id);
      toast.success('Policy deleted successfully');
      fetchPolicies();
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast.error('Failed to delete policy');
    }
  };

  const generatePolicyNumber = () => {
    const prefix = formData.type === 'auto' ? 'AUTO' : 
                   formData.type === 'home' ? 'HOME' : 
                   formData.type === 'life' ? 'LIFE' : 'HEALTH';
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${prefix}-${random}`;
  };

  const columns = [
    {
      key: 'policyNumber',
      header: 'Policy Number',
      render: (value) => (
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-2 text-blue-500" />
          <span className="font-mono font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{value?.email}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'auto' ? 'bg-blue-100 text-blue-800' :
          value === 'home' ? 'bg-green-100 text-green-800' :
          value === 'life' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value?.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'premium',
      header: 'Premium',
      render: (value) => (
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-green-500" />
          <span className="font-semibold">{Number(value).toLocaleString()}</span>
          <span className="text-sm text-gray-500 ml-1">/month</span>
        </div>
      ),
    },
    {
      key: 'coverage',
      header: 'Coverage',
      render: (value) => (
        <div className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-1 text-blue-500" />
          <span className="font-semibold">{Number(value).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' :
          value === 'expired' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value?.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Start Date',
      type: 'date',
    },
    {
      key: 'endDate',
      header: 'End Date',
      type: 'date',
    },
  ];

  // Sample duplicate data for demonstration
  const samplePolicies = [
    {
      _id: 'sample1',
      policyNumber: 'AUTO-123456',
      customer: { name: 'John Smith', email: 'john@example.com' },
      type: 'auto',
      premium: 250,
      coverage: 50000,
      deductible: 1000,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      description: 'Comprehensive auto insurance coverage',
      terms: 'Standard terms and conditions apply',
      additionalInfo: {
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vehicleYear: '2022',
        vehicleVin: '1HGBH41JXMN109186',
      }
    },
    {
      _id: 'sample2',
      policyNumber: 'HOME-789012',
      customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      type: 'home',
      premium: 180,
      coverage: 300000,
      deductible: 2000,
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      description: 'Homeowners insurance with flood coverage',
      terms: 'Includes natural disaster protection',
      additionalInfo: {
        propertyType: 'Single Family Home',
        propertyAddress: '123 Main St, Anytown, USA',
      }
    },
    {
      _id: 'sample3',
      policyNumber: 'LIFE-345678',
      customer: { name: 'Michael Davis', email: 'michael@example.com' },
      type: 'life',
      premium: 320,
      coverage: 1000000,
      deductible: 0,
      status: 'active',
      startDate: '2023-12-01',
      endDate: '2033-12-01',
      description: 'Term life insurance policy',
      terms: '20-year term with renewable option',
      additionalInfo: {
        lifeCoverageType: 'Term Life',
        beneficiary: 'Jane Davis',
      }
    },
    {
      _id: 'sample4',
      policyNumber: 'AUTO-901234',
      customer: { name: 'Emily Wilson', email: 'emily@example.com' },
      type: 'auto',
      premium: 195,
      coverage: 35000,
      deductible: 1500,
      status: 'pending',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      description: 'Basic auto insurance coverage',
      terms: 'Liability and collision coverage',
      additionalInfo: {
        vehicleMake: 'Honda',
        vehicleModel: 'Civic',
        vehicleYear: '2021',
        vehicleVin: '2HGFC2F59MH123456',
      }
    },
    {
      _id: 'sample5',
      policyNumber: 'HEALTH-567890',
      customer: { name: 'Robert Brown', email: 'robert@example.com' },
      type: 'health',
      premium: 450,
      coverage: 100000,
      deductible: 5000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      description: 'Comprehensive health insurance plan',
      terms: 'PPO network with prescription coverage',
      additionalInfo: {
        healthCoverageType: 'PPO',
        preExistingConditions: 'None',
      }
    },
  ];

  const displayPolicies = policies.length > 0 ? policies : samplePolicies;

  return (
    <BeautifulBackground>
      <TopNavigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-white">
                Insurance Policies
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage insurance policies for your customers
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Policy</span>
            </motion.button>
          </div>

          <DataTable
            data={displayPolicies}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            setPagination={setPagination}
            fetchData={fetchPolicies}
          />

          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto"
              >
                <div className="flex items-center justify-center min-h-screen px-4">
                  <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
                  
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Customer *
                          </label>
                          <select
                            required
                            value={formData.customer}
                            onChange={(e) =>
                              setFormData({ ...formData, customer: e.target.value })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                              <option key={customer._id} value={customer._id}>
                                {customer.name} - {customer.email}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Policy Type *
                          </label>
                          <select
                            required
                            value={formData.type}
                            onChange={(e) => {
                              const newType = e.target.value;
                              setFormData({ 
                                ...formData, 
                                type: newType,
                                policyNumber: generatePolicyNumber()
                              });
                            }}
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="auto">Auto Insurance</option>
                            <option value="home">Home Insurance</option>
                            <option value="life">Life Insurance</option>
                            <option value="health">Health Insurance</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Policy Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.policyNumber || generatePolicyNumber()}
                            onChange={(e) =>
                              setFormData({ ...formData, policyNumber: e.target.value })
                            }
                            placeholder="Auto-generated if empty"
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="expired">Expired</option>
                          </select>
                        </div>
                      </div>

                      {/* Financial Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Monthly Premium *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              required
                              value={formData.premium}
                              onChange={(e) =>
                                setFormData({ ...formData, premium: e.target.value })
                              }
                              placeholder="0.00"
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Coverage Amount *
                          </label>
                          <div className="relative">
                            <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              required
                              value={formData.coverage}
                              onChange={(e) =>
                                setFormData({ ...formData, coverage: e.target.value })
                              }
                              placeholder="0.00"
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Deductible
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={formData.deductible}
                              onChange={(e) =>
                                setFormData({ ...formData, deductible: e.target.value })
                              }
                              placeholder="0.00"
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Date Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              required
                              value={formData.startDate}
                              onChange={(e) =>
                                setFormData({ ...formData, startDate: e.target.value })
                              }
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              required
                              value={formData.endDate}
                              onChange={(e) =>
                                setFormData({ ...formData, endDate: e.target.value })
                              }
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Policy Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          placeholder="Enter policy description and coverage details..."
                          rows={3}
                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Type-specific fields */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Additional Information
                        </h3>
                        
                        {formData.type === 'auto' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Make
                              </label>
                              <input
                                type="text"
                                value={formData.additionalInfo.vehicleMake}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, vehicleMake: e.target.value }
                                  })
                                }
                                placeholder="Toyota, Honda, etc."
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Model
                              </label>
                              <input
                                type="text"
                                value={formData.additionalInfo.vehicleModel}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, vehicleModel: e.target.value }
                                  })
                                }
                                placeholder="Camry, Civic, etc."
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vehicle Year
                              </label>
                              <input
                                type="text"
                                value={formData.additionalInfo.vehicleYear}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, vehicleYear: e.target.value }
                                  })
                                }
                                placeholder="2022, 2023, etc."
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                VIN Number
                              </label>
                              <input
                                type="text"
                                value={formData.additionalInfo.vehicleVin}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, vehicleVin: e.target.value }
                                  })
                                }
                                placeholder="Vehicle Identification Number"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                        
                        {formData.type === 'home' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Property Type
                              </label>
                              <select
                                value={formData.additionalInfo.propertyType}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, propertyType: e.target.value }
                                  })
                                }
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select Property Type</option>
                                <option value="Single Family Home">Single Family Home</option>
                                <option value="Condo">Condo</option>
                                <option value="Townhouse">Townhouse</option>
                                <option value="Apartment">Apartment</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Property Address
                              </label>
                              <input
                                type="text"
                                value={formData.additionalInfo.propertyAddress}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, propertyAddress: e.target.value }
                                  })
                                }
                                placeholder="Full property address"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                        
                        {formData.type === 'life' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Coverage Type
                              </label>
                              <select
                                value={formData.additionalInfo.lifeCoverageType}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, lifeCoverageType: e.target.value }
                                  })
                                }
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select Coverage Type</option>
                                <option value="Term Life">Term Life</option>
                                <option value="Whole Life">Whole Life</option>
                                <option value="Universal Life">Universal Life</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Beneficiary
                              </label>
                              <input
                                type="text"
                                value={formData.additionalInfo.beneficiary}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, beneficiary: e.target.value }
                                  })
                                }
                                placeholder="Beneficiary name"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                        
                        {formData.type === 'health' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Coverage Type
                              </label>
                              <select
                                value={formData.additionalInfo.healthCoverageType}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, healthCoverageType: e.target.value }
                                  })
                                }
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select Coverage Type</option>
                                <option value="PPO">PPO</option>
                                <option value="HMO">HMO</option>
                                <option value="EPO">EPO</option>
                                <option value="POS">POS</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pre-existing Conditions
                              </label>
                              <input
                                type="text"
                                value={formData.additionalInfo.preExistingConditions}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, preExistingConditions: e.target.value }
                                  })
                                }
                                placeholder="None or list conditions"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Terms and Conditions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Terms and Conditions
                        </label>
                        <textarea
                          value={formData.terms}
                          onChange={(e) =>
                            setFormData({ ...formData, terms: e.target.value })
                          }
                          placeholder="Enter policy terms and conditions..."
                          rows={4}
                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end gap-3 pt-6 border-t">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetForm}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {editingPolicy ? 'Update Policy' : 'Create Policy'}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BeautifulBackground>
  );
};

export default Policies;
