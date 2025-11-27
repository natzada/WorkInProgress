import React from "react";
import pfp from "../assets/images/user.pfp.png";
import { useAuth } from "../contexts/useAuth";
import LoadingPage from "./LoadingPage";
import { useLoadingDelay } from "../hooks/useLoadingDelay";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const isLoadingDelay = useLoadingDelay(1000);
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Função para formatar a data
  const formatCreationDate = (dateString: string) => {
    if (!dateString) return "Data não informada";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  const SuppliersIcon: FC<IconProps> = ({
    size = 24,
    color = "currentColor",
    className,
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const handleEditProfile = () => {
    navigate("edit");
  };

  const handleSecurity = () => {
    navigate("security");
  };

  const handleFaq = () => {
    navigate("faq");
  };

  const handleLogout = async () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setIsLoggingOut(true);
      try {
        await logout();
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  if (isLoadingDelay || isLoggingOut) {
    return <LoadingPage />;
  }

  const imageUrl = currentUser?.profilePicturePath
    ? `http://localhost:8080/uploads/${currentUser.profilePicturePath}`
    : pfp;

  console.log("🔍 Debug imagem:");
  console.log("   - profilePicturePath:", currentUser?.profilePicturePath);
  console.log("   - URL construída:", imageUrl);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-260 grid grid-cols-2 gap-1 p-6 mr-20">
        <div className="col-span-1 flex flex-col items-center bg-placeholder p-6 rounded-lg w-100 h-140 ml-20">
          <img
            src={imageUrl}
            alt="User Avatar"
            className="rounded-full w-24 h-24 mb-2 object-cover"
            onError={(e) => {
              console.error(
                "❌ ERRO IMAGEM - URL tentada:",
                e.currentTarget.src
              );
              e.currentTarget.src = pfp;
            }}
            onLoad={() => console.log("✅ Imagem carregada com sucesso!")}
          />
          <h2 className="text-lg font-semibold">
            {currentUser?.name || "Seu Nome"}
          </h2>
          <p className="text-sm text-gray-600">
            {currentUser?.email || "usuario@email.com"}
          </p>

          {/* Novas informações da empresa */}
          <div className="mt-4 w-full border-t border-gray-300 pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Empresa</p>
              <p className="text-sm text-gray-600">
                {currentUser?.companyName || "Não informada"}
              </p>
            </div>

            <div className="text-center mt-2">
              <p className="text-sm font-medium text-gray-700">
                Data de Criação
              </p>
              <p className="text-sm text-gray-600">
                {currentUser?.creationDate
                  ? formatCreationDate(currentUser.creationDate)
                  : "Não informada"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 grid grid-cols-2 gap-5">
          <button
            onClick={handleEditProfile}
            className="bg-placeholder w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-300 transition-colors"
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

          <button
            onClick={handleSecurity}
            className="bg-placeholder w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-300 transition-colors"
          >
            <SuppliersIcon className="w-15 h-15" />
            <span className="mt-2">Fornecedores</span>
          </button>

          <button
            onClick={handleFaq}
            className="bg-placeholder w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-300 transition-colors"
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="mt-2">FAQ</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-placeholder text-black w-60 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-red-600 transition-colors"
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
