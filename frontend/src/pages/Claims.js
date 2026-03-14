import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  AlertTriangle
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
    severity: 'medium'
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
      severity: 'medium'
    });

  };

  const handleEdit = (claim) => {
    setEditingClaim(claim);
    setFormData({
      ...claim,
      policy: claim?.policy?._id || ''
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
      toast.error('Delete failed');
    }

  };

  const columns = [

    {
      key: 'claimNumber',
      header: 'Claim Number',
      render: (value) => (
        <div className="flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
          <span className="font-mono font-semibold">{value}</span>
        </div>
      ),
    },

    {
      key: 'customer',
      header: 'Claim Name',
      render: (value, row) => (
        <span className="font-medium">
          {row?.customer?.name || 'N/A'}
        </span>
      ),
    },

    {
      key: 'incidentType',
      header: 'Claim Type',
      render: (value) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {value ? value.toUpperCase() : 'N/A'}
        </span>
      ),
    },

    {
      key: 'claimAmount',
      header: 'Claim Amount',
      render: (value) => (
        <span className="font-semibold text-blue-600">
          {Number(value).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
          })}
        </span>
      ),
    },

    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'approved'
            ? 'bg-green-100 text-green-800'
            : value === 'rejected'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value?.toUpperCase()}
        </span>
      ),
    },

    {
      key: 'incidentDate',
      header: 'Incident Date',
      render: (value) => (
        <span>
          {value ? new Date(value).toLocaleDateString('en-IN') : 'N/A'}
        </span>
      ),
    }

  ];

  return (

    <BeautifulBackground>

      <TopNavigation />

      <div className="pt-16">

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-2xl font-bold text-white">
                Claims Management
              </h1>

              <p className="text-gray-400">
                Manage insurance claims with fraud detection
              </p>

            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </motion.button>

          </div>

          <DataTable
            data={claims}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            setPagination={setPagination}
            fetchData={fetchClaims}
            actions={false}
          />

        </div>

      </div>

    </BeautifulBackground>

  );

};

export default Claims;