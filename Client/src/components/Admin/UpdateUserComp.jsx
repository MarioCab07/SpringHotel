import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { UpdateUser } from "../../service/api.services";
import { toast } from "react-toastify";
import Select from "react-select";
import countryList from "react-select-country-list";

const UpdateUserComp = ({ isOpen, user, onClose, onSuccess }) => {
  const [changeUser, setChangeUser] = useState({
    userId: user?.userId || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    documentNumber: user?.documentNumber || "",
    country: user?.country || "",
    phoneNumber: user?.phoneNumber || "",
    userName: user?.userName || "",
  });

  useEffect(() => {
    if (user) {
      setChangeUser({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        documentNumber: user.documentNumber,
        country: user.country,
        phoneNumber: user.phoneNumber,
        userName: user.userName,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangeUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (countryCode) => {
    setChangeUser((prev) => ({ ...prev, country: countryCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!changeUser.fullName.trim() || !changeUser.email.trim() || !changeUser.documentNumber.trim() || !changeUser.phoneNumber.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const response = await UpdateUser(changeUser);
      if (response.status === 200) {
        toast.success("Cliente actualizado exitosamente");
        onSuccess();
      }
    } catch (error) {
      toast.error("Error al actualizar el cliente: " + (error.message || "Error desconocido"));
    }
  };

  if (!isOpen || !user) return null;

  const countryOptions = countryList().getData();
  const selectedCountry = countryOptions.find((opt) => opt.value === changeUser.country);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f3f4f6",
      borderColor: state.isFocused ? "#f2789f" : "#d1d5db",
      borderRadius: "12px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(242, 120, 159, 0.25)" : "none",
      "&:hover": { borderColor: "#f2789f" },
      minHeight: "48px",
    }),
    menu: (base) => ({ ...base, backgroundColor: "#ffffff", zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#fce7f3" : "#ffffff",
      color: "#000000",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000000",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
    }),
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Editar Cliente</h2>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition"
          >
            Guardar
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              name="fullName"
              value={changeUser.fullName}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={changeUser.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
              placeholder="Ej: juan@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Documento
            </label>
            <input
              type="text"
              name="documentNumber"
              value={changeUser.documentNumber}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
              placeholder="Ej: 12345678"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={(opt) => handleCountryChange(opt?.value ?? "")}
              placeholder="Selecciona un país"
              styles={customSelectStyles}
              isClearable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Teléfono
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={changeUser.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
              placeholder="Ej: +1234567890"
              required
            />
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UpdateUserComp;
