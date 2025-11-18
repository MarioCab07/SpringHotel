import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";

const EditItemModal = ({ isOpen, onClose, item, categories, onUpdate, onDelete }) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    quantity: 0,
    categoryId: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        type: item.type || "",
        quantity: item.quantity,
        categoryId: item.categoryId || item.category?.id || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.type.trim() || !form.categoryId || form.quantity < 0) return;
    onUpdate({ ...item, ...form });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro que deseas eliminar este producto?")) {
      onDelete(item.id);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Editar Producto</h2>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
          >
            Guardar
          </button>
        </header>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Ej: Bebida, Limpieza, etc."
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-b"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
            />
          </svg>
          Eliminar producto
        </button>
      </div>
    </div>,
    document.body
  );
};

export default EditItemModal;
