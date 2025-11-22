import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { updateBookingHistory, deleteBookingHistoryRecord, recalculateInvoice, getAllServicesTypes } from "../../service/api.services";
import { toast } from "react-toastify";

const BookingHistoryDetailPanel = ({ isOpen, booking, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [recalculateInvoice, setRecalculateInvoice] = useState(true);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (booking && isOpen) {
      // Cargar servicios disponibles
      const loadServices = async () => {
        try {
          const response = await getAllServicesTypes();
          const services = response.data.data || [];
          setAvailableServices(services);

          // Inicializar servicios seleccionados después de cargar
          if (booking.services && booking.services.length > 0) {
            const currentServiceIds = booking.services
              .map((service) => {
                const found = services.find(
                  (s) => s.name === service.serviceName || s.id === service.serviceId
                );
                return found?.id;
              })
              .filter((id) => id != null);
            setSelectedServices(currentServiceIds);
          } else {
            setSelectedServices([]);
          }
        } catch (error) {
          console.error("Error loading services:", error);
        }
      };
      loadServices();
    }
  }, [booking, isOpen]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBookingHistory(booking.id, {
        serviceTypeIds: selectedServices,
        recalculateInvoice: recalculateInvoice,
      });
      toast.success("Historial actualizado exitosamente");
      onSuccess();
    } catch (error) {
      console.error("Error updating history:", error);
      toast.error(
        error?.response?.data?.message || "Error al actualizar el historial"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Eliminando registro...");
    try {
      await deleteBookingHistoryRecord(booking.id);
      toast.dismiss(toastId);
      toast.success("Registro eliminado exitosamente");
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        error?.response?.data?.message || "Error al eliminar el registro"
      );
    }
  };

  const handleRecalculateInvoice = async () => {
    setLoading(true);
    try {
      await recalculateInvoice(booking.id);
      toast.success("Factura recalculada exitosamente");
      onSuccess();
    } catch (error) {
      console.error("Error recalculating invoice:", error);
      toast.error(
        error?.response?.data?.message || "Error al recalcular la factura"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  const isConfirmValid = confirmText.trim().toUpperCase() === "CONFIRMAR";

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Detalles de Reserva</h2>
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
              {/* Información de la reserva */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID de Reserva</p>
                    <p className="text-sm font-medium text-gray-900">#{String(booking.id).padStart(3, "0")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900">{booking.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Client</p>
                    <p className="text-sm font-medium text-gray-900">{booking.userName}</p>
                    <p className="text-xs text-gray-500">{booking.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Room</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.roomNumber} - {booking.roomType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Check-in</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(booking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Check-out</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>
              </div>

              {/* Servicios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Services
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-white">
                  {availableServices.length === 0 ? (
                    <p className="text-gray-500 text-sm">Loading services...</p>
                  ) : (
                    <div className="space-y-2">
                      {availableServices.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {service.name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ${service.price?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Opción de recalcular factura */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={recalculateInvoice}
                    onChange={(e) => setRecalculateInvoice(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Recalcular factura automáticamente
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  If checked, the invoice will be recalculated based on the selected services
                </p>
              </div>

              {/* Botón de recalcular factura manual */}
              {booking.ticket && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={handleRecalculateInvoice}
                    disabled={loading}
                    className="w-full px-5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {loading ? "Recalculando..." : "Recalcular Factura Ahora"}
                  </button>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "delete" && (
            <form onSubmit={handleDeleteSubmit} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID de Reserva</p>
                    <p className="text-sm font-medium text-gray-900">#{String(booking.id).padStart(3, "0")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900">{booking.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Client</p>
                    <p className="text-sm font-medium text-gray-900">{booking.userName}</p>
                    <p className="text-xs text-gray-500">{booking.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Room</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.roomNumber} - {booking.roomType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Check-in</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(booking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Check-out</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(booking.checkOut)}</p>
                  </div>
                  {booking.services && booking.services.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Services</p>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.services.length} servicio(s) asociado(s)
                      </p>
                    </div>
                  )}
                  {booking.ticket && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Total Facturado</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${booking.totalPaid?.toFixed(2) || booking.ticket?.total?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-red-700 mb-2">
                    Esta acción no se puede deshacer
                  </p>
                  <p className="text-xs text-red-600 mb-4">
                    The reservation, all associated services, and the invoice (if it exists) will be deleted.
                  </p>
                  <p className="text-xs text-red-600 mb-4">
                    Escribe <span className="font-bold">CONFIRMAR</span> para eliminar el registro
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

export default BookingHistoryDetailPanel;

