// components/OrderForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { orderService, type CreateOrderRequest } from '../services/orderService';
import { productService, type Product } from '../services/productService';
import { supplierService, type Supplier } from '../services/supplierService';

const OrderForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (currentUser?.id) {
          // Carregar produtos do usuário
          const userProducts = await productService.getProductsByUser(currentUser.id);
          setProducts(userProducts);

          // Carregar fornecedores do usuário
          const userSuppliers = await supplierService.getSuppliersByUser(currentUser.id);
          setSuppliers(userSuppliers);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setMessage('Erro ao carregar produtos e fornecedores');
      }
    };

    loadData();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedSupplier) {
      setMessage('Por favor, selecione um produto e um fornecedor');
      return;
    }

    if (quantity <= 0) {
      setMessage('A quantidade deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const orderData: CreateOrderRequest = {
        productId: selectedProduct.id,
        quantity,
        supplierId: selectedSupplier.id,
        userId: currentUser!.id
      };

      const result = await orderService.createOrder(orderData);

      if (result) {
        setMessage('✅ Pedido criado com sucesso!');
        setQuantity(1);
        setSelectedProduct(null);
        setSelectedSupplier(null);
      } else {
        setMessage('❌ Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      setMessage('❌ Erro ao criar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-container p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Novo Pedido</h2>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seleção de Produto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produto *
          </label>
          <select
            value={selectedProduct?.id || ''}
            onChange={(e) => {
              const product = products.find(p => p.id === Number(e.target.value));
              setSelectedProduct(product || null);
            }}
            className="w-full bg-placeholder p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Estoque: {product.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Fornecedor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fornecedor *
          </label>
          <select
            value={selectedSupplier?.id || ''}
            onChange={(e) => {
              const supplier = suppliers.find(s => s.id === Number(e.target.value));
              setSelectedSupplier(supplier || null);
            }}
            className="w-full p-2 bg-placeholder border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Selecione um fornecedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.companyName} ({supplier.contactEmail})
              </option>
            ))}
          </select>
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade *
          </label>
          <input
            type="number"
            min="1"
            max={selectedProduct?.quantity || 1000}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-2 bg-placeholder border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            required
          />
          {selectedProduct && (
            <p className="text-sm text-gray-500 mt-1">
              Estoque disponível: {selectedProduct.quantity}
            </p>
          )}
        </div>

        {/* Informações do Pedido */}
        {(selectedProduct || selectedSupplier) && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Resumo do Pedido:</h4>
            {selectedProduct && (
              <p className="text-sm text-gray-600">
                <strong>Produto:</strong> {selectedProduct.name}
              </p>
            )}
            {selectedSupplier && (
              <p className="text-sm text-gray-600">
                <strong>Fornecedor:</strong> {selectedSupplier.companyName}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Quantidade:</strong> {quantity}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !selectedProduct || !selectedSupplier}
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-black/80 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Criando Pedido...' : 'Criar Pedido'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;