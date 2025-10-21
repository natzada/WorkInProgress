import { apiConfig } from './api';

export interface Product {
  id: number;
  name: string;
  quantity: number;
  expirationDate: string;
  userId: number;
}

export const productService = {
  async getProductsByUser(userId: number): Promise<Product[]> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/products/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/products`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },

  async getAlerts(userId: number): Promise<Product[]> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/products/alerts/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }
};