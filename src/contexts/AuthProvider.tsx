// src/contexts/AuthProvider.tsx - VERSÃO COMPLETA ATUALIZADA
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User, AuthContextType } from './authTypes';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log('🔍 Carregando usuário do localStorage:', user);
    
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('✅ Usuário carregado:', parsedUser);
        console.log('👤 Nome do usuário carregado:', parsedUser.username);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('❌ Erro ao parsear usuário do localStorage:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('ℹ️ Nenhum usuário no localStorage');
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedUser: User) => {
    console.log('🔄 AuthProvider - Atualizando usuário no contexto');
    console.log('📥 Dados recebidos:', updatedUser);
    console.log('👤 Nome no update:', updatedUser.username);
    
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Verificar se salvou corretamente
    const stored = localStorage.getItem('user');
    console.log('💾 Usuário salvo no localStorage:', stored);
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
        
        if (!responseData.id) {
          console.error('🚨 ERRO CRÍTICO: ID não veio do backend!');
          return { 
            success: false, 
            error: 'ID não recebido do servidor' 
          };
        }

        const user = {
          id: responseData.id,
          username: responseData.name || '',
          email: responseData.email || email,
          companyName: responseData.companyName || '',
          creationDate: responseData.creationDate || '',
          profilePicturePath: responseData.profilePicturePath || '',
          preferences: responseData.preferences || '',
          token: responseData.token || 'mock-token'
        };
        
        console.log('✅ USUÁRIO CRIADO COM SUCESSO! ID:', user.id);
        console.log('👤 Nome do usuário no login:', user.username);
        
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
      console.log('👤 Tentando registro para:', email);
      
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
          companyName: nomeEmpresa, // ← CORREÇÃO AQUI
          dataCriacao
        }),
      });

      console.log('📡 Status do registro:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('🎯 RESPOSTA COMPLETA DO REGISTRO:', responseData);
        
        if (!responseData.id) {
          console.error('🚨 ERRO CRÍTICO: ID não veio do backend no registro!');
          return { 
            success: false, 
            error: 'ID não recebido do servidor no registro' 
          };
        }

        const user = {
          id: responseData.id,
          username: responseData.name || name,
          email: responseData.email || email,
          companyName: responseData.companyName || nomeEmpresa,
          creationDate: responseData.creationDate || dataCriacao,
          profilePicturePath: responseData.profilePicturePath || '',
          preferences: responseData.preferences || '{}',
          token: responseData.token || 'mock-token'
        };
        
        console.log('✅ USUÁRIO REGISTRADO COM SUCESSO! ID:', user.id);
        console.log('👤 Nome do usuário registrado:', user.username);
        
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        return { success: true };
      } else {
        const error = await response.text();
        console.error('❌ Registro falhou:', error);
        return { 
          success: false, 
          error: error || 'Erro no registro' 
        };
      }
    } catch (error) {
      console.error('💥 Erro de conexão no registro:', error);
      return { 
        success: false, 
        error: 'Erro de conexão' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
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

  console.log('🔧 AuthProvider - Estado atual:');
  console.log('   - currentUser:', currentUser);
  console.log('   - isAuthenticated:', !!currentUser);
  console.log('   - user name:', currentUser?.username);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};