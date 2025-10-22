// src/components/LoadingPage.tsx
import React from 'react';
import Loader from './Loader';
import logo from "../../public/WIP-logo.png"; // Ajuste o caminho

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center  p-8">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-32 h-32 bg-white/20 mx-auto mb-4 rounded-full shadow-lg"
          />
          <h1 className="text-3xl font-bold text-black">WORK IN PROGRESS</h1>
        </div>
        
        {/* Loader */}
        <div className="flex justify-center items-center my-9">
          <Loader />
        </div>
        
        {/* Texto */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Carregando
          </h2>
          <p className="text-gray-600 text-sm">
            Preparando o ambiente de trabalho...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;