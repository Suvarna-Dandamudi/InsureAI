import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
  googleAuth: (data) => api.post('/api/auth/google', data),
};

export const customerService = {
  getCustomers: (params) => api.get('/api/customers', { params }),
  getCustomer: (id) => api.get(`/api/customers/${id}`),
  createCustomer: (data) => api.post('/api/customers', data),
  updateCustomer: (id, data) => api.put(`/api/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/api/customers/${id}`),
  getCustomerStats: () => api.get('/api/customers/stats'),
};

export const policyService = {
  getPolicies: (params) => api.get('/api/policies', { params }),
  getPolicy: (id) => api.get(`/api/policies/${id}`),
  createPolicy: (data) => api.post('/api/policies', data),
  updatePolicy: (id, data) => api.put(`/api/policies/${id}`, data),
  deletePolicy: (id) => api.delete(`/api/policies/${id}`),
  getPolicyStats: () => api.get('/api/policies/stats'),
};

export const claimService = {
  getClaims: (params) => api.get('/api/claims', { params }),
  getClaim: (id) => api.get(`/api/claims/${id}`),
  createClaim: (data) => api.post('/api/claims', data),
  updateClaim: (id, data) => api.put(`/api/claims/${id}`, data),
  approveClaim: (id, data) => api.put(`/api/claims/${id}/approve`, data),
  rejectClaim: (id, data) => api.put(`/api/claims/${id}/reject`, data),
  getClaimStats: () => api.get('/api/claims/stats'),
};

export const analyticsService = {
  getDashboardAnalytics: () => api.get('/api/analytics/dashboard'),
  getDetailedAnalytics: (params) => api.get('/api/analytics/detailed', { params }),
};

export const chatbotService = {
  sendMessage: (data) => api.post('/api/chatbot/message', data),
};

export const notificationService = {
  getNotifications: (params) => api.get('/api/notifications', { params }),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.put('/api/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
};

export default api;
