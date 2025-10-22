// src/components/Stock.tsx
import React, { useState, useEffect, useCallback } from "react";
import { productService, type Product } from "../services/productService";
import LoadingPage from "./LoadingPage";
import { useLoadingDelay } from "../hooks/useLoadingDelay";

const Stock: React.FC = () => {
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

  const userId = 1;

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
      
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoadingDelay) {
      loadProducts();
    }
  }, [isLoadingDelay, loadProducts]);

  // 🔥 ADICIONE TODAS ESTAS FUNÇÕES QUE ESTAVAM FALTANDO:

  const handleAdd = async (id: number) => {
    setLoadingButtons(prev => ({ ...prev, [id]: true }));
    
    try {
      const newQuantity = (quantities[id] || 0) + 1;
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }));

      const product = products.find((p) => p.id === id);
      if (product) {
        await productService.createProduct({
          ...product,
          quantity: newQuantity,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setQuantities((prev) => ({ ...prev, [id]: quantities[id] }));
    } finally {
      setLoadingButtons(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingButtons(prev => ({ ...prev, [id]: true }));
    
    try {
      const newQuantity = Math.max((quantities[id] || 0) - 1, 0);
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }));

      const product = products.find((p) => p.id === id);
      if (product) {
        await productService.createProduct({
          ...product,
          quantity: newQuantity,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setQuantities((prev) => ({ ...prev, [id]: quantities[id] }));
    } finally {
      setLoadingButtons(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAddItem = () => {
    setShowForm(true);
    setNewProduct({
      name: "",
      quantity: 0,
      expirationDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setNewProduct({ name: "", quantity: 0, expirationDate: "" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!newProduct.name.trim()) {
      alert("Por favor, insira um nome para o produto");
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
      const createdProduct = await productService.createProduct(productToCreate);
      if (createdProduct) {
        setProducts((prev) => [...prev, createdProduct]);
        setQuantities((prev) => ({
          ...prev,
          [createdProduct.id]: newProduct.quantity,
        }));
        setShowForm(false);
        setNewProduct({ name: "", quantity: 0, expirationDate: "" });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Erro ao criar produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDelay) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-20">
      <div className="bg-placeholder p-5 rounded-lg font-sans w-300">
        <div className="pb-5 border-b-6 border-division flex justify-between items-center">
          <h1 className="text-black font-extrabold text-5xl text-left mb-2">
            <span className="mr-5"></span>Gerenciamento de estoque
          </h1>
          <button
            onClick={handleAddItem}
            className="px-4.5 py-2 mr-4 text-center text-white text-3xl font-bold bg-division rounded-full hover:bg-division/70 transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Formulário de Novo Produto */}
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
                  className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Ex.: Arroz, Feijão, etc."
                  value={newProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-black/60 mb-2">
                  Quantidade Inicial*
                </label>
                <input
                  type="number"
                  min="0"
                  className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", parseInt(e.target.value) || 0)
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-black/60 mb-2">
                  Data de Validade
                </label>
                <input
                  type="date"
                  className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
                  value={newProduct.expirationDate}
                  onChange={(e) =>
                    handleInputChange("expirationDate", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleFormCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-black font-bold bg-white rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white font-bold bg-black rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adicionando...
                    </>
                  ) : (
                    "Adicionar Produto"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Lista de Produtos */}
        <ul>
          {products.map((product, index) => {
            const isLoadingButton = loadingButtons[product.id];
            
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
                    className="px-2.5 py-1 text-white font-bold bg-division rounded-full hover:bg-division/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-8 h-8 flex items-center justify-center"
                  >
                    {isLoadingButton ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "+"
                    )}
                  </button>
                  <span className="px-2 py-1 font-semibold min-w-8 text-center">
                    {quantities[product.id] || 0}
                  </span>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={isLoadingButton || (quantities[product.id] || 0) <= 0}
                    className="px-2.5 py-1 text-white font-bold bg-division rounded-full hover:bg-division/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-8 h-8 flex items-center justify-center"
                  >
                    {isLoadingButton ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "-"
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        
        {products.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-600">
            Nenhum produto cadastrado. Clique no botão "+" para adicionar.
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;