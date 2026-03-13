import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Mail, Phone, Calendar } from 'lucide-react';
import DataTable from '../components/DataTable';
import { customerService } from '../services/api';
import toast from 'react-hot-toast';
import TopNavigation from '../components/TopNavigation';
import BeautifulBackground from '../components/BeautifulBackground';

const Customers = () => {
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
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: pagination.search,
        ...pagination.filters,
      };
      
      const res = await customerService.getCustomers(params);
      setCustomers(res.data.data);
      setPagination(prev => ({
        ...prev,
        ...res.data.pagination,
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, pagination.limit, pagination.search, pagination.filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer._id, formData);
        toast.success('Customer updated successfully');
      } else {
        await customerService.createCustomer(formData);
        toast.success('Customer created successfully');
      }
      
      resetForm();
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error saving customer');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: {
        street: customer?.address?.street || '',
        city: customer?.address?.city || '',
        state: customer?.address?.state || '',
        zipCode: customer?.address?.zipCode || '',
        country: customer?.address?.country || '',
      },
    });
    setShowModal(true);
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Delete customer ${customer.name}?`)) return;
    
    try {
      await customerService.deleteCustomer(customer._id);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (value) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          <div>
            <div className="font-medium">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (value) => (
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => (
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Address',
      render: (value) => (
        <div>
          <div className="text-sm">
            {value?.street && <div>{value.street}</div>}
            {value?.city && <div>{value.city}, {value?.state}</div>}
            {value?.country && <div>{value.country}</div>}
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      type: 'date',
    },
  ];

  return (
    <BeautifulBackground>
      <TopNavigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-white">
                Customers
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your customer database
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </motion.button>
          </div>

          <DataTable
            data={customers}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            setPagination={setPagination}
            fetchData={fetchCustomers}
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
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      {editingCustomer ? 'Edit Customer' : 'Add Customer'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Street"
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, street: e.target.value }
                            })
                          }
                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={formData.address.city}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: { ...formData.address, city: e.target.value }
                              })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="State"
                            value={formData.address.state}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: { ...formData.address, state: e.target.value }
                              })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Zip Code"
                            value={formData.address.zipCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: { ...formData.address, zipCode: e.target.value }
                              })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="Country"
                            value={formData.address.country}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: { ...formData.address, country: e.target.value }
                              })
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetForm}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          {editingCustomer ? 'Update' : 'Create'}
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

export default Customers;
