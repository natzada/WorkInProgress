import { apiConfig } from './api';

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  supplierId: number;
  userId: number;
  orderDate: string;
}

export const orderService = {
  async createOrder(order: Omit<Order, 'id'>): Promise<Order | null> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/orders`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
};