import React from "react";

const InvoiceDetailModal = ({ booking, user, onClose }) => {
  if (!booking || !booking.ticket) return null;

  const ticket = booking.ticket;
  const services = booking.services || [];

  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const nights = calculateNights();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-100 p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-serif">FACTURA DETALLADA</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Hotel Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif tracking-wide mb-2">
              LUMÉ HOTEL & SUITES
            </h1>
            <div className="h-[2px] bg-[#d4bf92] w-32 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Factura #{ticket.id}</p>
          </div>

          {/* Booking Info */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Información de la Reserva</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Reserva #</p>
                  <p className="font-semibold">
                    {String(booking.id).padStart(3, "0")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-semibold">{booking.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Habitación</p>
                  <p className="font-semibold">
                    {booking.roomNumber} - {booking.roomType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Noches</p>
                  <p className="font-semibold">{nights}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold">{formatDate(booking.checkOut)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {user && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Información del Cliente</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                <p>
                  <span className="text-sm text-gray-600">Nombre: </span>
                  <span className="font-semibold">{user.fullName || booking.userName}</span>
                </p>
                <p>
                  <span className="text-sm text-gray-600">Email: </span>
                  <span className="font-semibold">{user.email || booking.userEmail}</span>
                </p>
                {user.phoneNumber && (
                  <p>
                    <span className="text-sm text-gray-600">Teléfono: </span>
                    <span className="font-semibold">{user.phoneNumber}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Servicios Adicionales</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 text-sm font-semibold text-gray-700">
                        Servicio
                      </th>
                      <th className="text-right py-2 text-sm font-semibold text-gray-700">
                        Precio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 text-gray-700">
                          {service.serviceName || "Servicio"}
                        </td>
                        <td className="py-3 text-right font-semibold">
                          ${service.price?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoice Details */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Desglose de Facturación</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal Habitación:</span>
                <span className="font-semibold">
                  ${ticket.subtotalRoom?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal Servicios:</span>
                <span className="font-semibold">
                  ${ticket.subtotalServices?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">IVA (10%):</span>
                <span className="font-semibold">
                  ${ticket.iva?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-[#d4a86a]">
                    ${ticket.total?.toFixed(2) || booking.totalPaid?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
            <p>Factura emitida el: {formatDateTime(ticket.issuedAt)}</p>
            <p className="mt-2">Estado: {ticket.status}</p>
            <p className="mt-4 text-gray-400">
              Gracias por elegir Lumé Hotel & Suites
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end sticky bottom-0">
          <button
            onClick={() => window.print()}
            className="bg-[#d4a86a] hover:bg-[#c6ae7b] text-white px-6 py-2 rounded-lg font-medium mr-4 transition"
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;

