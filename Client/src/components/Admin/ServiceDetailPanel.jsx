import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { updateServiceType, deleteServiceType } from "../../service/api.services";
import { toast } from "react-toastify";

const ServiceDetailPanel = ({ isOpen, service, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [changeService, setChangeService] = useState({
    id: service?.id || "",
    name: service?.name || "",
    price: service?.price?.toString() || "",
  });
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setChangeService({
        id: service.id,
        name: service.name,
        price: service.price?.toString() || "",
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const numericValue = value.replace(/\D/g, "");
      setChangeService((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setChangeService((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const priceNum = typeof changeService.price === 'string' 
      ? parseFloat(changeService.price) 
      : changeService.price;

    if (!changeService.name.trim() || !priceNum || priceNum <= 0) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const data = {
        id: changeService.id,
        name: changeService.name.trim(),
        price: priceNum,
      };
      const res = await updateServiceType(data);
      if (res.status === 200) {
        toast.success("Servicio actualizado exitosamente");
        onSuccess();
      }
    } catch (error) {
      toast.error("Error al actualizar el servicio: " + (error.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Eliminando servicio...");
    try {
      toast.dismiss(toastId);

      const response = await deleteServiceType(service.id);

      if (response.status === 200) {
        toast.success("Servicio eliminado exitosamente");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error al eliminar el servicio: " + err.message);
    }
  };

  if (!isOpen || !service) return null;

  const isConfirmValid = confirmText.trim().toUpperCase() === "CONFIRMAR";

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Detalles de Servicio</h2>
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
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  name="name"
                  value={changeService.name}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition"
                  placeholder="Ej: Servicio de Limpieza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio del Servicio
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="price"
                  value={changeService.price}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition"
                  placeholder="Ej: 500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo se permiten números</p>
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
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Servicio</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID del Servicio</p>
                    <p className="text-sm font-medium text-gray-900">{service.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nombre del Servicio</p>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Precio del Servicio</p>
                    <p className="text-sm font-medium text-gray-900">${service.price} USD</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-red-700 mb-2">
                    Esta acción no se puede deshacer
                  </p>
                  <p className="text-xs text-red-600 mb-4">
                    Escribe <span className="font-bold">CONFIRMAR</span> para eliminar el servicio
                  </p>
                </div>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="CONFIRMAR"
                  className="w-full rounded-xl bg-white border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 p-3 text-sm text-center text-gray-900 font-semibold placeholder-red-300 focus:outline-none transition"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
                      ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-red-200 text-red-400 cursor-not-allowed opacity-70"
                  }`}
                >
                  Eliminar
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

export default ServiceDetailPanel;

