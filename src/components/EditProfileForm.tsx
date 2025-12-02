// src/components/EditProfileForm.tsx
import React, { useState, useRef, type ChangeEvent } from "react";
import { useProfile } from "../hooks/useProfile";

interface EditProfileFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onCancel,
  onSave,
}) => {
  const { user, updateProfile, uploadProfilePicture, isLoading, error } =
    useProfile();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    companyName: user?.companyName || "",
    preferences: user?.preferences || "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Usuário não encontrado</p>
      </div>
    );
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB.");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await updateProfile(formData);

      if (success && selectedImage) {
        await uploadProfilePicture(selectedImage);
      }

      if (success) {
        onSave();
      }
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getProfilePictureUrl = () => {
    if (imagePreview) return imagePreview;
    if (user.profilePicturePath) {
      return `http://localhost:8080/api/users/profile-picture/${user.profilePicturePath}`;
    }
    return "/assets/images/default-avatar.png";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-placeholder rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Perfil</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="shrink-0">
            <img
              src={getProfilePictureUrl()}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 bg-container border-white"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-black/80 disabled:bg-white transition-colors"
            >
              Alterar Foto
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-sm text-black/60">JPG, PNG ou GIF (máx. 5MB)</p>
          </div>
        </div>

        {/* Campos do Formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome Completo 
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-container disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Nome da Empresa
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-container disabled:bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="preferences"
            className="block text-sm font-medium text-gray-700"
          >
            Preferências
          </label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={4}
            className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-container disabled:bg-gray-100 resize-vertical"
            placeholder="Digite suas preferências pessoais..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-black/80 disabled:bg-gray-400 transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
