import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // Adicione type-only import
import { authService, type LoginRequest } from '../services/authService'; // Adicione type

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    const success = await authService.login(credentials);
    if (success) {
      setIsLoggedIn(true);
      // Aqui você pode buscar os dados do usuário
      setUser({ id: 1, name: credentials.email.split('@')[0] });
    }
    return success;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};