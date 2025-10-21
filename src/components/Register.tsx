// src/components/Register.tsx
import { useState, useRef, useEffect } from "react";
import { authService, type RegisterRequest } from "../services/authService";

interface RegisterProps {
  onLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [containerHeight, setContainerHeight] = useState("min-h-96");
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    nomeEmpresa: "",
    dataCriacao: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmarSenha: "",
  });
  const [showPassword, setShowPassword] = useState({
    senha: false,
    confirmarSenha: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isStep1Valid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      errors.password === "" &&
      errors.confirmarSenha === ""
    );
  };

  const isStep2Valid = () => {
    return (
      formData.nomeEmpresa.trim() !== "" && formData.dataCriacao.trim() !== ""
    );
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid() && step < 2) {
      setStep(step + 1);
    }
  };

  const togglePasswordVisibility = (field: "senha" | "confirmarSenha") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validação de senha
    if (field === "password") {
      if (value.length > 0 && value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Senha deve ter pelo menos 6 caracteres",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
      // Atualiza validação de confirmação
      if (confirmPassword && value !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmarSenha: "Senhas não coincidem",
        }));
      } else if (confirmPassword && value === confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmarSenha: "" }));
      }
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && value !== formData.password) {
      setErrors((prev) => ({
        ...prev,
        confirmarSenha: "Senhas não coincidem",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmarSenha: "" }));
    }
  };

  const handleFinalizar = async () => {
    if (isStep2Valid()) {
      setIsLoading(true);
      try {
        const success = await authService.register(formData);
        if (success) {
          alert("Cadastro concluído com sucesso!");
          onLogin();
        } else {
          alert("Erro ao realizar cadastro. Tente novamente.");
        }
      } catch (error) {
        alert("Erro ao realizar cadastro.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (step === 1) {
      setContainerHeight("min-h-96");
    } else {
      const timer = setTimeout(() => {
        setContainerHeight("max-h-74");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="flex justify-center items-center min-h-screen flex-col py-8">
      <h2 className="text-center text-6xl font-bold font-title mb-6">
        CADASTRE-SE
      </h2>

      {step === 2 && (
        <h2 className="text-center text-xl font-bold mb-6">
          Para finalizar seu cadastro
        </h2>
      )}

      <div
        ref={containerRef}
        className={`bg-container p-6 rounded-3xl shadow-md w-120 transition-all duration-200 ease-in-out ${containerHeight}`}
      >
        <div className="relative overflow-hidden w-full h-full">
          <div
            className={`flex flex-nowrap transition-transform duration-200 ease-in-out ${
              step === 1 ? "translate-x-0" : "translate-x-[-100%]"
            }`}
          >
            {/* Step 1 */}
            <div className="w-full shrink-0 flex flex-col justify-center items-center gap-4">
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Nome completo*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-full mt-1 bg-placeholder"
                  placeholder="Ex.: João Silva"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
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
                    type={showPassword.senha ? "text" : "password"}
                    className="p-2 rounded-lg w-full mt-1 bg-placeholder pr-10"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility("senha")}
                  >
                    {showPassword.senha ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="w-108 relative">
                <label className="block text-lg font-medium text-black/60">
                  Confirme a senha*
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirmarSenha ? "text" : "password"}
                    className="p-2 rounded-lg w-full mt-1 bg-placeholder pr-10"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility("confirmarSenha")}
                  >
                    {showPassword.confirmarSenha ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmarSenha}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep1Valid()}
                className={`bg-black text-container font-bold font-title p-2 rounded-lg mt-4 cursor-pointer ${
                  !isStep1Valid()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                PRÓXIMO
              </button>
            </div>

            {/* Step 2 */}
            <div className="w-full h-64 shrink-0 flex flex-col justify-center items-center gap-4">
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Nome da empresa*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-full mt-1 bg-placeholder"
                  placeholder="Ex.: Work In Progress"
                  value={formData.nomeEmpresa}
                  onChange={(e) =>
                    handleInputChange("nomeEmpresa", e.target.value)
                  }
                  required
                />
              </div>
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Data de criação*
                </label>
                <input
                  type="date"
                  className="p-2 rounded-lg w-full mt-1 bg-placeholder"
                  value={formData.dataCriacao}
                  onChange={(e) =>
                    handleInputChange("dataCriacao", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="bg-black text-container w-28 font-bold font-title p-2 rounded-xl hover:bg-gray-600 cursor-pointer"
                >
                  VOLTAR
                </button>
                <button
                  type="button"
                  onClick={handleFinalizar}
                  disabled={!isStep2Valid() || isLoading}
                  className={`bg-black text-container font-bold font-title p-2 rounded-xl w-28 cursor-pointer ${
                    !isStep2Valid() || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "..." : "FINALIZAR"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;