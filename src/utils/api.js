

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
     
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      if (window.location.pathname.startsWith('/admin') && 
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

const getUserIdentifier = () => {
  let identifier = localStorage.getItem('userIdentifier');
  if (!identifier) {
    identifier = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userIdentifier', identifier);
  }
  return identifier;
};


export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
  checkFirstAdmin: () => api.get('/auth/check-first-admin'),
};

export const postsAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getOne: (id) => api.get(`/posts/${id}`),
  getTrending: (limit = 5) => api.get(`/posts/trending?limit=${limit}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.put(`/posts/${id}/like`, { userIdentifier: getUserIdentifier() }),
  getStats: () => api.get('/posts/stats/dashboard'),
};


export const commentsAPI = {
  getByPost: (postId) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedComments') || '[]');
    return api.get(`/comments/post/${postId}?bookmarks=${JSON.stringify(bookmarks)}`);
  },
  
  create: (data) => {
    return api.post('/comments', {
      ...data,
      userIdentifier: getUserIdentifier()
    });
  },
  
  like: (id) => {
    return api.put(`/comments/${id}/like`, { 
      userIdentifier: getUserIdentifier() 
    });
  },
  
  dislike: (id) => {
    return api.put(`/comments/${id}/dislike`, { 
      userIdentifier: getUserIdentifier() 
    });
  },
  
  delete: (id) => {
  
    return api.delete(`/comments/${id}`, {
      data: { 
        userIdentifier: getUserIdentifier() 
      }
    });
  },
  
  edit: (id, content) => {
    return api.put(`/comments/${id}/edit`, {
      content,
      userIdentifier: getUserIdentifier()
    });
  },
  
  approve: (id, isApproved) => {
    return api.put(`/comments/${id}/approve`, { isApproved });
  },
  
  flag: (id) => {
    return api.put(`/comments/${id}/flag`);
  },
  
  getStats: () => {
    return api.get('/comments/stats');
  },
};


export const adminAPI = {

  getAll: () => api.get('/admin-management/admins'),
  
 
  createAdmin: (data) => api.post('/admin-management/create-admin', data),
  
  
  updateAdmin: (id, data) => api.put(`/admin-management/admins/${id}`, data),
  
  
  deleteAdmin: (id) => api.delete(`/admin-management/admins/${id}`),
  
  generateInvite: (data) => api.post('/admin-management/generate-invite', data),
  
  
  getInviteCodes: () => api.get('/admin-management/invite-codes'),
  
 
  revokeInvite: (id) => api.put(`/admin-management/invite-codes/${id}/revoke`),
};


export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  confirmSubscription: (token) => api.get(`/newsletter/confirm/${token}`),
  unsubscribe: (token) => api.get(`/newsletter/unsubscribe/${token}`),
};

export default api;