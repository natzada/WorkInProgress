// import { useRef, useState } from "react";
import "./App.css";
// import Register from "./components/Register";
// import About from "./components/About"; 
import Footer from "./components/Footer";
import texture from "./assets/images/texturebg.png";
import logo from "../public/WIP-logo.png";
import rummykub from "../src/assets/images/rummykub.logo.png";
// import Stock from "./components/Stock";
// import Sidebar from "./components/SideBar";
// import Profile from "./components/Profile";
// import Index from "./pages/Index";

function App() {
  // const registerRef = useRef<HTMLDivElement>(null);
  // const aboutRef = useRef<HTMLDivElement>(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para rolar até a seção apropriada
  // const scrollToSection = () => {
  //   if (isLoggedIn && aboutRef.current) {
  //     aboutRef.current.scrollIntoView({ behavior: "smooth" });
  //   } else if (!isLoggedIn && registerRef.current) {
  //     registerRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  // Função para simular login (substitua pela sua lógica real)
  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  //   // Após o login, rola para a seção About
  //   setTimeout(() => {
  //     if (aboutRef.current) {
  //       aboutRef.current.scrollIntoView({ behavior: "smooth" });
  //     }
  //   }, 100);
  // };

  // Função para logout
  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  // };

  return (
    <div className="App">
      <div 
        className="min-h-screen min-w-screen container p-0 m-0 bg-lightbg bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${texture})`, 
          backgroundBlendMode: 'overlay' 
        }}
      >
        <img
          src={logo}
          alt="Logo WIP"
          className="w-20 fixed top-0 left-0 m-4"
        />
        {/* <Stock /> */}
        {/* <Profile />  */}
        {/* <Sidebar /> */}
        {/* <Index 
          registerRef={registerRef} 
          aboutRef={aboutRef}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
          scrollToSection={scrollToSection}
        /> */}
        
        {/* Seção Register - visível apenas quando não logado */}
        {/* {!isLoggedIn && (
          <div ref={registerRef}>
            <Register onLogin={handleLogin} />
          </div>
        )} */}
        
        {/* Seção About - visível apenas quando logado */}
         {/* {isLoggedIn && (
          <div ref={aboutRef}>
            <About />
          </div>
        )} */}
        <img 
          src={rummykub} 
          alt="Logo da empresa" 
          className="w-20 fixed bottom-0 right-0 m-4"
        />
      </div>

      <Footer />
    </div>
  );
}

export default App;