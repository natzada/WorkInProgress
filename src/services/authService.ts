// src/services/AuthService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface User {
  token: string;
  username: string;
  type: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

class AuthService {
  async login(loginRequest: LoginRequest): Promise<User> {
    try {
      console.log('🔐 Tentando login:', loginRequest);
      const response = await axios.post(`${API_URL}/signin`, loginRequest);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || apiError.message || 'Erro no login');
    }
  }

  async register(registerRequest: RegisterRequest): Promise<{ message: string }> {
    try {
      console.log('👤 Tentando registrar:', registerRequest);
      const response = await axios.post(`${API_URL}/signup`, registerRequest);
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || apiError.message || 'Erro no registro');
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}

export default new AuthService();