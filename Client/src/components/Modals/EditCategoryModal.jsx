import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";

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
    toast.warning("Cannot delete category with products inside");
    return;
  }

  if (window.confirm("Are you sure you want to delete this category?")) {
    onDelete(category.id);
  }
};

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Edit Category</h2>
          <button
            onClick={handleUpdate}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
          >
            Save
          </button>
        </header>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              name="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ej. Cocina, Mantenimiento..."
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition"
            />
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            This category contains <strong className="text-gray-900">{productCount}</strong>{" "}
            {productCount === 1 ? "product" : "products"}.
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
            ? "Cannot delete category with products"
            : "Delete Category"}
        </button>
      </div>
    </div>,
    document.body
  );
};

export default EditCategoryModal;
