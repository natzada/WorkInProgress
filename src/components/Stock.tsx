import React, { useState, useEffect, useCallback } from "react";
import { productService, type Product } from "../services/productService";
import LoadingPage from "./LoadingPage";
import { useLoadingDelay } from "../hooks/useLoadingDelay";
import { useAuth } from "../contexts/useAuth";

const Stock: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const isLoadingDelay = useLoadingDelay(1000);

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    expirationDate: "",
  });

  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);

  const userId = currentUser?.id || 1;

  const loadProducts = useCallback(async () => {
    try {
      const userProducts = await productService.getProductsByUser(userId);

      const sortedProducts = userProducts.sort((a, b) => a.id - b.id);
      setProducts(sortedProducts);

      const initialQuantities: { [key: number]: number } = {};
      sortedProducts.forEach(product => {
        initialQuantities[product.id] = product.quantity;
      });
      setQuantities(initialQuantities);

      const low = sortedProducts.filter(p => p.quantity <= 2);
      setLowStockProducts(low);

      // 🆕 ALERTA DE VALIDADE
      const expiring = sortedProducts.filter(p => {
        if (!p.expirationDate) return false;

        const today = new Date();
        const expDate = new Date(p.expirationDate);
        const diffMs = expDate.getTime() - today.getTime();

        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return diffDays <= 3; // vence em até 3 dias ou já venceu
      });

      setExpiringProducts(expiring);

    } catch (error) {
      console.error("Error loading products:", error);
      setError("Erro ao carregar produtos. Verifique sua conexão.");
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoadingDelay && isAuthenticated) {
      loadProducts();
    }
  }, [isLoadingDelay, loadProducts, isAuthenticated]);

  const handleAdd = async (id: number) => {
    setLoadingButtons(prev => ({ ...prev, [id]: true }));
    
    try {
      const newQuantity = (quantities[id] || 0) + 1;
      setQuantities(prev => ({ ...prev, [id]: newQuantity }));

      const product = products.find(p => p.id === id);

      if (product) {
        await productService.createProduct({
          ...product,
          quantity: newQuantity,
        });

        await loadProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Erro ao atualizar produto");

      setQuantities(prev => ({ ...prev, [id]: quantities[id] }));
    } finally {
      setLoadingButtons(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingButtons(prev => ({ ...prev, [id]: true }));
    
    try {
      const newQuantity = Math.max((quantities[id] || 0) - 1, 0);
      setQuantities(prev => ({ ...prev, [id]: newQuantity }));

      const product = products.find(p => p.id === id);

      if (product) {
        await productService.createProduct({
          ...product,
          quantity: newQuantity,
        });

        await loadProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Erro ao atualizar produto");

      setQuantities(prev => ({ ...prev, [id]: quantities[id] }));
    } finally {
      setLoadingButtons(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAddItem = () => {
    if (!isAuthenticated) {
      setError("Faça login para adicionar produtos");
      return;
    }

    setShowForm(true);
    setNewProduct({
      name: "",
      quantity: 0,
      expirationDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setNewProduct({ name: "", quantity: 0, expirationDate: "" });
    setError("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!newProduct.name.trim()) {
      setError("Por favor, insira um nome para o produto");
      setIsSubmitting(false);
      return;
    }

    const productToCreate: Omit<Product, "id"> = {
      name: newProduct.name,
      quantity: newProduct.quantity,
      expirationDate: newProduct.expirationDate,
      userId: userId,
    };

    try {
      await productService.createProduct(productToCreate);

      setShowForm(false);
      setNewProduct({ name: "", quantity: 0, expirationDate: "" });

      await loadProducts();
    } catch (error) {
      setError("Erro ao criar produto. Verifique sua conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center p-20">
        <div className="bg-placeholder p-8 rounded-lg font-sans w-300 text-center">
          <h1 className="text-black font-extrabold text-5xl mb-6">
            🔒 Acesso Restrito
          </h1>
          <p className="text-gray-700 text-2xl mb-4">
            Faça login para acessar o estoque.
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingDelay) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-20">
      <div className="bg-placeholder p-5 rounded-lg font-sans w-300">

        {/* HEADER */}
        <div className="pb-5 border-b-6 border-division flex justify-between items-center">
          <h1 className="text-black font-extrabold text-5xl mb-2">
            Gerenciamento de estoque
          </h1>

          <button
            onClick={handleAddItem}
            className="px-4.5 py-2 mr-4 text-white text-3xl font-bold bg-division rounded-full hover:bg-division/70 transition-colors"
          >
            +
          </button>
        </div>

        {/* ERROS */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* ALERTA ESTOQUE BAIXO */}
        {lowStockProducts.length > 0 && (
          <div className="mt-5 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 font-semibold text-lg">
              ⚠️ Atenção! {lowStockProducts.length} produto(s) estão com estoque baixo:
            </p>

            <ul className="mt-2 ml-4 text-yellow-800">
              {lowStockProducts.map(item => (
                <li key={item.id}>
                  • {item.name} — <strong>{item.quantity}</strong> unidade(s)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ALERTA VALIDADE */}
        {expiringProducts.length > 0 && (
          <div className="mt-5 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800 font-semibold text-lg">
              ⏰ Produtos próximos da validade ou vencidos:
            </p>

            <ul className="mt-2 ml-4 text-red-800">
              {expiringProducts.map(item => (
                <li key={item.id}>
                  • {item.name} — vence em{" "}
                  <strong>
                    {new Date(item.expirationDate).toLocaleDateString("pt-BR")}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FORM NOVO PRODUTO */}
        {showForm && (
          <div className="bg-container p-6 mt-5 rounded-lg shadow-lg mb-6 border-2 border-division">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Adicionar Novo Produto
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-black/60 mb-2">
                  Nome do Produto*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-full bg-placeholder border"
                  placeholder="Ex.: Arroz, Feijão..."
                  value={newProduct.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-black/60 mb-2">
                  Quantidade Inicial*
                </label>
                <input
                  type="number"
                  min="0"
                  className="p-2 rounded-lg w-full bg-placeholder border"
                  value={newProduct.quantity}
                  onChange={e =>
                    handleInputChange("quantity", parseInt(e.target.value) || 0)
                  }
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-black/60 mb-2">
                  Data de Validade
                </label>
                <input
                  type="date"
                  className="p-2 rounded-lg w-full bg-placeholder border"
                  value={newProduct.expirationDate}
                  onChange={e =>
                    handleInputChange("expirationDate", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleFormCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-black font-bold bg-white rounded-lg border"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white font-bold bg-black rounded-lg"
                >
                  {isSubmitting ? "Adicionando..." : "Adicionar Produto"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTA DE PRODUTOS */}
        <ul>
          {products.map((product, index) => {
            const isLoadingButton = loadingButtons[product.id];
            const currentQuantity = quantities[product.id] ?? 0;

            return (
              <li
                key={product.id}
                className="flex justify-between items-center py-5 border-b-6 border-division hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-gray-800 font-semibold">
                    {index + 1}. {product.name}
                  </span>

                  {product.expirationDate && (
                    <span className="text-sm text-gray-600">
                      Validade:{" "}
                      {new Date(product.expirationDate).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAdd(product.id)}
                    disabled={isLoadingButton}
                    className="px-2.5 py-1 text-white font-bold bg-division rounded-full"
                  >
                    {isLoadingButton ? "..." : "+"}
                  </button>

                  <span className="px-2 py-1 font-semibold min-w-8 text-center">
                    {currentQuantity}
                  </span>

                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={isLoadingButton || currentQuantity <= 0}
                    className="px-2.5 py-1 text-white font-bold bg-division rounded-full"
                  >
                    {isLoadingButton ? "..." : "-"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {products.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-600">
            <p className="text-xl mb-4">Nenhum produto cadastrado.</p>
            <p className="text-lg">Clique no botão "+" para adicionar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
