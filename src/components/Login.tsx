/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Login.tsx
import { useState } from "react";
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const isFormValid = () => {
    return (
      formData.email.trim() !== "" &&
      formData.password.trim() !== ""
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsLoading(true);
      try {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          alert("Login realizado com sucesso!");
          navigate('/'); // Redireciona para home após login
        } else {
          alert(result.error || "Erro no login. Verifique suas credenciais.");
        }
      } catch (error) {
        alert("Erro ao fazer login.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col py-8">
      <h2 className="text-center text-6xl font-bold font-title mb-1">
        LOGIN
      </h2>

      {/* Subtítulo FORA do container do formulário - igual no Register */}
      <h2 className="text-center text-xl mb-6">
        Bem vindo(a) de volta!
      </h2>

      <div className="bg-container p-6 rounded-3xl shadow-md w-120 min-h-96">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="w-108">
            <label className="block text-lg font-medium text-black/60">
              Email*
            </label>
            <input
              type="email"
              className="p-2 rounded-lg w-full mt-1 bg-placeholder"
              placeholder="Ex.: joao.silva@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="w-108 relative">
            <label className="block text-lg font-medium text-black/60">
              Senha*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="p-2 rounded-lg w-full mt-1 bg-placeholder pr-10"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading}
            className={`bg-black text-container font-bold font-title p-2 rounded-lg mt-4 cursor-pointer w-full ${
              !isFormValid() || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800"
            }`}
          >
            {isLoading ? "..." : "ENTRAR"}
          </button>
        </div>
        <div className="flex justify-center items-center mt-10">
          <p>Ainda não tem uma conta? <a href="/register" className="text-link font-bold">Cadastre-se</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;