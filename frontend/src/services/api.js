import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      console.error(`Server Error (${error.response.status}):`, message);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error: No response received from server');
    } else {
      // Something else happened
      console.error('Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Lead management APIs
export const leadAPI = {
  submit: (data) => api.post('/api/leads/submit', data),
  getAll: () => api.get('/api/leads/all'),
};

// EMI calculation APIs
export const emiAPI = {
  calculate: (data) => api.post('/api/emi/calculate', data),
  getHistory: () => api.get('/api/emi/history'),
};

// Eligibility assessment APIs
export const eligibilityAPI = {
  assess: (data) => api.post('/api/eligibility/assess', data),
  getHistory: () => api.get('/api/eligibility/history'),
};

// Newsletter APIs
export const newsletterAPI = {
  subscribe: (email) => api.post('/api/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/api/newsletter/unsubscribe', { email }),
  getSubscribers: () => api.get('/api/newsletter/subscribers'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;