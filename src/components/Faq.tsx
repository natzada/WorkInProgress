import React, { useState } from 'react';
import { type FAQItem } from '../services/faqService';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question: "Posso criar um fornecedor para mais de um produto?",
      answer: "Sim. No entanto, o será necessário realizar mais de um pedido para esse fornecedor, já que, por organização, optamos por separar os pedidos por produto e não por fornecedor.",
      isOpen: false
    },
    {
      id: 2,
      question: "Caso eu expanda o meu negócio e contrate funcionários para cuidar do sistema, seria possível cadastrar mais de um funcionário para gerir a empresa?",
      answer: "No momento não. Por enquanto, é recomendado que crie apenas um acesso (indívidual seu ou que englobe toda a empresa), mas, esta é uma função que pretendemos adicionar ao sistema.",
      isOpen: false
    },
    {
      id: 3,
      question: "O fornecedor também pode enviar emails pelo sistema para alterar o status do pedido?",
      answer: "Ainda não, mas, assim como outras funcionalidades, a intermediação dos fornecedores com os empreendedores a partir do nosso sistema é uma adição futura.",
      isOpen: false
    },
    {
      id: 4,
      question: "O Link do atacadista está disponível na minha localização?",
      answer: "Acreditamos que o ASSAÍ atacadista está disponível para todo o Brasil, mas, recomendamos que consulte no site deles.",
      isOpen: false
    },
    {
      id: 5,
      question: "O suporte está disponível 24/7?",
      answer: "Sim, nosso suporte está disponível 24 horas por dia, 7 dias por semana, via email.",
      isOpen: false
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id 
        ? { ...faq, isOpen: !faq.isOpen }
        : { ...faq, isOpen: false }
    ));
  };

  const handleForm = () => {
    setShowForm(true);
    setSubmitStatus(null);
    // Rolar para o formulário
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simular envio para uma API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você faria a chamada real para sua API
      console.log('Dados do formulário:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Fechar o formulário após 3 segundos
      setTimeout(() => {
        setShowForm(false);
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSubmitStatus(null);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Perguntas Frequentes
        </h1>
        <p className="text-xl text-gray-800 max-w-2xl mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre nosso serviço
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white/20 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
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
      <div className="mt-12 text-center p-8 bg-blue-50/20 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Não encontrou o que procura?
        </h2>
        <p className="text-gray-600 mb-4">
          Nossa equipe de suporte está pronta para ajudar você
        </p>
        <button 
          onClick={handleForm} 
          className="bg-black hover:bg-black/80 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black/60 focus:ring-opacity-50"
        >
          Entrar em Contato
        </button>
      </div>

      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div 
            id="contact-form"
            className="bg-container rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Entre em Contato
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Mensagem Enviada!
                  </h4>
                  <p className="text-gray-600">
                    Obrigado pelo seu contato. Retornaremos em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border bg-placeholder border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border bg-placeholder border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border bg-placeholder border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="vendas">Dúvidas sobre Vendas</option>
                      <option value="conta">Problemas com Conta</option>
                      <option value="pagamento">Problemas com Pagamento</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border bg-placeholder border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva sua dúvida ou problema..."
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-red-700 text-sm">
                        Erro ao enviar mensagem. Tente novamente.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-black/60 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;