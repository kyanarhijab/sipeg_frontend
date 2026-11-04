import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sipeg.ndp-tech.my.id/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY || 'taku_nodp_corp_2026',
  },
});

// Interceptor request: sisipkan Bearer token jika user sudah login
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: handle error 401 (token kadaluarsa)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;