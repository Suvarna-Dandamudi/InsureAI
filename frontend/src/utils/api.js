import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('insurai_user') || '{}');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),
};

export const policiesAPI = {
  getAll: (params) => api.get('/policies', { params }),
  create: (data) => api.post('/policies', data),
  update: (id, data) => api.put(`/policies/${id}`, data),
  delete: (id) => api.delete(`/policies/${id}`),
};

export const claimsAPI = {
  getAll: (params) => api.get('/claims', { params }),
  create: (data) => api.post('/claims', data),
  update: (id, data) => api.put(`/claims/${id}`, data),
};

export const customersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  create: (data) => api.post('/customers', data),
  getOne: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
};

export const analyticsAPI = {
  get: () => api.get('/analytics'),
};

export const fraudAPI = {
  getAlerts: (params) => api.get('/fraud-alerts', { params }),
  updateAlert: (id, data) => api.put(`/fraud-alerts/${id}`, data),
};

export const riskAPI = {
  getAnalysis: () => api.get('/risk-analysis'),
};

export const chatAPI = {
  send: (message) => api.post('/chat', { message }),
};

export default api;
