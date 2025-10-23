import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import type { User } from '../contexts/authTypes';

export interface UpdateProfileRequest {
  name: string;
  email: string;
  companyName: string;
  preferences: string;
}

export const useProfile = () => {
  const { currentUser, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (profileData: UpdateProfileRequest): Promise<boolean> => {
    if (!currentUser) {
      setError('Usuário não autenticado');
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      const updatedUser: User = await response.json();
      updateUser(updatedUser); // Atualiza no contexto e localStorage
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    if (!currentUser) {
      setError('Usuário não autenticado');
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}/profile-picture`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const updatedUser: User = await response.json();
      updateUser(updatedUser); // Atualiza no contexto e localStorage
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: currentUser,
    isLoading,
    error,
    updateProfile,
    uploadProfilePicture,
    setError,
  };
};