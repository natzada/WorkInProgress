import { useRef } from "react";
import "./App.css";
import Index from "./pages/Index";
import Register from "./components/Register";
import Footer from "./components/Footer";
import texture from "./assets/images/texturebg.png";

function App() {
  const registerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="">
      <div 
        className="min-h-screen min-w-screen container p-0 m-0 bg-lightbg bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${texture})`, 
          backgroundBlendMode: 'overlay' 
        }}
      >
        <Index registerRef={registerRef} />
        
        {/* Adicione a ref ao componente Register */}
        <div ref={registerRef}>
          <Register />
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default App;