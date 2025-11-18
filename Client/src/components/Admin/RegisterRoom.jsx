import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { getAllRoomTypes, createRoom } from "../../service/api.services";
import { toast } from "react-toastify";
import Select from "react-select";

const RegisterRoom = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: null,
    roomStatus: "",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const roomStatusOptions = [
    { value: "AVAILABLE", label: "Disponible" },
    { value: "OCCUPIED", label: "Ocupada" },
    { value: "RESERVED", label: "Reservada" },
    { value: "MAINTENANCE", label: "Mantenimiento" },
  ];

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getAllRoomTypes();
        if (res.status === 200) {
          const types = res.data.data;
          setRoomTypes(types);
          const options = types.map((t) => ({
            value: t.roomTypeId,
            label: t.roomTypeName,
          }));
          setRoomTypeOptions(options);
          if (options.length) {
            setSelectedRoomType(options[0]);
            setFormData((prev) => ({
              ...prev,
              roomType: options[0].value,
            }));
          }
        }
      } catch (err) {
        toast.error("Error al cargar tipos de habitación: " + err.message);
      }
    };
    if (isOpen) {
      fetchTypes();
    }
  }, [isOpen]);

  const handleRoomTypeChange = (option) => {
    setSelectedRoomType(option);
    setFormData((prev) => ({
      ...prev,
      roomType: option?.value || null,
    }));
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option);
    setFormData((prev) => ({
      ...prev,
      roomStatus: option?.value || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Solo permitir números para roomNumber
    if (name === "roomNumber") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.roomNumber.trim() || !formData.roomType || !formData.roomStatus) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const res = await createRoom(formData);
      if (res.status === 201) {
        toast.success("Habitación registrada exitosamente");
        // Limpiar formulario
        setFormData({ roomNumber: "", roomType: null, roomStatus: "" });
        setSelectedRoomType(roomTypeOptions[0] || "");
        setSelectedStatus("");
        onSuccess();
      }
    } catch (err) {
      toast.error("Error al registrar habitación: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f3f4f6",
      borderColor: state.isFocused ? "#D9C696" : "#d1d5db",
      borderRadius: "12px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(217, 198, 150, 0.25)" : "none",
      "&:hover": { borderColor: "#D9C696" },
      minHeight: "48px",
    }),
    menu: (base) => ({ ...base, backgroundColor: "#ffffff", zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f5f0e8" : "#ffffff",
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
          <h2 className="font-serif text-lg text-gray-900">Registrar Habitación</h2>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:hover:shadow-none disabled:hover:transform-none text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Habitación
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-transparent transition"
              placeholder="Ej: 101"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Solo se permiten números</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Habitación
            </label>
            <Select
              options={roomTypeOptions}
              value={selectedRoomType}
              onChange={handleRoomTypeChange}
              placeholder="Selecciona un tipo de habitación"
              styles={customSelectStyles}
              isClearable={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de Habitación
            </label>
            <Select
              options={roomStatusOptions}
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="Selecciona un estado"
              styles={customSelectStyles}
              isClearable={false}
            />
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RegisterRoom;
