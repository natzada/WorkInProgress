// src/components/Stock.tsx
import React, { useState, useEffect } from "react";
import { productService, type Product } from "../services/productService";

const Stock: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simula o ID do usuário logado (você pode obter isso do contexto de autenticação)
  const userId = 1;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const userProducts = await productService.getProductsByUser(userId);
      setProducts(userProducts);
      
      // Inicializa quantidades
      const initialQuantities = userProducts.reduce((acc, product) => ({
        ...acc,
        [product.id]: product.quantity || 0
      }), {});
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (id: number) => {
    const newQuantity = (quantities[id] || 0) + 1;
    setQuantities(prev => ({ ...prev, [id]: newQuantity }));
    
    // Atualiza no backend
    const product = products.find(p => p.id === id);
    if (product) {
      await productService.createProduct({
        ...product,
        quantity: newQuantity
      });
    }
  };

  const handleAddItem = async () => {
    const newProduct: Omit<Product, 'id'> = {
      name: `PRODUTO ${products.length + 1}`,
      quantity: 0,
      expirationDate: new Date().toISOString().split('T')[0],
      userId: userId
    };

    const createdProduct = await productService.createProduct(newProduct);
    if (createdProduct) {
      setProducts(prev => [...prev, createdProduct]);
      setQuantities(prev => ({ ...prev, [createdProduct.id]: 0 }));
    }
  };

  const handleDelete = async (id: number) => {
    const newQuantity = Math.max((quantities[id] || 0) - 1, 0);
    setQuantities(prev => ({ ...prev, [id]: newQuantity }));
    
    // Atualiza no backend
    const product = products.find(p => p.id === id);
    if (product) {
      await productService.createProduct({
        ...product,
        quantity: newQuantity
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-20">
      <div className="bg-placeholder p-5 rounded-lg font-sans w-300">
        <div className="pb-5 border-b-6 border-division flex justify-between">
          <h1 className="text-black font-extrabold text-5xl text-left mb-2">
            <span className="mr-5"></span>Gerenciamento de estoque
          </h1>
          <button
            onClick={handleAddItem}
            className="px-4.5 py-2 mr-4 text-center text-white text-3xl font-bold bg-division rounded-full hover:bg-division/70"
          >
            +
          </button>
        </div>
        <ul>
          {products.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center py-5 border-b-6 border-division"
            >
              <span className="text-gray-800">
                <span className="mr-8"></span>
                {product.id}. {product.name}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleAdd(product.id)}
                  className="px-2.5 py-1 text-white font-bold bg-division rounded-full hover:bg-division/70"
                >
                  +
                </button>
                <span className="px-2 py-1">
                  {quantities[product.id] || 0}
                </span>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-2.5 py-1 text-white font-bold bg-division rounded-full hover:bg-division/70"
                >
                  -
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Stock;