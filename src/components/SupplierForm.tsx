import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";

const SupplierForm: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    phone: "",
    address: "",
    products: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      console.log("📤 Enviando dados do fornecedor:", formData);
      
      // Substitua pela sua API real
      const response = await fetch('http://localhost:8080/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser?.id
        }),
      });

      if (response.ok) {
        setMessage("✅ Fornecedor cadastrado com sucesso!");
        setFormData({
          companyName: "",
          contactEmail: "",
          phone: "",
          address: "",
          products: ""
        });
      } else {
        const errorText = await response.text();
        setMessage(`❌ Erro ao cadastrar fornecedor: ${errorText}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("❌ Erro de conexão");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center p-20">
        <div className="bg-placeholder p-8 rounded-lg text-center">
          <h1 className="text-black font-extrabold text-5xl mb-6">🔒 Acesso Restrito</h1>
          <p className="text-gray-700 text-2xl">Faça login para cadastrar fornecedores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex justify-center items-center p-5">
      <div className="bg-container w-[40%] p-8 rounded-lg font-sans">
        <h1 className="text-black font-extrabold text-4xl mb-6">
          Cadastrar Fornecedor
        </h1>

        {message && (
          <div className={`p-3 rounded-lg mb-4 ${
            message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-black/60 mb-2">
              Nome da Empresa *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-black/60 mb-2">
              Email de Contato *
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-black/60 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-black/60 mb-2">
              Endereço
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-black/60 mb-2">
              Produtos Fornecidos
            </label>
            <input
              name="products"
              value={formData.products}
              onChange={handleChange}
              className="p-2 rounded-lg w-full bg-placeholder border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white font-bold bg-black rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar Fornecedor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;