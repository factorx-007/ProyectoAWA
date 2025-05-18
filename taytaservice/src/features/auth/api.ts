// lib/api.ts
import axios from 'axios';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: '/api'
});

// Variable para almacenar la función de logout
let handleLogout: (() => Promise<void>) | null = null;

// Función para registrar el logout
export const registerLogoutHandler = (logoutFn: () => Promise<void>) => {
  handleLogout = logoutFn;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;