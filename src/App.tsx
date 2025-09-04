// import { useState } from 'react'
import "./App.css";
import Index from "./pages/Index";
import texture from "./assets/images/texturebg.png";

function App() {
  return (
    <>
      <div className="flex h-screen w-screen container bg-lightbg bg-cover bg-center bg-repeat"
    style={{ backgroundImage: `url(${texture})`, backgroundBlendMode: 'overlay' }}>
      
        <Index />
      </div>
    </>
  );
}

export default App;
