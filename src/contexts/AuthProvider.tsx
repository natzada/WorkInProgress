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

 const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      // Garante que o email esteja incluído
      const user = {
        ...userData,
        email: userData.email || email // Usa o email da resposta ou o email do login
      };
      console.log('User with email:', user);
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      return { success: true };
    } else {
      const error = await response.text();
      return { 
        success: false, 
        error: error || 'Erro no login' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
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
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};