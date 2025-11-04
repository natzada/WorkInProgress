import React, { useState } from 'react';
import { type FAQItem } from '../services/faqService';

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question: "Como posso criar uma conta?",
      answer: "Para criar uma conta, clique no botão 'Registrar' no canto superior direito, preencha seus dados e confirme seu email.",
      isOpen: false
    },
    {
      id: 2,
      question: "Esqueci minha senha, o que fazer?",
      answer: "Clique em 'Esqueci minha senha' na página de login e siga as instruções para redefinir sua senha por email.",
      isOpen: false
    },
    {
      id: 3,
      question: "Quais são os métodos de pagamento aceitos?",
      answer: "Aceitamos cartão de crédito, débito, PIX e boleto bancário.",
      isOpen: false
    },
    {
      id: 4,
      question: "Como cancelar minha assinatura?",
      answer: "Acesse 'Configurações da Conta' > 'Assinatura' e clique em 'Cancelar Assinatura'.",
      isOpen: false
    },
    {
      id: 5,
      question: "O suporte está disponível 24/7?",
      answer: "Sim, nosso suporte está disponível 24 horas por dia, 7 dias por semana via chat e email.",
      isOpen: false
    }
  ]);

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id 
        ? { ...faq, isOpen: !faq.isOpen }
        : { ...faq, isOpen: false }
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Perguntas Frequentes
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre nosso serviço
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
            >
              <span className="text-lg font-semibold text-gray-800 pr-4">
                {faq.question}
              </span>
              <svg
                className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                  faq.isOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {/* Answer */}
            <div
              className={`px-6 pb-4 transition-all duration-300 ease-in-out ${
                faq.isOpen 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-12 text-center p-8 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Não encontrou o que procura?
        </h2>
        <p className="text-gray-600 mb-4">
          Nossa equipe de suporte está pronta para ajudar você
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Entrar em Contato
        </button>
      </div>
    </div>
  );
};

export default FAQ;