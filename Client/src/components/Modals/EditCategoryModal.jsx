import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";

const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  onUpdate,
  onDelete,
  productCount = 0, // 👈 Recibimos la cantidad de productos como prop
}) => {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleUpdate = () => {
    if (!categoryName.trim()) return;

    const updated = {
      id: category.id,
      name: categoryName.trim(),
    };

    onUpdate(updated);
    onClose();
    setCategoryName("");
  };

  const handleDelete = () => {
  if (productCount > 0) {
    toast.warning("No se puede borrar categoría con productos dentro");
    return;
  }

  if (window.confirm("¿Estás seguro que deseas eliminar esta categoría?")) {
    onDelete(category.id);
  }
};

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-[#172A45] text-white p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2">
            <FaChevronLeft size={18} />
          </button>
          <h2 className="font-serif text-lg">Edit Category</h2>
          <button
            onClick={handleUpdate}
            className="px-4 py-1 bg-[#f2789f] hover:bg-[#e76b91] rounded text-sm"
          >
            Save
          </button>
        </header>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
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

          <div className="text-sm text-gray-600">
            Esta categoría contiene <strong>{productCount}</strong>{" "}
            {productCount === 1 ? "producto" : "productos"}.
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={productCount > 0}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold rounded-b ${
            productCount > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
            />
          </svg>
          {productCount > 0
            ? "No se puede eliminar categoria con productos"
            : "Eliminar categoría"}
        </button>
      </div>
    </div>,
    document.body
  );
};

export default EditCategoryModal;
