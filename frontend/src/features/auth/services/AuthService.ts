import axios from 'axios';
import { LoginFormData, RegisterFormData } from '../../types';

export const authService = {
  login: async (credentials: LoginFormData) => {
    const response = await axios.post('/api/usuarios/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterFormData) => {
    const response = await axios.post('/api/usuarios', userData);
    return response.data;
  }
};

export type { LoginFormData, RegisterFormData };
