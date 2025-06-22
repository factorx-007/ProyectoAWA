import axios from 'axios';
import { LoginFormData, RegisterFormData } from '../../types';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const AuthService = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const response = await axios.post<{ accessToken: string; refreshToken: string }>(
      '/api/auth/login',
      credentials
    );
    const { accessToken, refreshToken } = response.data;

    if (!accessToken) {
      throw new Error('Token no recibido');
    }

    const decoded = parseJwt(accessToken);

    return {
      token: accessToken,
      refreshToken,
      user: {
        id: decoded.id?.toString() ?? '',
        email: decoded.email ?? '',
        name: decoded.email?.split('@')[0] ?? ''
      }
    };
  },

  async register(userData: RegisterFormData) {
    const response = await axios.post('/api/usuarios', userData);
    return response.data;
  }
};

// Función para decodificar JWT
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error decoding token:', e);
    return {};
  }
}
