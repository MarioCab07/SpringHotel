import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { updateRoom, deleteRoom, getAllRoomTypes } from "../../service/api.services";
import { toast } from "react-toastify";
import Select from "react-select";

const RoomDetailPanel = ({ isOpen, room, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [changeRoom, setChangeRoom] = useState({
    roomId: room?.roomId || "",
    roomNumber: room?.roomNumber || "",
    roomType: room?.roomType?.roomTypeId || room?.roomType || null,
    roomStatus: room?.roomStatus || "",
  });
  const [confirmText, setConfirmText] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const roomStatusOptions = [
    { value: "AVAILABLE", label: "Disponible" },
    { value: "OCCUPIED", label: "Ocupada" },
    { value: "RESERVED", label: "Reservada" },
    { value: "MAINTENANCE", label: "Mantenimiento" },
  ];

  useEffect(() => {
    if (room) {
      setChangeRoom({
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        roomType: room.roomType?.roomTypeId || room.roomType,
        roomStatus: room.roomStatus,
      });
    }
  }, [room]);

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
          
          if (room) {
            const currentType = options.find(
              (opt) => opt.value === (room.roomType?.roomTypeId || room.roomType)
            );
            if (currentType) {
              setSelectedRoomType(currentType);
            }
          }
        }
      } catch (err) {
        toast.error("Error al cargar tipos de habitación: " + err.message);
      }
    };
    if (isOpen) {
      fetchTypes();
    }
  }, [isOpen, room]);

  useEffect(() => {
    if (room && room.roomStatus) {
      const currentStatus = roomStatusOptions.find(
        (opt) => opt.value === room.roomStatus
      );
      if (currentStatus) {
        setSelectedStatus(currentStatus);
      }
    }
  }, [room]);

  const handleRoomTypeChange = (option) => {
    setSelectedRoomType(option);
    setChangeRoom((prev) => ({
      ...prev,
      roomType: option?.value || null,
    }));
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option);
    setChangeRoom((prev) => ({
      ...prev,
      roomStatus: option?.value || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomNumber") {
      const numericValue = value.replace(/\D/g, "");
      setChangeRoom((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setChangeRoom((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!changeRoom.roomNumber.trim() || !changeRoom.roomType || !changeRoom.roomStatus) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const res = await updateRoom(changeRoom.roomId, changeRoom);
      if (res.status === 200) {
        toast.success("Habitación actualizada exitosamente");
        onSuccess();
      }
    } catch (error) {
      toast.error("Error al actualizar la habitación: " + (error.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Eliminando habitación...");
    try {
      toast.dismiss(toastId);

      const response = await deleteRoom(room.roomId);

      if (response.status === 200) {
        toast.success("Habitación eliminada exitosamente");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error al eliminar la habitación: " + err.message);
    }
  };

  if (!isOpen || !room) return null;

  const isConfirmValid = confirmText.trim().toUpperCase() === "CONFIRMAR";

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
          <h2 className="font-serif text-lg text-gray-900">Detalles de Habitación</h2>
          <div className="w-20" /> {/* Spacer para centrar el título */}
        </header>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "edit"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Editar
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "delete"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Eliminar
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "edit" && (
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Habitación
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="roomNumber"
                  value={changeRoom.roomNumber}
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

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "delete" && (
            <form onSubmit={handleDeleteSubmit} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">ID de Habitación:</span> {room.roomId}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Número de Habitación:</span> {room.roomNumber}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Tipo de Habitación:</span> {room.roomType?.name || room.roomType}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Estado:</span> {room.roomStatus}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-600 mb-2 text-center">
                  Escribe <span className="font-bold">CONFIRMAR</span> para eliminar la habitación
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="CONFIRMAR"
                  className="w-full rounded-xl bg-red-50 border-2 border-red-500 focus:border-red-700 p-3 text-sm text-center text-red-700 font-bold placeholder-red-300 focus:outline-none transition"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isConfirmValid}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
                    isConfirmValid
                      ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md hover:shadow-lg"
                      : "bg-red-200 text-red-400 cursor-not-allowed opacity-70"
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RoomDetailPanel;

