import { apiConfig } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  nomeEmpresa: string;
  dataCriacao: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<boolean> {
    try {
      // Implementação real da chamada API
      const response = await fetch(`${apiConfig.baseURL}/users/login`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(credentials),
      });
      return response.ok;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  async register(userData: RegisterRequest): Promise<boolean> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/users`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(userData),
      });
      return response.ok;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  async logout(): Promise<void> {
    // Implementar logout se necessário
  }
};