import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Download, Calendar, DollarSign, TrendingUp, User } from 'lucide-react';
import DataTable from '../components/DataTable';
import { policyService } from '../services/api';
import toast from 'react-hot-toast';
import TopNavigation from '../components/TopNavigation';
import BeautifulBackground from '../components/BeautifulBackground';

const PolicyList = () => {
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

  const fetchPolicies = useCallback(async () => {
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
  }, [pagination.page, pagination.limit, pagination.search, pagination.filters]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handleView = (policy) => {
    toast.info(`Viewing policy ${policy.policyNumber} details`);
  };

  const handleDownload = (policy) => {
    toast.info(`Downloading policy ${policy.policyNumber}`);
    // In a real app, this would generate and download a PDF
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

  // Sample duplicate policies data
  const samplePolicies = [
    {
      _id: 'list1',
      policyNumber: 'AUTO-111111',
      customer: { name: 'Alice Johnson', email: 'alice@example.com' },
      type: 'auto',
      premium: 225,
      coverage: 45000,
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2025-01-20',
      description: 'Comprehensive auto insurance',
      terms: 'Full coverage with roadside assistance',
      additionalInfo: {
        vehicleMake: 'Honda',
        vehicleModel: 'Accord',
        vehicleYear: '2023',
        vehicleVin: '1HGCV1F3XMA123456',
      }
    },
    {
      _id: 'list2',
      policyNumber: 'HOME-222222',
      customer: { name: 'Bob Williams', email: 'bob@example.com' },
      type: 'home',
      premium: 165,
      coverage: 250000,
      status: 'active',
      startDate: '2024-02-10',
      endDate: '2025-02-10',
      description: 'Standard homeowners insurance',
      terms: 'Includes fire and theft protection',
      additionalInfo: {
        propertyType: 'Condo',
        propertyAddress: '456 Oak Ave, Anytown, USA',
      }
    },
    {
      _id: 'list3',
      policyNumber: 'LIFE-333333',
      customer: { name: 'Carol Davis', email: 'carol@example.com' },
      type: 'life',
      premium: 285,
      coverage: 750000,
      status: 'active',
      startDate: '2023-11-15',
      endDate: '2033-11-15',
      description: 'Term life insurance policy',
      terms: '15-year term with guaranteed renewal',
      additionalInfo: {
        lifeCoverageType: 'Term Life',
        beneficiary: 'Michael Davis',
      }
    },
    {
      _id: 'list4',
      policyNumber: 'AUTO-444444',
      customer: { name: 'David Miller', email: 'david@example.com' },
      type: 'auto',
      premium: 195,
      coverage: 30000,
      status: 'pending',
      startDate: '2024-03-15',
      endDate: '2025-03-15',
      description: 'Basic auto insurance coverage',
      terms: 'Liability and collision coverage only',
      additionalInfo: {
        vehicleMake: 'Ford',
        vehicleModel: 'Focus',
        vehicleYear: '2022',
        vehicleVin: '1FADP3K22DL123456',
      }
    },
    {
      _id: 'list5',
      policyNumber: 'HEALTH-555555',
      customer: { name: 'Eva Brown', email: 'eva@example.com' },
      type: 'health',
      premium: 380,
      coverage: 80000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      description: 'Premium health insurance plan',
      terms: 'PPO with dental and vision coverage',
      additionalInfo: {
        healthCoverageType: 'PPO',
        preExistingConditions: 'None',
      }
    },
    {
      _id: 'list6',
      policyNumber: 'AUTO-666666',
      customer: { name: 'Frank Garcia', email: 'frank@example.com' },
      type: 'auto',
      premium: 275,
      coverage: 60000,
      status: 'active',
      startDate: '2023-12-01',
      endDate: '2024-12-01',
      description: 'Premium auto insurance',
      terms: 'Full coverage with zero deductible',
      additionalInfo: {
        vehicleMake: 'BMW',
        vehicleModel: 'X5',
        vehicleYear: '2023',
        vehicleVin: '5UXCR6C05N9B12345',
      }
    },
    {
      _id: 'list7',
      policyNumber: 'HOME-777777',
      customer: { name: 'Grace Martinez', email: 'grace@example.com' },
      type: 'home',
      premium: 210,
      coverage: 400000,
      status: 'active',
      startDate: '2024-02-15',
      endDate: '2025-02-15',
      description: 'Premium homeowners insurance',
      terms: 'All-risk coverage with natural disaster protection',
      additionalInfo: {
        propertyType: 'Single Family Home',
        propertyAddress: '789 Pine St, Anytown, USA',
      }
    },
    {
      _id: 'list8',
      policyNumber: 'LIFE-888888',
      customer: { name: 'Henry Wilson', email: 'henry@example.com' },
      type: 'life',
      premium: 450,
      coverage: 2000000,
      status: 'active',
      startDate: '2023-06-01',
      endDate: '2043-06-01',
      description: 'Whole life insurance policy',
      terms: 'Permanent coverage with cash value accumulation',
      additionalInfo: {
        lifeCoverageType: 'Whole Life',
        beneficiary: 'Sarah Wilson',
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
                Policy List
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                View and manage all insurance policies
              </p>
            </div>
          </div>

          <DataTable
            data={displayPolicies}
            columns={columns}
            loading={loading}
            onEdit={handleView}
            onDelete={handleDownload}
            pagination={pagination}
            setPagination={setPagination}
            fetchData={fetchPolicies}
            actions={false}
          />
        </div>
      </div>
    </BeautifulBackground>
  );
};

export default PolicyList;
