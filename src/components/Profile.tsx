import React from "react";
import pfp from "../assets/images/user.pfp.png";
import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-260 grid grid-cols-2 gap-1 p-6 mr-20">
        <div className="col-span-1 flex flex-col items-center bg-placeholder p-6 rounded-lg w-100 h-140 ml-20">
          <img
            src={pfp}
            alt="User Avatar"
            className="rounded-full w-24 h-24 mb-2"
          />
          <h2 className="text-lg font-semibold">{user?.name || "Seu Nome"}</h2>
          <p className="text-sm text-gray-600">{user?.email || "usuario@email.com"}</p>
        </div>
        <div className="col-span-1 grid grid-cols-2 gap-5">
          <button className="bg-placeholder w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors">
            <svg
              className="w-15 h-15"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="mt-2">Configurações</span>
          </button>
          <button className="bg-placeholder w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-15 h-15"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                d="M10 13v3h3v3h3v2l2 2h5v-4L12.74 8.74C12.91 8.19 13 7.6 13 7c0-3.31-2.69-6-6-6S1 3.69 1 7a6.005 6.005 0 0 0 8.47 5.47L10 13ZM6 7a1 1 0 1 1 0-2a1 1 0 0 1 0 2Z"
              />
            </svg>
            <span className="mt-2">Segurança</span>
          </button>
          <button className="bg-placeholder w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors">
            <svg
              className="w-15 h-15"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="mt-2">FAQ</span>
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-red-600 transition-colors"
          >
            <svg
              className="w-15 h-15"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="mt-2">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;