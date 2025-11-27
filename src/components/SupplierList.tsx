// components/SupplierList.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { supplierService, type Supplier } from '../services/supplierService';

const SupplierList: React.FC = () => {
  const { currentUser } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setLoading(true);
        if (currentUser?.id) {
          const userSuppliers = await supplierService.getSuppliersByUser(currentUser.id);
          setSuppliers(userSuppliers);
        }
        setError('');
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
        setError('Erro ao carregar fornecedores');
      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
        <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 animate-spin mx-auto mb-2"></div>
        <p>Carregando fornecedores...</p>
      </div>
    );
  }

  return (
    <div className="bg-container p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Meus Fornecedores</h2>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{supplier.companyName}</h3>
                <p className="text-gray-600">📧 {supplier.contactEmail}</p>
                {supplier.phone && <p className="text-gray-600">📞 {supplier.phone}</p>}
                {supplier.address && <p className="text-gray-600">📍 {supplier.address}</p>}
                {supplier.products && (
                  <p className="text-gray-600 mt-2">
                    <strong>Produtos:</strong> {supplier.products}
                  </p>
                )}
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Ativo
              </span>
            </div>
          </div>
        ))}
      </div>

      {suppliers.length === 0 && !error && (
        <div className="text-center py-8 text-gray-600">
          <p className="text-lg mb-2">Nenhum fornecedor cadastrado.</p>
          <p>Cadastre fornecedores para fazer pedidos.</p>
        </div>
      )}
    </div>
  );
};

export default SupplierList;