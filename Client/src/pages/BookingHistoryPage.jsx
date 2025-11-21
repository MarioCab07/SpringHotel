import React, { useEffect, useState } from "react";
import {
  GetUserDetails,
  getBookingHistory,
} from "../service/api.services";
import UserMenu from "../components/UserMenu";
import { toast } from "react-toastify";
import InvoiceDetailModal from "../components/Invoice/InvoiceDetailModal";

const BookingHistoryPage = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Filtros
  const [dateFilter, setDateFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const loadHistory = async () => {
    try {
      const userRes = await GetUserDetails();
      const userId = userRes.data.data.userId;
      setUser(userRes.data.data);

      const historyRes = await getBookingHistory(userId);
      const fetched = historyRes.data.data || [];
      
      // Ordenar por fecha de check-out descendente (más recientes primero)
      const sorted = fetched.sort((a, b) => {
        const dateA = new Date(b.checkOut);
        const dateB = new Date(a.checkOut);
        return dateA - dateB;
      });

      setHistory(sorted);
      setFilteredHistory(sorted);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Error al cargar el historial de reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...history];

    // Filtro por fecha (check-in o check-out)
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((item) => {
        const checkIn = new Date(item.checkIn);
        const checkOut = new Date(item.checkOut);
        return (
          checkIn.toDateString() === filterDate.toDateString() ||
          checkOut.toDateString() === filterDate.toDateString()
        );
      });
    }

    // Filtro por tipo de servicio
    if (serviceTypeFilter) {
      filtered = filtered.filter((item) => {
        return item.services?.some(
          (service) =>
            service.serviceName
              ?.toLowerCase()
              .includes(serviceTypeFilter.toLowerCase())
        );
      });
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredHistory(filtered);
  }, [dateFilter, serviceTypeFilter, statusFilter, history]);

  const handleViewInvoice = (booking) => {
    if (booking.ticket) {
      setSelectedInvoice(booking);
      setShowInvoiceModal(true);
    } else {
      toast.info("No hay factura disponible para esta reserva");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Cargando historial de reservas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="py-3">
        <UserMenu />
      </header>

      <div
        className="flex justify-center"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        <h2 className="text-3xl my-8 px-12">Historial de Reservas</h2>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-12 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a86a] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio
              </label>
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a86a] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a86a] focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="ACTIVE">Activa</option>
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>
          {(dateFilter || serviceTypeFilter || statusFilter) && (
            <button
              onClick={() => {
                setDateFilter("");
                setServiceTypeFilter("");
                setStatusFilter("");
              }}
              className="mt-4 text-sm text-[#d4a86a] hover:text-[#c6ae7b] font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="max-w-7xl mx-auto px-12">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {history.length === 0
                ? "No tienes reservas en tu historial"
                : "No se encontraron reservas con los filtros aplicados"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((booking) => (
              <div
                key={booking.id}
                className="bg-white shadow-lg rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif">
                      Reserva #{String(booking.id).padStart(3, "0")}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.roomType} - Habitación {booking.roomNumber}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-in</p>
                    <p className="font-medium">{formatDate(booking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-out</p>
                    <p className="font-medium">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>

                {/* Servicios adicionales */}
                {booking.services && booking.services.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">
                      Servicios Adicionales
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {booking.services.map((service, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-700">
                              {service.serviceName || "Servicio"}
                            </span>
                            <span className="font-medium">
                              ${service.price?.toFixed(2) || "0.00"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Información de factura */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      {booking.ticket ? (
                        <div>
                          <p className="text-sm text-gray-600">
                            Factura emitida: {formatDateTime(booking.ticket.issuedAt)}
                          </p>
                          <p className="text-lg font-bold mt-2">
                            Total: ${booking.totalPaid?.toFixed(2) || booking.ticket.total?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">Sin factura disponible</p>
                      )}
                    </div>
                    {booking.ticket && (
                      <button
                        onClick={() => handleViewInvoice(booking)}
                        className="bg-[#d4a86a] hover:bg-[#c6ae7b] text-white px-6 py-2 rounded-lg font-medium transition"
                      >
                        Ver Factura
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de factura detallada */}
      {showInvoiceModal && selectedInvoice && (
        <InvoiceDetailModal
          booking={selectedInvoice}
          user={user}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingHistoryPage;

