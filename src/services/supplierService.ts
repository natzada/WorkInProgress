// src/services/supplierService.ts
import { apiConfig } from './api';

export interface Supplier {
  id: number;
  companyName: string;
  contactEmail: string;
  phone: string;
  address: string;
  products: string;
  userId: number;
  createdAt: string;
}

export const supplierService = {
  // Criar novo fornecedor
  async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier | null> {
    try {
      console.log('📤 Enviando fornecedor para criação:', supplierData);
      
      const response = await fetch(`${apiConfig.baseURL}/suppliers`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(supplierData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro ao criar fornecedor:', errorText);
        throw new Error(`Failed to create supplier: ${errorText}`);
      }
      
      const createdSupplier = await response.json();
      console.log('✅ Fornecedor criado:', createdSupplier);
      return createdSupplier;
    } catch (error) {
      console.error('Error creating supplier:', error);
      return null;
    }
  },

  // Buscar fornecedores do usuário
  async getSuppliersByUser(userId: number): Promise<Supplier[]> {
    try {
      console.log(`🔍 Buscando fornecedores para usuário ${userId}`);
      
      const response = await fetch(`${apiConfig.baseURL}/suppliers/user/${userId}`, {
        method: 'GET',
        headers: apiConfig.headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      
      const suppliers = await response.json();
      console.log(`✅ ${suppliers.length} fornecedores encontrados`);
      return suppliers;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  },

  // Buscar todos os fornecedores
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      console.log('🔍 Buscando todos os fornecedores');
      
      const response = await fetch(`${apiConfig.baseURL}/suppliers`, {
        method: 'GET',
        headers: apiConfig.headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      
      const suppliers = await response.json();
      console.log(`✅ ${suppliers.length} fornecedores encontrados`);
      return suppliers;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  },

  // Buscar fornecedor por ID
  async getSupplierById(id: number): Promise<Supplier | null> {
    try {
      console.log(`🔍 Buscando fornecedor ID: ${id}`);
      
      const response = await fetch(`${apiConfig.baseURL}/suppliers/${id}`, {
        method: 'GET',
        headers: apiConfig.headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch supplier');
      }
      
      const supplier = await response.json();
      console.log('✅ Fornecedor encontrado:', supplier);
      return supplier;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      return null;
    }
  }
};