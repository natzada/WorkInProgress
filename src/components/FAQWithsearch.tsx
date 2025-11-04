import React, { useState, useMemo } from 'react';
import { type FAQItem } from '../services/faqService';

const FAQWithSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'account', name: 'Conta' },
    { id: 'billing', name: 'Pagamento' },
    { id: 'technical', name: 'Técnico' },
    { id: 'general', name: 'Geral' }
  ];

  const allFaqs: (FAQItem & { category: string })[] = [
    {
      id: 1,
      question: "Como criar uma conta?",
      answer: "Clique em 'Registrar', preencha seus dados e confirme seu email.",
      category: 'account',
      isOpen: false
    },
    {
      id: 2,
      question: "Esqueci minha senha",
      answer: "Use a opção 'Esqueci senha' na página de login.",
      category: 'account',
      isOpen: false
    },
    {
      id: 3,
      question: "Métodos de pagamento",
      answer: "Aceitamos cartão, PIX e boleto.",
      category: 'billing',
      isOpen: false
    },
    {
      id: 4,
      question: "Problemas técnicos",
      answer: "Verifique sua conexão ou entre em contato com o suporte.",
      category: 'technical',
      isOpen: false
    }
  ];

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const toggleFAQ = (id: number) => {
    allFaqs.forEach(faq => {
      if (faq.id === id) {
        faq.isOpen = !faq.isOpen;
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Central de Ajuda
        </h1>
        <p className="text-lg text-gray-600">
          Encontre respostas rápidas para suas dúvidas
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar perguntas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-lg transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    faq.isOpen ? 'rotate-180' : ''
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
              {faq.isOpen && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              Nenhuma pergunta encontrada. Tente outros termos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQWithSearch;