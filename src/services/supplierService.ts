import { apiConfig } from './api';

export interface Supplier {
  id: number;
  name: string;
  contactInfo: string;
  apiUrl: string;
}

export const supplierService = {
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/suppliers`);
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  }
};