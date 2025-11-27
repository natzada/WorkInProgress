import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import type { User } from "../contexts/authTypes";

// ✅ CORREÇÃO: Interface compatível com o backend e frontend
export interface UpdateProfileRequest {
  id: number; // ← ADICIONAR ID (obrigatório para a rota)
  name: string;
  email: string;
  companyName: string;
  preferences: string;
  password?: string; // ← manter se necessário
  creationDate?: string | null;
  profilePicturePath?: string;
}

export const useProfile = () => {
  const { currentUser, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    profileData: UpdateProfileRequest
  ): Promise<boolean> => {
    if (!currentUser) {
      setError("Usuário não autenticado");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // ✅ CORREÇÃO: Incluir o ID nos dados enviados
      const dataToSend = {
        ...profileData,
        id: currentUser.id, // Garantir que o ID está incluído
      };

      console.log("📤 Dados enviados para atualização:", dataToSend);

      const response = await fetch(
        `http://localhost:8080/api/users/${currentUser.id}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      console.log("📡 Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro do backend:", errorText);
        throw new Error(`Erro ao atualizar perfil: ${errorText}`);
      }

      const updatedUser: User = await response.json();
      console.log("✅ Perfil atualizado com sucesso:", updatedUser);

      updateUser(updatedUser); // Atualiza no contexto e localStorage
      return true;
    } catch (err) {
      console.error("💥 Erro na atualização:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    if (!currentUser) {
      setError("Usuário não autenticado");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      console.log("🖼️ Enviando imagem para usuário:", currentUser.id);

      const response = await fetch(
        `http://localhost:8080/api/users/${currentUser.id}/profile-picture`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log("📡 Status do upload:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro no upload:", errorText);
        throw new Error(`Erro ao fazer upload da imagem: ${errorText}`);
      }

      const updatedUser: User = await response.json();
      console.log("✅ Imagem atualizada com sucesso:", updatedUser);

      updateUser(updatedUser);
      return true;
    } catch (err) {
      console.error("💥 Erro no upload:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: currentUser,
    isLoading,
    error,
    updateProfile,
    uploadProfilePicture,
    setError,
  };
};
