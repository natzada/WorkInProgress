import logo from "../../public/WIP-logo.png";
import rummykub from "../assets/images/rummykub.logo.png"
import { FaSortDown } from "react-icons/fa";

export default function Index() {
  return (
    <div className="flex flex-col my-10">
      <div className="flex items-end justify-center h-screen flex-col w-screen p-2">
        <img
          src={logo}
          alt="Logo WIP"
          className="w-20 position fixed top-0 left-0"
        />

        <h1 className="text-9xl font-title text-right mr-20">
          WORK IN <br /> PROGRESS
        </h1>
        <h3 className="text-xl font-title mr-20">
          Sistema de gerênciamento de comércios e empresas.
        </h3>

        <img src={rummykub} alt="Logo da empresa" className="w-20 position fixed bottom-0 right-0"/>
      </div>

      <div className="flex justify-center">
        <div className="btn border-black border-5 rounded-full">
          <button className="pb-4 px-2 border-icon border-5 rounded-full text-center text-icon bg-black">
            <FaSortDown size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}
