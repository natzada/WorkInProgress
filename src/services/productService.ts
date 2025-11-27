// src/services/productService.ts

// Definir a interface Product
export interface Product {
  id: number;
  name: string;
  quantity: number;
  expirationDate: string;
  userId: number;
}

// Definir a URL base da API
const API_BASE_URL = 'http://localhost:8080/api';

export const productService = {
  // Buscar produtos por usuário
  getProductsByUser: async (userId: number): Promise<Product[]> => {
    console.log(`🔍 Buscando produtos para usuário ${userId}`);
    const response = await fetch(`${API_BASE_URL}/products/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    
    const products = await response.json();
    console.log(`✅ ${products.length} produtos encontrados`);
    return products;
  },

  // Buscar todos os produtos (se necessário)
  getAllProducts: async (): Promise<Product[]> => {
    console.log('🔍 Buscando todos os produtos');
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    
    const products = await response.json();
    console.log(`✅ ${products.length} produtos encontrados`);
    return products;
  },

  // Criar produto
  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    console.log('📤 Enviando produto para criação:', productData);
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao criar produto:', errorText);
      throw new Error(`Erro ao criar produto: ${errorText}`);
    }
    
    const createdProduct = await response.json();
    console.log('✅ Produto criado:', createdProduct);
    return createdProduct;
  },

  // Atualizar produto
  updateProduct: async (productData: Product): Promise<Product> => {
    console.log(`✏️ Atualizando produto ${productData.id}:`, productData);
    
    const response = await fetch(`${API_BASE_URL}/products/${productData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao atualizar produto:', errorText);
      throw new Error(`Erro ao atualizar produto: ${errorText}`);
    }
    
    const updatedProduct = await response.json();
    console.log('✅ Produto atualizado:', updatedProduct);
    return updatedProduct;
  },

  // Deletar produto
  deleteProduct: async (id: number): Promise<void> => {
    console.log(`🗑️ Deletando produto ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar produto');
    }
    
    console.log('✅ Produto deletado');
  },

  // Buscar produto por ID
  getProductById: async (id: number): Promise<Product | null> => {
    try {
      console.log(`🔍 Buscando produto ID: ${id}`);
      
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const product = await response.json();
      console.log('✅ Produto encontrado:', product);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
};