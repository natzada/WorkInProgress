import { useRef, useState } from "react";
import "./App.css";
import Index from "./pages/Index";
import Register from "./components/Register";
import About from "./components/About"; // Importe o componente About
import Footer from "./components/Footer";
import texture from "./assets/images/texturebg.png";

function App() {
  const registerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para rolar até a seção apropriada
  const scrollToSection = () => {
    if (isLoggedIn && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (!isLoggedIn && registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Função para simular login (substitua pela sua lógica real)
  const handleLogin = () => {
    setIsLoggedIn(true);
    // Após o login, rola para a seção About
    setTimeout(() => {
      if (aboutRef.current) {
        aboutRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Função para logout
  const handleLogout = () => {
    setIsLoggedIn(false);
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
        <Index 
          registerRef={registerRef} 
          aboutRef={aboutRef}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
          scrollToSection={scrollToSection}
        />
        
        {/* Seção Register - visível apenas quando não logado */}
        {!isLoggedIn && (
          <div ref={registerRef}>
            <Register onLogin={handleLogin} />
          </div>
        )}
        
        {/* Seção About - visível apenas quando logado */}
        {isLoggedIn && (
          <div ref={aboutRef}>
            <About />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;