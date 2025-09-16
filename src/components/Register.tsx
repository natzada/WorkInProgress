import { useState, useRef, useEffect } from "react";

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [containerHeight, setContainerHeight] = useState("min-h-96");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpfCnpj: "",
    senha: "",
    confirmarSenha: "",
    nomeEmpresa: "",
    dataCriacao: ""
  });
  const [errors, setErrors] = useState({
    cpfCnpj: "",
    senha: "",
    confirmarSenha: ""
  });
  const [showPassword, setShowPassword] = useState({
    senha: false,
    confirmarSenha: false
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Função para formatar CPF/CNPJ
  const formatarCpfCnpj = (valor: string): string => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length <= 11) {
      // Formata CPF (000.000.000-00)
      return apenasNumeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formata CNPJ (00.000.000/0000-00)
      return apenasNumeros
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  // Validação de CPF/CNPJ
  const validarCpfCnpj = (valor: string): boolean => {
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length === 11) {
      // Validação básica de CPF (pode ser expandida para validação real)
      return true;
    } else if (apenasNumeros.length === 14) {
      // Validação básica de CNPJ (pode ser expandida para validação real)
      return true;
    }
    return false;
  };

  // Verifica se todos os campos do step atual estão preenchidos
  const isStep1Valid = () => {
    return (
      formData.nome.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.cpfCnpj.trim() !== "" &&
      formData.senha.trim() !== "" &&
      formData.confirmarSenha.trim() !== "" &&
      errors.cpfCnpj === "" &&
      errors.confirmarSenha === ""
    );
  };

  const isStep2Valid = () => {
    return (
      formData.nomeEmpresa.trim() !== "" &&
      formData.dataCriacao.trim() !== ""
    );
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid() && step < 2) {
      setStep(step + 1);
    }
  };

  const togglePasswordVisibility = (field: 'senha' | 'confirmarSenha') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    let valorFormatado = value;
    
    // Aplica formatação específica para CPF/CNPJ
    if (field === 'cpfCnpj') {
      valorFormatado = formatarCpfCnpj(value);
      
      // Validação de CPF/CNPJ
      const apenasNumeros = value.replace(/\D/g, '');
      if (apenasNumeros.length > 0 && !validarCpfCnpj(value)) {
        setErrors(prev => ({
          ...prev,
          cpfCnpj: apenasNumeros.length < 11 ? "CPF deve ter 11 dígitos" : 
                   apenasNumeros.length > 11 && apenasNumeros.length < 14 ? "CNPJ deve ter 14 dígitos" : 
                   "Documento inválido"
        }));
      } else {
        setErrors(prev => ({ ...prev, cpfCnpj: "" }));
      }
    }
    
    // Validação de confirmação de senha
    if (field === 'senha' || field === 'confirmarSenha') {
      if (field === 'senha') {
        setFormData(prev => ({ ...prev, senha: value }));
        // Valida senha (mínimo 6 caracteres)
        if (value.length > 0 && value.length < 6) {
          setErrors(prev => ({ ...prev, senha: "Senha deve ter pelo menos 6 caracteres" }));
        } else {
          setErrors(prev => ({ ...prev, senha: "" }));
        }
        // Atualiza validação de confirmação
        if (formData.confirmarSenha && value !== formData.confirmarSenha) {
          setErrors(prev => ({ ...prev, confirmarSenha: "Senhas não coincidem" }));
        } else if (formData.confirmarSenha && value === formData.confirmarSenha) {
          setErrors(prev => ({ ...prev, confirmarSenha: "" }));
        }
      } else if (field === 'confirmarSenha') {
        setFormData(prev => ({ ...prev, confirmarSenha: value }));
        if (value && value !== formData.senha) {
          setErrors(prev => ({ ...prev, confirmarSenha: "Senhas não coincidem" }));
        } else {
          setErrors(prev => ({ ...prev, confirmarSenha: "" }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: valorFormatado
      }));
    }
  };

  const handleFinalizar = () => {
    if (isStep2Valid()) {
      alert("Cadastro concluído!");
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
            {/* Step 1 - Formulário completo */}
            <div className="w-full shrink-0 flex flex-col justify-center items-center gap-4">
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Nome completo*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-full mt-1 bg-placeholder"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  CPF/CNPJ*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-full mt-1 bg-placeholder"
                  value={formData.cpfCnpj}
                  onChange={(e) => handleInputChange("cpfCnpj", e.target.value)}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  maxLength={18}
                  required
                />
                {errors.cpfCnpj && (
                  <p className="text-red-500 text-sm mt-1">{errors.cpfCnpj}</p>
                )}
              </div>
              
              {/* Campo de Senha com botão de mostrar/ocultar */}
              <div className="w-108 relative">
                <label className="block text-lg font-medium text-black/60">
                  Senha*
                </label>
                <div className="relative">
                  <input
                    type={showPassword.senha ? "text" : "password"}
                    className="p-2 rounded-lg w-full mt-1 bg-placeholder pr-10"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('senha')}
                  >
                    {showPassword.senha ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.senha && (
                  <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
                )}
              </div>

              {/* Campo de Confirmar Senha com botão de mostrar/ocultar */}
              <div className="w-108 relative">
                <label className="block text-lg font-medium text-black/60">
                  Confirme a senha*
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirmarSenha ? "text" : "password"}
                    className="p-2 rounded-lg w-full mt-1 bg-placeholder pr-10"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('confirmarSenha')}
                  >
                    {showPassword.confirmarSenha ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>
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

            {/* Step 2 - Formulário reduzido */}
            <div className="w-full h-64 shrink-0 flex flex-col justify-center items-center gap-4">
              <div className="w-108">
                <label className="block text-lg font-medium text-black/60">
                  Nome da empresa*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-full mt-1 bg-placeholder"
                  value={formData.nomeEmpresa}
                  onChange={(e) => handleInputChange("nomeEmpresa", e.target.value)}
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
                  onChange={(e) => handleInputChange("dataCriacao", e.target.value)}
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
                  disabled={!isStep2Valid()}
                  className={`bg-black text-container font-bold font-title p-2 rounded-xl w-28 cursor-pointer ${
                    !isStep2Valid()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  FINALIZAR
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