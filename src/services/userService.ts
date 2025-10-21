// src/services/userService.ts
import { apiConfig } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  preferences: string;
}

export const userService = {
  async getUser(id: number): Promise<User | null> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateUser(user: User): Promise<User | null> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/users/${user.id}`, {
        method: 'PUT',
        headers: apiConfig.headers,
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
};