// src/services/orderService.ts
import { apiConfig } from './api';

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  supplierId: number;
  userId: number;
  orderDate: string;
  status?: string;
}

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  supplierId: number;
  userId: number;
  // orderDate será definida no backend ou automaticamente
}

export const orderService = {
  async createOrder(order: CreateOrderRequest): Promise<Order | null> {
    try {
      console.log('📤 Enviando pedido para criação:', order);
      
      // Adicionar a data atual automaticamente
      const orderWithDate = {
        ...order,
        orderDate: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
      };
      
      const response = await fetch(`${apiConfig.baseURL}/orders`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(orderWithDate),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro ao criar pedido:', errorText);
        throw new Error(`Failed to create order: ${errorText}`);
      }
      
      const createdOrder = await response.json();
      console.log('✅ Pedido criado:', createdOrder);
      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  // Buscar pedidos do usuário
  async getOrdersByUser(userId: number): Promise<Order[]> {
    try {
      console.log(`🔍 Buscando pedidos para usuário ${userId}`);
      
      const response = await fetch(`${apiConfig.baseURL}/orders/user/${userId}`, {
        method: 'GET',
        headers: apiConfig.headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const orders = await response.json();
      console.log(`✅ ${orders.length} pedidos encontrados`);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Buscar todos os pedidos
  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('🔍 Buscando todos os pedidos');
      
      const response = await fetch(`${apiConfig.baseURL}/orders`, {
        method: 'GET',
        headers: apiConfig.headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const orders = await response.json();
      console.log(`✅ ${orders.length} pedidos encontrados`);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Buscar pedido por ID
  async getOrderById(id: number): Promise<Order | null> {
    try {
      console.log(`🔍 Buscando pedido ID: ${id}`);
      
      const response = await fetch(`${apiConfig.baseURL}/orders/${id}`, {
        method: 'GET',
        headers: apiConfig.headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      
      const order = await response.json();
      console.log('✅ Pedido encontrado:', order);
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }
};