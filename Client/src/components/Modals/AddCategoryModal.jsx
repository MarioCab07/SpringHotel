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
        <header className="bg-[#172A45] text-white p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2">
            <FaChevronLeft size={18} />
          </button>
          <h2 className="font-serif text-lg">Add Category</h2>
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-[#f2789f] hover:bg-[#e76b91] rounded text-sm"
          >
            Save
          </button>
        </header>

        {/* Contenido del formulario */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium">Category name</label>
            <input
              name="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ej. Kitchen, Maintenance..."
              className="w-full rounded-xl bg-gray-200 p-3 text-sm placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddCategoryModal;