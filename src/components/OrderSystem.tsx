// components/OrderSystem.tsx
import React, { useState } from 'react';
import OrderForm from './OrderForm';
import SupplierList from './SupplierList';
import Orders from './Orders';

const OrderSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers' | 'myOrders'>('orders');

  return (
    <div className="min-h-screen py-8 ml-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sistema de Pedidos
          </h1>
          <p className="text-gray-600">
            Faça pedidos para seus fornecedores cadastrados
          </p>
        </div>
        
        <nav className="flex justify-center space-x-4 mb-8">
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
              activeTab === 'orders' 
                ? 'bg-black text-white shadow-md' 
                : 'bg-white text-black border border-black hover:bg-black/20'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Fazer Pedido
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
              activeTab === 'suppliers' 
                ? 'bg-black text-white shadow-md' 
                : 'bg-white text-black border border-black hover:bg-black/20'
            }`}
            onClick={() => setActiveTab('suppliers')}
          >
            Ver Fornecedores
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
              activeTab === 'myOrders' 
                ? 'bg-black text-white shadow-md' 
                : 'bg-white text-black border border-black hover:bg-black/20'
            }`}
            onClick={() => setActiveTab('myOrders')}
          >
            Meus Pedidos
          </button>
        </nav>

        <div className="bg-white rounded-lg shadow-lg">
          {activeTab === 'orders' && <OrderForm />}
          {activeTab === 'suppliers' && <SupplierList />}
          {activeTab === 'myOrders' && <Orders />}
        </div>
      </div>
    </div>
  );
};

export default OrderSystem;