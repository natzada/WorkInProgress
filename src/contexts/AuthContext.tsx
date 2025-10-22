import { createContext } from 'react';
import { type AuthContextType } from './authTypes';

// APENAS o contexto - nenhum hook ou provider aqui
export const AuthContext = createContext<AuthContextType | undefined>(undefined);