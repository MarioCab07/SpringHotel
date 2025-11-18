import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!categoryName.trim()) return;
    onSave(categoryName.trim());
    onClose();
    setCategoryName("");
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo semitransparente */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel derecho */}
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        {/* Encabezado */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Agregar Categoría</h2>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
          >
            Guardar
          </button>
        </header>

        {/* Contenido del formulario */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la categoría</label>
            <input
              name="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ej. Cocina, Mantenimiento..."
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddCategoryModal;