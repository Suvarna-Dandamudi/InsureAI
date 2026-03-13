import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  User,
  MapPin,
  Clock,
  Shield,
  AlertCircle
} from 'lucide-react';
import DataTable from '../components/DataTable';
import { claimService, policyService } from '../services/api';
import toast from 'react-hot-toast';
import TopNavigation from '../components/TopNavigation';
import BeautifulBackground from '../components/BeautifulBackground';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
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
  const [editingClaim, setEditingClaim] = useState(null);
  const [formData, setFormData] = useState({
    policy: '',
    claimNumber: '',
    claimAmount: '',
    approvedAmount: '',
    status: 'pending',
    description: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    incidentType: '',
    severity: 'medium',
    witnesses: [],
    policeReport: false,
    policeReportNumber: '',
    medicalAttention: false,
    hospitalName: '',
    additionalInfo: {
      vehicleDamage: '',
      propertyDamage: '',
      injuries: '',
      weatherConditions: '',
      roadConditions: '',
      photos: [],
      documents: [],
      estimatedRepairCost: '',
      rentalCarNeeded: false,
      towingRequired: false,
    }
  });

  const fetchPolicies = useCallback(async () => {
    try {
      const res = await policyService.getPolicies({ limit: 100 });
      setPolicies(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: pagination.search,
        ...pagination.filters,
      };
      
      const res = await claimService.getClaims(params);
      setClaims(res.data.data);
      setPagination(prev => ({
        ...prev,
        ...res.data.pagination,
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, pagination.search, pagination.filters]);

  useEffect(() => {
    fetchClaims();
    fetchPolicies();
  }, [fetchClaims, fetchPolicies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Generate claim number if not provided
      const claimData = {
        ...formData,
        claimNumber: formData.claimNumber || `CLM-${Date.now()}`,
      };
      
      if (editingClaim) {
        await claimService.updateClaim(editingClaim._id, claimData);
        toast.success('Claim updated successfully');
      } else {
        await claimService.createClaim(claimData);
        toast.success('Claim created successfully');
      }
      
      resetForm();
      fetchClaims();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error saving claim');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingClaim(null);
    setFormData({
      policy: '',
      claimNumber: '',
      claimAmount: '',
      approvedAmount: '',
      status: 'pending',
      description: '',
      incidentDate: '',
      incidentTime: '',
      incidentLocation: '',
      incidentType: '',
      severity: 'medium',
      witnesses: [],
      policeReport: false,
      policeReportNumber: '',
      medicalAttention: false,
      hospitalName: '',
      additionalInfo: {
        vehicleDamage: '',
        propertyDamage: '',
        injuries: '',
        weatherConditions: '',
        roadConditions: '',
        photos: [],
        documents: [],
        estimatedRepairCost: '',
        rentalCarNeeded: false,
        towingRequired: false,
      }
    });
  };

  const handleEdit = (claim) => {
    setEditingClaim(claim);
    setFormData({
      policy: claim?.policy?._id || '',
      claimNumber: claim?.claimNumber || '',
      claimAmount: claim?.claimAmount || '',
      approvedAmount: claim?.approvedAmount || '',
      status: claim?.status || 'pending',
      description: claim?.description || '',
      incidentDate: claim?.incidentDate ? new Date(claim.incidentDate).toISOString().split('T')[0] : '',
      incidentTime: claim?.incidentTime || '',
      incidentLocation: claim?.incidentLocation || '',
      incidentType: claim?.incidentType || '',
      severity: claim?.severity || 'medium',
      witnesses: claim?.witnesses || [],
      policeReport: claim?.policeReport || false,
      policeReportNumber: claim?.policeReportNumber || '',
      medicalAttention: claim?.medicalAttention || false,
      hospitalName: claim?.hospitalName || '',
      additionalInfo: {
        vehicleDamage: claim?.additionalInfo?.vehicleDamage || '',
        propertyDamage: claim?.additionalInfo?.propertyDamage || '',
        injuries: claim?.additionalInfo?.injuries || '',
        weatherConditions: claim?.additionalInfo?.weatherConditions || '',
        roadConditions: claim?.additionalInfo?.roadConditions || '',
        photos: claim?.additionalInfo?.photos || [],
        documents: claim?.additionalInfo?.documents || [],
        estimatedRepairCost: claim?.additionalInfo?.estimatedRepairCost || '',
        rentalCarNeeded: claim?.additionalInfo?.rentalCarNeeded || false,
        towingRequired: claim?.additionalInfo?.towingRequired || false,
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (claim) => {
    if (!window.confirm(`Delete claim ${claim.claimNumber}?`)) return;
    
    try {
      await claimService.deleteClaim(claim._id);
      toast.success('Claim deleted');
      fetchClaims();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const handleApprove = async (claim) => {
    try {
      await claimService.approveClaim(claim._id, {
        approvedAmount: claim.claimAmount,
        status: 'approved',
      });
      toast.success('Claim approved');
      fetchClaims();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (claim) => {
    const reason = prompt('Enter rejection reason');
    if (!reason) return;
    
    try {
      await claimService.rejectClaim(claim._id, { 
        reason,
        status: 'rejected',
      });
      toast.success('Claim rejected');
      fetchClaims();
    } catch (err) {
      toast.error('Reject failed');
    }
  };

  const columns = [
    {
      key: 'claimNumber',
      header: 'Claim Number',
      render: (value, row) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="font-mono font-semibold">{value}</span>
          </div>
          <div className="flex items-center space-x-2">
            {row.status === 'pending' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApprove(row)}
                  className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  title="Approve"
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReject(row)}
                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{value?.email}</div>
        </div>
      ),
    },
    {
      key: 'policy',
      header: 'Policy',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.policyNumber}</div>
          <div className="text-xs text-gray-400">{value?.type?.toUpperCase()}</div>
        </div>
      ),
    },
    {
      key: 'claimAmount',
      header: 'Claim Amount',
      render: (value) => (
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
          <span className="font-semibold">{Number(value).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'incidentType',
      header: 'Incident Type',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'collision' ? 'bg-red-100 text-red-800' :
          value === 'theft' ? 'bg-orange-100 text-orange-800' :
          value === 'vandalism' ? 'bg-purple-100 text-purple-800' :
          value === 'natural' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value?.toUpperCase() || 'UNKNOWN'}
        </span>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'low' ? 'bg-green-100 text-green-800' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value?.toUpperCase() || 'MEDIUM'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'approved' ? 'bg-green-100 text-green-800' :
          value === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value?.toUpperCase() || 'PENDING'}
        </span>
      ),
    },
    {
      key: 'incidentDate',
      header: 'Incident Date',
      type: 'date',
    },
    {
      key: 'fraudFlag',
      header: 'Fraud Alert',
      render: (value) =>
        value ? (
          <span className="text-red-500 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Flagged
          </span>
        ) : (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ),
    },
  ];

  // Sample duplicate claims data
  const sampleClaims = [
    {
      _id: 'sample1',
      claimNumber: 'CLM-20240315-001',
      customer: { name: 'John Smith', email: 'john@example.com' },
      policy: { policyNumber: 'AUTO-123456', type: 'auto' },
      claimAmount: 15000,
      approvedAmount: 0,
      status: 'pending',
      description: 'Rear-end collision at intersection',
      incidentDate: '2024-03-15',
      incidentTime: '14:30',
      incidentLocation: 'Main St & Oak Ave, Downtown',
      incidentType: 'collision',
      severity: 'medium',
      witnesses: ['Jane Doe', 'Bob Johnson'],
      policeReport: true,
      policeReportNumber: 'PD-2024-0342',
      medicalAttention: true,
      hospitalName: 'City General Hospital',
      fraudFlag: false,
      additionalInfo: {
        vehicleDamage: 'Rear bumper, trunk, rear lights',
        propertyDamage: 'None',
        injuries: 'Whiplash, minor back pain',
        weatherConditions: 'Clear',
        roadConditions: 'Dry',
        estimatedRepairCost: 12000,
        rentalCarNeeded: true,
        towingRequired: true,
      }
    },
    {
      _id: 'sample2',
      claimNumber: 'CLM-20240310-002',
      customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      policy: { policyNumber: 'HOME-789012', type: 'home' },
      claimAmount: 8500,
      approvedAmount: 8500,
      status: 'approved',
      description: 'Kitchen fire caused by electrical short circuit',
      incidentDate: '2024-03-10',
      incidentTime: '08:15',
      incidentLocation: '123 Main St, Anytown, USA',
      incidentType: 'fire',
      severity: 'high',
      witnesses: [],
      policeReport: false,
      policeReportNumber: '',
      medicalAttention: false,
      hospitalName: '',
      fraudFlag: false,
      additionalInfo: {
        vehicleDamage: '',
        propertyDamage: 'Kitchen cabinets, appliances, smoke damage',
        injuries: 'None',
        weatherConditions: 'N/A',
        roadConditions: 'N/A',
        estimatedRepairCost: 8500,
        rentalCarNeeded: false,
        towingRequired: false,
      }
    },
    {
      _id: 'sample3',
      claimNumber: 'CLM-20240308-003',
      customer: { name: 'Michael Davis', email: 'michael@example.com' },
      policy: { policyNumber: 'AUTO-901234', type: 'auto' },
      claimAmount: 25000,
      approvedAmount: 0,
      status: 'pending',
      description: 'Vehicle stolen from parking lot',
      incidentDate: '2024-03-08',
      incidentTime: '22:45',
      incidentLocation: 'Downtown Shopping Mall Parking',
      incidentType: 'theft',
      severity: 'high',
      witnesses: [],
      policeReport: true,
      policeReportNumber: 'PD-2024-0289',
      medicalAttention: false,
      hospitalName: '',
      fraudFlag: true,
      additionalInfo: {
        vehicleDamage: 'Entire vehicle',
        propertyDamage: 'None',
        injuries: 'None',
        weatherConditions: 'Clear',
        roadConditions: 'Dry',
        estimatedRepairCost: 0,
        rentalCarNeeded: true,
        towingRequired: false,
      }
    },
    {
      _id: 'sample4',
      claimNumber: 'CLM-20240305-004',
      customer: { name: 'Emily Wilson', email: 'emily@example.com' },
      policy: { policyNumber: 'AUTO-567890', type: 'auto' },
      claimAmount: 3500,
      approvedAmount: 3500,
      status: 'approved',
      description: 'Minor collision with guardrail',
      incidentDate: '2024-03-05',
      incidentTime: '16:20',
      incidentLocation: 'Highway 101, Mile Marker 42',
      incidentType: 'collision',
      severity: 'low',
      witnesses: ['Highway Patrol Officer'],
      policeReport: true,
      policeReportNumber: 'HP-2024-0156',
      medicalAttention: false,
      hospitalName: '',
      fraudFlag: false,
      additionalInfo: {
        vehicleDamage: 'Front bumper, headlight',
        propertyDamage: 'Guardrail damage',
        injuries: 'None',
        weatherConditions: 'Rain',
        roadConditions: 'Wet',
        estimatedRepairCost: 3500,
        rentalCarNeeded: false,
        towingRequired: false,
      }
    },
    {
      _id: 'sample5',
      claimNumber: 'CLM-20240301-005',
      customer: { name: 'Robert Brown', email: 'robert@example.com' },
      policy: { policyNumber: 'HEALTH-234567', type: 'health' },
      claimAmount: 12000,
      approvedAmount: 12000,
      status: 'approved',
      description: 'Emergency surgery for appendicitis',
      incidentDate: '2024-03-01',
      incidentTime: '03:30',
      incidentLocation: 'Home',
      incidentType: 'medical',
      severity: 'medium',
      witnesses: [],
      policeReport: false,
      policeReportNumber: '',
      medicalAttention: true,
      hospitalName: 'St. Mary Medical Center',
      fraudFlag: false,
      additionalInfo: {
        vehicleDamage: '',
        propertyDamage: '',
        injuries: 'Appendicitis, surgery required',
        weatherConditions: 'N/A',
        roadConditions: 'N/A',
        estimatedRepairCost: 0,
        rentalCarNeeded: false,
        towingRequired: false,
      }
    },
  ];

  const displayClaims = claims.length > 0 ? claims : sampleClaims;

  return (
    <BeautifulBackground>
      <TopNavigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-white">Claims Management</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage insurance claims with fraud detection
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </motion.button>
          </div>
          
          <DataTable
            data={displayClaims}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            setPagination={setPagination}
            fetchData={fetchClaims}
            actions={false}
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
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {editingClaim ? 'Edit Claim' : 'New Claim'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Policy *
                          </label>
                          <select
                            required
                            value={formData.policy}
                            onChange={(e) =>
                              setFormData({ ...formData, policy: e.target.value })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Policy</option>
                            {policies.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.policyNumber} - {p.customer?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Claim Number
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.claimNumber || `CLM-${Date.now()}`}
                              onChange={(e) =>
                                setFormData({ ...formData, claimNumber: e.target.value })
                              }
                              placeholder="Auto-generated if empty"
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Claim Amount *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              required
                              value={formData.claimAmount}
                              onChange={(e) =>
                                setFormData({ ...formData, claimAmount: e.target.value })
                              }
                              placeholder="0.00"
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
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
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      {/* Incident Details */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Incident Details
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Incident Date *
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="date"
                                required
                                value={formData.incidentDate}
                                onChange={(e) =>
                                  setFormData({ ...formData, incidentDate: e.target.value })
                                }
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Incident Time
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="time"
                                value={formData.incidentTime}
                                onChange={(e) =>
                                  setFormData({ ...formData, incidentTime: e.target.value })
                                }
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Severity
                            </label>
                            <select
                              value={formData.severity}
                              onChange={(e) =>
                                setFormData({ ...formData, severity: e.target.value })
                              }
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Incident Location *
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                required
                                value={formData.incidentLocation}
                                onChange={(e) =>
                                  setFormData({ ...formData, incidentLocation: e.target.value })
                                }
                                placeholder="Where did the incident occur?"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Incident Type *
                            </label>
                            <select
                              required
                              value={formData.incidentType}
                              onChange={(e) =>
                                setFormData({ ...formData, incidentType: e.target.value })
                              }
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Type</option>
                              <option value="collision">Collision</option>
                              <option value="theft">Theft</option>
                              <option value="vandalism">Vandalism</option>
                              <option value="fire">Fire</option>
                              <option value="natural">Natural Disaster</option>
                              <option value="medical">Medical</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Incident Description *
                          </label>
                          <textarea
                            required
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Describe what happened in detail..."
                            rows={4}
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Additional Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Weather Conditions
                            </label>
                            <input
                              type="text"
                              value={formData.additionalInfo.weatherConditions}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  additionalInfo: { ...formData.additionalInfo, weatherConditions: e.target.value }
                                })
                              }
                              placeholder="Clear, Rain, Snow, etc."
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Road Conditions
                            </label>
                            <input
                              type="text"
                              value={formData.additionalInfo.roadConditions}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  additionalInfo: { ...formData.additionalInfo, roadConditions: e.target.value }
                                })
                              }
                              placeholder="Dry, Wet, Icy, etc."
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Estimated Repair Cost
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="number"
                                value={formData.additionalInfo.estimatedRepairCost}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    additionalInfo: { ...formData.additionalInfo, estimatedRepairCost: e.target.value }
                                  })
                                }
                                placeholder="0.00"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Vehicle/Property Damage
                            </label>
                            <input
                              type="text"
                              value={formData.additionalInfo.vehicleDamage || formData.additionalInfo.propertyDamage}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  additionalInfo: { 
                                    ...formData.additionalInfo, 
                                    vehicleDamage: e.target.value,
                                    propertyDamage: e.target.value
                                  }
                                })
                              }
                              placeholder="Describe damage..."
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Injuries
                            </label>
                            <input
                              type="text"
                              value={formData.additionalInfo.injuries}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  additionalInfo: { ...formData.additionalInfo, injuries: e.target.value }
                                })
                              }
                              placeholder="None or describe injuries..."
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Hospital Name
                            </label>
                            <div className="relative">
                              <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={formData.hospitalName}
                                onChange={(e) =>
                                  setFormData({ ...formData, hospitalName: e.target.value })
                                }
                                placeholder="If medical attention was required"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="policeReport"
                              checked={formData.policeReport}
                              onChange={(e) =>
                                setFormData({ ...formData, policeReport: e.target.checked })
                              }
                              className="mr-2"
                            />
                            <label htmlFor="policeReport" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Police Report Filed
                            </label>
                          </div>
                          
                          {formData.policeReport && (
                            <div>
                              <input
                                type="text"
                                value={formData.policeReportNumber}
                                onChange={(e) =>
                                  setFormData({ ...formData, policeReportNumber: e.target.value })
                                }
                                placeholder="Report Number"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="medicalAttention"
                              checked={formData.medicalAttention}
                              onChange={(e) =>
                                setFormData({ ...formData, medicalAttention: e.target.checked })
                              }
                              className="mr-2"
                            />
                            <label htmlFor="medicalAttention" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Medical Attention Required
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="rentalCarNeeded"
                              checked={formData.additionalInfo.rentalCarNeeded}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  additionalInfo: { ...formData.additionalInfo, rentalCarNeeded: e.target.checked }
                                })
                              }
                              className="mr-2"
                            />
                            <label htmlFor="rentalCarNeeded" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Rental Car Needed
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="towingRequired"
                              checked={formData.additionalInfo.towingRequired}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  additionalInfo: { ...formData.additionalInfo, towingRequired: e.target.checked }
                                })
                              }
                              className="mr-2"
                            />
                            <label htmlFor="towingRequired" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Towing Required
                            </label>
                          </div>
                        </div>
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
                          {editingClaim ? 'Update Claim' : 'Submit Claim'}
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

export default Claims;
