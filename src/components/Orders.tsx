// components/Orders.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { orderService, type Order } from "../services/orderService";
import { productService, type Product } from "../services/productService";
import { supplierService, type Supplier } from "../services/supplierService";

interface OrderWithDetails extends Order {
  product?: Product;
  supplier?: Supplier;
}

const Orders: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !currentUser?.id) return;

      try {
        console.log("📦 Carregando pedidos para usuário:", currentUser.id);
        setLoading(true);

        const userOrders = await orderService.getOrdersByUser(currentUser.id);

        // No useEffect do Orders.tsx, dentro do map:
        const ordersWithDetails = await Promise.all(
          userOrders.map(async (order) => {
            try {
              const [product, supplier] = await Promise.all([
                productService.getProductById(order.productId),
                supplierService.getSupplierById(order.supplierId),
              ]);

              return {
                ...order,
                product: product || undefined,
                supplier: supplier || undefined,
                // GARANTIR que status nunca seja null/undefined
                status: order.status || "PENDING", // ← CORREÇÃO AQUI
              };
            } catch (error) {
              console.error("Erro ao carregar detalhes do pedido:", error);
              return {
                ...order,
                status: order.status || "PENDING", // ← CORREÇÃO AQUI TAMBÉM
              };
            }
          })
        );
        setOrders(ordersWithDetails);
        setError("");
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        setError("Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, currentUser]);

  const getStatusColor = (status: string | null | undefined): string => {
    // Se status for null/undefined, usar 'PENDING' como padrão
    const statusUpper = (status || "PENDING").toUpperCase();

    switch (statusUpper) {
      case "CONFIRMED":
      case "APPROVED":
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
      case "REJECTED":
      case "CANCELED":
        return "bg-red-100 text-red-800";
      case "DELIVERED":
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800"; // PENDING e outros
    }
  };

  const getStatusText = (status: string | null | undefined): string => {
    // Se status for null/undefined, usar 'PENDING' como padrão
    const statusUpper = (status || "PENDING").toUpperCase();

    switch (statusUpper) {
      case "CONFIRMED":
      case "APPROVED":
        return "Confirmado";
      case "COMPLETED":
        return "Concluído";
      case "CANCELLED":
      case "REJECTED":
      case "CANCELED":
        return "Cancelado";
      case "DELIVERED":
        return "Entregue";
      case "SHIPPED":
        return "Enviado";
      default:
        return "Pendente"; // PENDING e outros
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center p-20">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🔒 Acesso Restrito
          </h1>
          <p className="text-gray-600">Faça login para ver os pedidos.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-20">
        <div className="text-center">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-container p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Meus Pedidos</h2>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">
                  {order.product?.name || `Produto #${order.productId}`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <p className="text-gray-600">
                    <strong>Quantidade:</strong> {order.quantity}
                  </p>
                  <p className="text-gray-600">
                    <strong>Fornecedor:</strong>{" "}
                    {order.supplier?.companyName ||
                      `Fornecedor #${order.supplierId}`}
                  </p>
                  <p className="text-gray-600">
                    <strong>Data:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-gray-600">
                    <strong>ID do Pedido:</strong> #{order.id}
                  </p>
                </div>
                {order.supplier?.contactEmail && (
                  <p className="text-gray-600 mt-1">
                    <strong>Email do Fornecedor:</strong>{" "}
                    {order.supplier.contactEmail}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && !error && (
        <div className="text-center py-8 text-gray-600">
          <p className="text-lg mb-4">Nenhum pedido encontrado.</p>
          <p className="text-lg">
            Os pedidos aparecerão aqui quando forem criados.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
