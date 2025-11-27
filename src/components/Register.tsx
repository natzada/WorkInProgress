/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    verificationCode: "",
    nomeEmpresa: "",
    dataCriacao: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmarSenha: "",
    verificationCode: "",
  });
  const [showPassword, setShowPassword] = useState({
    senha: false,
    confirmarSenha: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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
    return formData.verificationCode.trim().length === 6;
  };

  const isStep3Valid = () => {
    return (
      formData.nomeEmpresa.trim() !== "" && formData.dataCriacao.trim() !== ""
    );
  };

  // Enviar código de verificação
  const handleSendVerificationCode = async () => {
    if (!formData.email.trim()) {
      alert("Por favor, preencha o email primeiro");
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/send-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Código de verificação enviado para seu email!");
        setStep(2);
      } else {
        alert(data || "Erro ao enviar código de verificação");
      }
    } catch (error) {
      alert("Erro ao enviar código de verificação");
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verificar código
  const handleVerifyCode = async () => {
    if (!isStep2Valid()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            code: formData.verificationCode,
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Código verificado com sucesso!");
        setStep(3);
      } else {
        alert(data || "Código inválido");
      }
    } catch (error) {
      alert("Erro ao verificar código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid()) {
      handleSendVerificationCode();
    }
  };

  const togglePasswordVisibility = (field: "senha" | "confirmarSenha") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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

    // Validação do código de verificação
    if (field === "verificationCode") {
      if (value.length > 0 && value.length !== 6) {
        setErrors((prev) => ({
          ...prev,
          verificationCode: "Código deve ter 6 dígitos",
        }));
      } else {
        setErrors((prev) => ({ ...prev, verificationCode: "" }));
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
    if (isStep3Valid()) {
      setIsLoading(true);
      try {
        const result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.verificationCode,
          formData.nomeEmpresa,
          formData.dataCriacao
        );

        if (result.success) {
          alert("Cadastro concluído com sucesso!");
          navigate("/");
        } else {
          alert(result.error || "Erro ao realizar cadastro. Tente novamente.");
        }
      } catch (error) {
        alert("Erro ao realizar cadastro.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col py-8">
      <h2 className="text-center text-6xl font-bold font-title mb-6">
        CADASTRE-SE
      </h2>

      {/* Subtítulos FORA do container */}
      {step === 2 && (
        <h2 className="text-center text-xl font-bold mb-6">
          Verifique seu email
        </h2>
      )}

      {step === 3 && (
        <h2 className="text-center text-xl font-bold mb-6">
          Para finalizar seu cadastro
        </h2>
      )}

      {/* Container PRINCIPAL - ALTURA FIXA */}
      <div className="bg-container p-6 rounded-3xl shadow-md w-120 min-h-96">
        <div className="relative overflow-hidden w-full h-full">
          <div
            className={`flex flex-nowrap transition-transform duration-300 ease-in-out ${
              step === 1
                ? "translate-x-0"
                : step === 2
                ? "translate-x-[-33.333%]"
                : "translate-x-[-66.666%]"
            }`}
            style={{ width: "300%" }}
          >
            {/* Step 1 - Dados básicos */}
            <div className="w-1/3 shrink-0 flex flex-col justify-center gap-4 px-4">
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Nome completo*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-100 mt-1 bg-placeholder"
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
                  className="p-2 rounded-lg w-100 mt-1 bg-placeholder"
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
                    className="p-2 rounded-lg w-100 mt-1 bg-placeholder pr-10"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility("senha")}
                  >
                    {showPassword.senha ? (
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
                    className="p-2 rounded-lg w-100 mt-1 bg-placeholder pr-10"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility("confirmarSenha")}
                  >
                    {showPassword.confirmarSenha ? (
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
                {errors.confirmarSenha && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmarSenha}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep1Valid() || isSendingCode}
                className={`bg-black text-white font-bold font-title p-2 rounded-lg mt-2 cursor-pointer w-full ${
                  !isStep1Valid() || isSendingCode
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                {isSendingCode ? "ENVIANDO CÓDIGO..." : "PRÓXIMO"}
              </button>
            </div>

            {/* Step 2 - Verificação do email */}
            <div className="w-1/3 shrink-0 flex flex-col justify-center gap-4 px-4">
              <div className="w-108 text-center">
                <p className="text-lg text-black/60 mb-2">
                  Enviamos um código de 6 dígitos para:
                </p>
                <p className="font-semibold text-black mb-4">
                  {formData.email}
                </p>
              </div>

              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Código de verificação*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-100 mt-1 bg-placeholder text-center text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                  value={formData.verificationCode}
                  onChange={(e) =>
                    handleInputChange(
                      "verificationCode",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  required
                />
                {errors.verificationCode && (
                  <p className="text-red-500 text-sm mt-1 text-center">
                    {errors.verificationCode}
                  </p>
                )}
              </div>

              <div className="flex gap-4 w-100 justify-center mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="bg-black text-white w-32 font-bold font-title p-2 rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  VOLTAR
                </button>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!isStep2Valid() || isLoading}
                  className={`bg-black text-white font-bold font-title p-2 rounded-lg w-32 cursor-pointer ${
                    !isStep2Valid() || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "..." : "VERIFICAR"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={isSendingCode}
                className="text-blue-600 hover:text-blue-800 text-sm text-center"
              >
                {isSendingCode ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>

            {/* Step 3 - Dados da empresa */}
            <div className="w-1/3 shrink-0 flex flex-col justify-center gap-4 px-4">
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Nome da empresa*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-100 mt-1 bg-placeholder"
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
                  className="p-2 rounded-lg w-100 mt-1 bg-placeholder"
                  value={formData.dataCriacao}
                  onChange={(e) =>
                    handleInputChange("dataCriacao", e.target.value)
                  }
                  required
                />
              </div>

              <div className="flex gap-4 w-full justify-center mt-2">
                <button
                  onClick={() => setStep(2)}
                  className="bg-black text-white w-32 font-bold font-title p-2 rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  VOLTAR
                </button>
                <button
                  type="button"
                  onClick={handleFinalizar}
                  disabled={!isStep3Valid() || isLoading}
                  className={`bg-black text-white font-bold font-title p-2 rounded-lg w-32 cursor-pointer ${
                    !isStep3Valid() || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "..." : "FINALIZAR"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-5">
            <p>
              Já tem uma conta?{" "}
              <a href="/login" className="text-link font-bold">
                Entrar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
