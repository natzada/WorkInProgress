import { useState, useRef, useEffect } from "react";

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [containerHeight, setContainerHeight] = useState("min-h-96");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  useEffect(() => {
    // Define a altura fixa baseada no step 1 durante a transição
    if (step === 1) {
      setContainerHeight("min-h-96");
    } else {
      // Após a transição, ajusta para a altura menor
      const timer = setTimeout(() => {
        setContainerHeight("max-h-74");
      }, 200); // Tempo igual à duração da transição
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="flex justify-center items-center min-h-screen flex-col py-8">
      <h2 className="text-center text-6xl font-bold font-title mb-6">CADASTRE-SE</h2>
      
      {/* Subtítulo condicional para o step 2 */}
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
            className={`flex flex-nowrap transition-transform duration-200 ease-in-out ${step === 1 ? 'translate-x-0' : 'translate-x-[-100%]'}`}
          >
            {/* Step 1 - Formulário completo */}
            <div className="w-full shrink-0 flex flex-col justify-center items-center gap-4">
              <div>
                <label className="block text-lg font-medium text-black/60">
                  Nome completo*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-108 mt-1 bg-placeholder"
                  placeholder=""
                  title="input"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-black/60">
                  Email*
                </label>
                <input
                  type="email"
                  className="p-2 rounded-lg w-108 mt-1 bg-placeholder"
                  placeholder=""
                  title="input"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-black/60">
                  CPF/CNPJ*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-108 mt-1 bg-placeholder"
                  placeholder=""
                  title="input"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-black/60">
                  Senha*
                </label>
                <input
                  type="password"
                  className="p-2 rounded-lg w-108 mt-1 bg-placeholder"
                  placeholder=""
                  title="input"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-black/60">
                  Confirme a senha*
                </label>
                <input
                  type="password"
                  className="p-2 rounded-lg w-108 mt-1 bg-placeholder"
                  placeholder=""
                  title="input"
                />
              </div>
              <button
                onClick={handleNext}
                className="bg-black text-container font-bold font-title p-2 rounded-lg mt-4 hover:bg-gray-800"
              >
                PRÓXIMO
              </button>
            </div>
            
            {/* Step 2 - Formulário reduzido */}
            <div className="w-full h-64 shrink-0 flex flex-col justify-center items-center gap-4">
              <div>
                <label className="block text-lg font-medium text-black/60">
                  Nome da empresa*
                </label>
                <input
                  type="text"
                  className="p-2 rounded-lg w-108 mt-1 bg-placeholder"
                  placeholder=""
                  title="input"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-black/60">
                  Data de criação*
                </label>
                <input
                  type="date"
                  className="p-2 rounded-lg w-108 mt-1 bg-placeholder"
                  placeholder=""
                  title="input"
                />
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="bg-black text-container w-28 font-bold font-title p-2 rounded-xl hover:bg-gray-600"
                >
                  VOLTAR
                </button>
                <button
                  onClick={() => alert("Cadastro concluído!")}
                  className="bg-black text-container font-bold font-title p-2 rounded-xl hover:bg-gray-800 w-28"
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