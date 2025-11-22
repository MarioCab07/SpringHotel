import React, { useEffect, useState } from "react";
import {
  getAllBookingHistory,
} from "../service/api.services";
import { toast } from "react-toastify";
import BookingHistoryDetailPanel from "../components/Admin/BookingHistoryDetailPanel";

const AdminBookingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyRes = await getAllBookingHistory();
      
      const fetched = historyRes.data.data || [];
      setHistory(fetched);
      setFilteredHistory(fetched);
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

  // Búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(history);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = history.filter((booking) => {
      const bookingId = String(booking.id).toLowerCase();
      const userName = (booking.userName || "").toLowerCase();
      const userEmail = (booking.userEmail || "").toLowerCase();
      const roomNumber = String(booking.roomNumber || "").toLowerCase();
      const checkIn = formatDate(booking.checkIn).toLowerCase();
      const checkOut = formatDate(booking.checkOut).toLowerCase();

      return (
        bookingId.includes(term) ||
        userName.includes(term) ||
        userEmail.includes(term) ||
        roomNumber.includes(term) ||
        checkIn.includes(term) ||
        checkOut.includes(term)
      );
    });

    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  const openDetailPanel = (booking) => {
    setSelectedBooking(booking);
    setShowDetailPanel(true);
  };

  const closeDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedBooking(null);
  };

  const handleDetailSuccess = () => {
    setShowDetailPanel(false);
    setSelectedBooking(null);
    loadHistory();
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
      <div className="flex items-center justify-center text-lg py-8">
        <div>Cargando historial de reservas...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Búsqueda */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search by ID, name, email, room number or date:
        </label>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      {history.length === 0
                        ? "No hay registros en el historial"
                        : "No se encontraron resultados"}
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => openDetailPanel(booking)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{String(booking.id).padStart(3, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{booking.userName}</div>
                          <div className="text-gray-500 text-xs">{booking.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{booking.roomNumber}</div>
                          <div className="text-gray-500 text-xs">{booking.roomType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>In: {formatDate(booking.checkIn)}</div>
                          <div>Out: {formatDate(booking.checkOut)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.services && booking.services.length > 0 ? (
                          <div className="max-w-xs">
                            {booking.services.slice(0, 2).map((s, idx) => (
                              <div key={idx} className="text-xs">
                                {s.serviceName} (${s.price?.toFixed(2)})
                              </div>
                            ))}
                            {booking.services.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{booking.services.length - 2} más
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No services</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.totalPaid?.toFixed(2) || booking.ticket?.total?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Panel de detalles */}
      {showDetailPanel && selectedBooking && (
        <BookingHistoryDetailPanel
          isOpen={showDetailPanel}
          booking={selectedBooking}
          onClose={closeDetailPanel}
          onSuccess={handleDetailSuccess}
        />
      )}
    </div>
  );
};

export default AdminBookingHistoryPage;

