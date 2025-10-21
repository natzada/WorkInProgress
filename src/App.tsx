import { useRef, useState } from "react";
import "./App.css";
import Register from "./components/Register";
import About from "./components/About"; 
import Footer from "./components/Footer";
import texture from "./assets/images/texturebg.png";
import logo from "../public/WIP-logo.png";
import rummykub from "../src/assets/images/rummykub.logo.png";
import Tutorials from "./components/Tutorials";
import Stock from "./components/Stock";
import Sidebar from "./components/SideBar";
import Profile from "./components/Profile";
import Index from "./pages/Index";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Tipo para as páginas disponíveis
type Page = 'home' | 'register' | 'about' | 'tutorials' | 'stock' | 'profile';

function AppContent() {
  const registerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isLoggedIn } = useAuth();

  // Função para rolar até a seção apropriada
  const scrollToSection = () => {
    if (isLoggedIn && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (!isLoggedIn && registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Função para navegar entre páginas
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  // Renderizar o conteúdo baseado na página atual e estado de login
  const renderContent = () => {
    // Se não estiver logado, mostra apenas Index ou Register
    if (!isLoggedIn) {
      if (currentPage === 'register') {
        return <Register onLogin={() => {}} />;
      }
      return (
        <Index 
          registerRef={registerRef} 
          aboutRef={aboutRef}
          isLoggedIn={isLoggedIn}
          scrollToSection={scrollToSection}
          onNavigate={handleNavigation}
        />
      );
    }

    // Se estiver logado, mostra as páginas protegidas
    switch (currentPage) {
      case 'home':
        return (
          <div>
            <Index 
              registerRef={registerRef} 
              aboutRef={aboutRef}
              isLoggedIn={isLoggedIn}
              scrollToSection={scrollToSection}
              onNavigate={handleNavigation}
            />
            <About />
          </div>
        );
      case 'about':
        return <About />;
      case 'tutorials':
        return <Tutorials />;
      case 'stock':
        return <Stock />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <div>
            <Index 
              registerRef={registerRef} 
              aboutRef={aboutRef}
              isLoggedIn={isLoggedIn}
              scrollToSection={scrollToSection}
              onNavigate={handleNavigation}
            />
            <About />
          </div>
        );
    }
  };

  return (
    <div className="App">
      <div 
        className="min-h-screen min-w-screen container p-0 m-0 bg-lightbg bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${texture})`, 
          backgroundBlendMode: 'overlay' 
        }}
      >
        {/* Header com logo */}
        <img
          src={logo}
          alt="Logo WIP"
          className="w-20 fixed top-0 left-0 m-4 z-50"
        />

        {/* Sidebar só aparece quando logado - REMOVA onLogout */}
        {isLoggedIn && (
          <Sidebar onNavigate={handleNavigation} currentPage={currentPage} />
        )}

        {/* Conteúdo principal com margem condicional */}
        <main className={isLoggedIn ? "ml-16" : ""}>
          {renderContent()}
        </main>

        {/* Footer sempre visível */}
        <Footer />

        {/* Logo no canto inferior direito */}
        <img 
          src={rummykub} 
          alt="Logo da empresa" 
          className="w-20 fixed bottom-0 right-0 m-4 z-50"
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;