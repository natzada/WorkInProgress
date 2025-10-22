// src/App.tsx
import { useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./contexts/useAuth";
import Login from "./components/Login";
import { useLoadingDelay } from "./hooks/useLoadingDelay";
import LoadingPage from "./components/LoadingPage";

function AppContent() {
  const navigateRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const loading = useLoadingDelay(1000);

  // Função para rolar até a seção apropriada
  const scrollToSection = () => {
    if (navigateRef.current) {
      navigateRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Função para navegar entre páginas
  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

  const handleGoHome = () => {
    navigate("/");
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="App">
      <div
        className="min-h-screen min-w-screen container p-0 m-0 bg-lightbg bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${texture})`,
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Header com logo */}
        <button
        onClick={handleGoHome}
        >
          <img
            src={logo}
            alt="Logo WIP"
            className="w-20 fixed top-0 left-0 m-4 z-50"
          />
        </button>

        {/* Sidebar só aparece quando logado */}
        {isAuthenticated && (
          <Sidebar
            onNavigate={handleNavigation}
            currentPage={location.pathname.replace("/", "")}
          />
        )}

        {/* Conteúdo principal com margem condicional */}
        <main className={isAuthenticated ? "ml-16" : ""}>
          <Routes>
            {/* Rotas públicas */}
            <Route
              path="/"
              element={
                <Index
                  navigateRef={navigateRef}
                  isLoggedIn={isAuthenticated}
                  scrollToSection={scrollToSection}
                  onNavigate={handleNavigation}
                />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas - só acessíveis quando logado */}
            {isAuthenticated ? (
              <>
                <Route path="/about" element={<About />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/profile" element={<Profile />} />
              </>
            ) : (
              // Redireciona para home se não estiver autenticado
              <Route
                path="*"
                element={
                  <Index
                    navigateRef={navigateRef}
                  isLoggedIn={isAuthenticated}
                    scrollToSection={scrollToSection}
                    onNavigate={handleNavigation}
                  />
                }
              />
            )}
          </Routes>
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
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
