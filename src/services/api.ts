const API_BASE_URL = 'http://localhost:8080/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Serviços para Fornecedores
export const supplierAPI = {
  // Buscar todos os fornecedores
  getAllSuppliers: () => 
    fetch(`${API_BASE_URL}/suppliers`, {
      method: 'GET',
      headers: apiConfig.headers,
    }).then(response => response.json()),
  
  // Cadastrar novo fornecedor
  createSupplier: (supplierData: any) => 
    fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(supplierData),
    }).then(response => response.json()),
};

// Serviços para Pedidos
export const orderAPI = {
  // Criar novo pedido
  createOrder: (orderData: any) => 
    fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(orderData),
    }).then(response => response.json()),
  
  // Buscar pedidos (se necessário)
  getOrders: () => 
    fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: apiConfig.headers,
    }).then(response => response.json()),
};

// Serviços para Produtos (assumindo que você tem)
export const productAPI = {
  // Buscar produtos
  getProducts: () => 
    fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: apiConfig.headers,
    }).then(response => response.json()),
  
  // Criar produto (se necessário)
  createProduct: (productData: any) => 
    fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(productData),
    }).then(response => response.json()),
};