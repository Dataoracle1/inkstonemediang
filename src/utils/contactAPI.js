

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
  
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);


export const contactsAPI = {
 
  submit: (data) => api.post('/contact', data),

  getAll: (params = {}) => api.get('/contact', { params }),
  
  getById: (id) => api.get(`/contact/${id}`),
  
  update: (id, data) => api.put(`/contact/${id}`, data),
  
  delete: (id) => api.delete(`/contact/${id}`),
  
  bulkDelete: (data) => api.post('/contact/bulk-delete', data),
  
  getStats: () => api.get('/contact/stats'),
  
  toggleSpam: (id) => api.put(`/contact/${id}/spam`),
};

export default api;