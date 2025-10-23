import type { RefObject } from "react";
import logo from "../../public/WIP-logo.png";
import rummykub from "../assets/images/rummykub.logo.png";
import { FaSortDown } from "react-icons/fa";
import Register from "../components/Register";
import About from "../components/About";
import { useLoadingDelay } from "../hooks/useLoadingDelay";
import LoadingPage from "../components/LoadingPage";


type Page = 'home' | 'register' | 'about' | 'tutorials' | 'stock' | 'profile';

interface IndexProps {
  navigateRef: RefObject<HTMLDivElement | null>;
  isLoggedIn: boolean;
  scrollToSection: () => void;
  onNavigate?: (page: Page) => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

export default function Index({ navigateRef, isLoggedIn, scrollToSection }: IndexProps) {
  
  const isLoadingDelay = useLoadingDelay(1000);

  const handleGetStarted = () => {
    // Apenas faz o scroll suave até a seção
    scrollToSection();
  };

  if (isLoadingDelay) {
   return <LoadingPage />;
  }

  return (
    <div className="flex flex-col">
      {/* Seção Hero */}
      <div className="flex items-end justify-center h-screen flex-col w-screen p-2">
        <img
          src={logo}
          alt="Logo WIP"
          className="w-20 fixed top-0 left-0 m-4"
        />

        <h1 className="text-9xl font-title text-right mr-20">
          WORK IN <br /> PROGRESS
        </h1>
        <h3 className="text-xl font-title mr-20">
          Sistema de gerênciamento de comércios e empresas.
        </h3>

        <img 
          src={rummykub} 
          alt="Logo da empresa" 
          className="w-20 fixed bottom-0 right-0 m-4"
        />
      </div>

      {/* Botão de scroll */}
      <div className="flex absolute top-7/9 left-1/2 ">
        <div className="btn border-black border-5 rounded-full mb-20">
          <button 
            className="pb-4 px-2 border-icon border-5 rounded-full text-center text-icon bg-black cursor-pointer" 
            onClick={handleGetStarted}
          >
            <FaSortDown size={40} />
          </button>
        </div>
      </div>

      {/* Seção de destino - mostra Register ou About baseado no login */}
      <div ref={navigateRef} className="min-h-screen">
        {isLoggedIn ? (
          // Se está logado, mostra a seção About
          <About />
        ) : (
          // Se não está logado, mostra a seção Register
          <Register />
        )}
      </div>
    </div>
  );
}