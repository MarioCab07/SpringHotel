import React, { useState, useEffect } from "react";

const EditBookingHistoryModal = ({ booking, availableServices, onClose, onSave }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [recalculateInvoice, setRecalculateInvoice] = useState(true);

  useEffect(() => {
    // Inicializar con los servicios actuales de la reserva
    if (booking.services && booking.services.length > 0) {
      // Mapear los servicios actuales a sus IDs (asumiendo que tenemos los IDs)
      // Si no tenemos los IDs directamente, necesitamos buscarlos por nombre
      const currentServiceIds = booking.services
        .map((service) => {
          const found = availableServices.find(
            (s) => s.name === service.serviceName || s.id === service.serviceId
          );
          return found?.id;
        })
        .filter((id) => id != null);
      setSelectedServices(currentServiceIds);
    }
  }, [booking, availableServices]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      serviceTypeIds: selectedServices,
      recalculateInvoice: recalculateInvoice,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-100 p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Editar Historial de Reserva</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Reserva #{String(booking.id).padStart(3, "0")}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p>
                <strong>Cliente:</strong> {booking.userName} ({booking.userEmail})
              </p>
              <p>
                <strong>Habitación:</strong> {booking.roomNumber} - {booking.roomType}
              </p>
              <p>
                <strong>Fechas:</strong> {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Servicios */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Servicios Adicionales
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
              {availableServices.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay servicios disponibles</p>
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
          <div className="mb-6">
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
              Si está marcado, la factura se recalculará basándose en los servicios seleccionados
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingHistoryModal;

