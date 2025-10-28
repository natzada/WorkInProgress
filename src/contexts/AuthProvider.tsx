// src/contexts/AuthProvider.tsx
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User, AuthContextType } from './authTypes';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

 const login = async (email: string, password: string) => {
  try {
    console.log('🔄 Tentando login para:', email);
    
    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Status da resposta:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('🎯 RESPOSTA COMPLETA:', responseData);
      
      // VERIFICAÇÃO CRÍTICA
      if (!responseData.id) {
        console.error('🚨 ERRO CRÍTICO: ID não veio do backend!');
        console.error('Estrutura recebida:', Object.keys(responseData));
        return { 
          success: false, 
          error: 'ID não recebido do servidor. Estrutura: ' + JSON.stringify(responseData) 
        };
      }

      const user = {
        id: responseData.id,
        name: responseData.name || '',
        email: responseData.email || email,
        companyName: responseData.companyName || '',
        creationDate: responseData.creationDate || '',
        profilePicturePath: responseData.profilePicturePath || '',
        preferences: responseData.preferences || '',
        token: responseData.token || 'mock-token'
      };
      
      console.log('✅ USUÁRIO CRIADO COM SUCESSO! ID:', user.id);
      
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      return { success: true };
    } else {
      const error = await response.text();
      console.error('❌ Login falhou:', error);
      return { 
        success: false, 
        error: error || 'Erro no login' 
      };
    }
  } catch (error) {
    console.error('💥 Erro de conexão:', error);
    return { 
      success: false, 
      error: 'Erro de conexão' 
    };
  }
};

  const register = async (
    name: string, 
    email: string, 
    password: string,
    verificationCode: string,
    nomeEmpresa: string,
    dataCriacao: string
  ) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          verificationCode,
          nomeEmpresa,
          dataCriacao
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        return { success: true };
      } else {
        const error = await response.text();
        return { 
          success: false, 
          error: error || 'Erro no registro' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: 'Erro de conexão' 
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};