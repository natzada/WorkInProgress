import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import EditProfileForm from "./EditProfileForm";
import LoadingPage from "./LoadingPage";
import { useLoadingDelay } from "../hooks/useLoadingDelay";
import { useNavigate } from "react-router-dom";

const ProfileConfig: React.FC = () => {
  const { currentUser } = useAuth();
  const isLoadingDelay = useLoadingDelay(500);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/profile"); // Volta para o perfil após salvar
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/profile"); // Volta para o perfil
  };

  if (isLoadingDelay || !currentUser) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-5 ">
      <div className="flex justify-center items-center min-h-screen w-1/2 p-8 rounded-4xl">
        <div className="container mx-auto px-4">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              Perfil atualizado com sucesso!
            </div>
          )}

          <EditProfileForm onSave={handleSave} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default ProfileConfig;
