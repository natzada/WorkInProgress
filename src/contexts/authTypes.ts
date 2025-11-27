export interface User {
  id: number;
  name: string;
  email: string;
  companyName?: string;
  creationDate?: string;
  profilePicturePath?: string;
  preferences?: string;
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
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  id?: number;
  userId?: number; 
  name: string;
  email: string;
  nomeEmpresa?: string;
  dataCriacao?: string;
  profilePicturePath?: string;
  preferences?: string;
  token: string;
}