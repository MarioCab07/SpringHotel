import React from "react";

const ConfirmDeleteModal = ({ booking, onClose, onConfirm }) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-200">
          <h2 className="text-2xl font-semibold text-red-800">
            Confirmar Eliminación
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar este registro del historial?
            Esta acción no se puede deshacer.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Reserva:</strong> #{String(booking.id).padStart(3, "0")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Cliente:</strong> {booking.userName}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Habitación:</strong> {booking.roomNumber} - {booking.roomType}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fechas:</strong> {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Se eliminarán también los servicios asociados y la factura (si existe).
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

