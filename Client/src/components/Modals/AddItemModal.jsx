import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const AddItemModal = ({ isOpen, onClose, onSave, categories = [] }) => {

  console.log("Categorías recibidas en el modal:", categories);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: 0,
    status: "",
    categoryId: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSave = () => {
  if (
    !formData.name.trim() ||
    !formData.type.trim() ||
    !formData.quantity ||         // validación está bien
    !formData.categoryId
  ) {
    toast.error("Por favor completa todos los campos.");
    return;
  }

  const payload = {
    name: formData.name,
    type: formData.type,
    quantity: formData.quantity, // API espera 'quantity', no 'quantity'
    categoryId: formData.categoryId,
    ...(formData.status ? { status: formData.status } : {}) // opcional
  };

  onSave(payload);
  onClose();
  setFormData({
    name: "",
    type: "",
    quantity: 0,
    status: "",
    categoryId: "",
  });
};


  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-[#172A45] text-white p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2">
            <FaChevronLeft size={18} />
          </button>
          <h2 className="font-serif text-lg">Agregar Producto</h2>
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-[#f2789f] hover:bg-[#e76b91] rounded text-sm"
          >
            Guardar
          </button>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium">Nombre del producto</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-200 p-3 text-sm placeholder-gray-500 focus:outline-none"
              placeholder="Ej: Botellas de agua"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-200 p-3 text-sm placeholder-gray-500 focus:outline-none"
              placeholder="Ej: Bebida, Limpieza, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Categoría</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-200 p-3 text-sm"
            >
              <option value="">Selecciona una categoría</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Cantidad en stock</label>
            <input
              type="number"
              name="quantity"
              value={formData.stock}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-200 p-3 text-sm placeholder-gray-500 focus:outline-none"
              placeholder="Ej: 20"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddItemModal;
