export interface User {
  token: string;
  username: string;
  name?: string;
  email?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string, 
    email: string, 
    password: string,
    verificationCode: string,
    nomeEmpresa: string,
    dataCriacao: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}