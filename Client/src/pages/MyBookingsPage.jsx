import React, { useEffect, useState } from "react";
import {
  GetUserDetails,
  getUserBookings,
  getRoomById,
  cancelBooking,
  modifyBooking,
  getBookingHistory,
} from "../service/api.services";

import UserMenu from "../components/UserMenu";
import ChangeDatesModal from "../components/Booking/ChangeDatesModal";
import ConfirmCancelModal from "../components/Booking/ConfirmCancelModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyBookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [viewMode, setViewMode] = useState("simple"); // "simple" or "history"
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterServiceType, setFilterServiceType] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const navigate = useNavigate();
  const formatDate = (date) => {
    if (!date) return "N/A";
    const [year, month, day] = date.split("T")[0].split("-");
    return new Date(`${month}/${day}/${year}`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const loadBookings = async () => {
    try {
      const userRes = await GetUserDetails();
      const userId = userRes.data.data.userId;
      setUser(userRes.data.data);

      // Cargar historial completo con servicios y facturas
      const historyRes = await getBookingHistory(userId);
      const historyData = historyRes.data.data || [];
      setBookingHistory(historyData);

      // También cargar reservas simples para compatibilidad
      const bookingRes = await getUserBookings(userId);
      const fetched = bookingRes.data.data;

      const roomMap = {};
      for (const b of fetched) {
        if (!roomMap[b.roomId]) {
          const r = await getRoomById(b.roomId);
          roomMap[b.roomId] = r.data.data;
        }
      }

      setRooms(roomMap);
      setBookings(fetched);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Error al cargar las reservas");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadBookings();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getNights = (ci, co) => {
    const start = new Date(ci);
    const end = new Date(co);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);

      toast.success("Reservation cancelled successfully!");

      setLoading(true);
      await loadBookings();
      setLoading(false);

      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not cancel reservation";
      toast.error(msg);
    }
  };

  const openChangeDates = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleSaveDates = async (newDates) => {
    try {
      await modifyBooking(selectedBooking.id, newDates);

      toast.success("Reservation updated successfully!");

      setLoading(true);
      await loadBookings();
      setShowModal(false);
      setSelectedBooking(null);
      setLoading(false);
    } catch (e) {
      const msg =
        e?.message ||
        e?.data?.message ||
        e?.response?.data?.message ||
        "Could not modify reservation";

      toast.error(msg);
    }
  };

  // Filtrar historial
  const filteredHistory = bookingHistory.filter((booking) => {
    if (filterDateFrom) {
      const checkIn = new Date(booking.checkIn);
      const fromDate = new Date(filterDateFrom);
      if (checkIn < fromDate) return false;
    }
    if (filterDateTo) {
      const checkOut = new Date(booking.checkOut);
      const toDate = new Date(filterDateTo);
      if (checkOut > toDate) return false;
    }
    if (filterServiceType) {
      const hasService = booking.services?.some(
        (s) => s.serviceName?.toLowerCase().includes(filterServiceType.toLowerCase())
      );
      if (!hasService) return false;
    }
    return true;
  });

  const handleViewInvoice = (booking) => {
    if (booking.ticket) {
      setSelectedInvoice({ booking, ticket: booking.ticket });
      setShowInvoiceModal(true);
    } else {
      toast.info("No hay factura disponible para esta reserva");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading your reservations...
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="py-3">
        <UserMenu />
      </header>

      <div
        className="flex justify-center items-center gap-4"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        <h2 className="text-3xl my-8 px-12">Reservations</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("simple")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "simple"
                ? "bg-[#172A45] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Simple View
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "history"
                ? "bg-[#172A45] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            History View
          </button>
        </div>
      </div>

      {viewMode === "history" && (
        <div className="max-w-6xl mx-auto px-12 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service Type</label>
              <input
                type="text"
                value={filterServiceType}
                onChange={(e) => setFilterServiceType(e.target.value)}
                placeholder="Filter by service name..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {viewMode === "simple" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-12 mt-10">
          {bookings.map((b) => {
          const room = rooms[b.roomId];
          if (!room) return null;

          const nights = getNights(b.checkIn, b.checkOut);
          const total = nights * room.roomType.price;

          return (
            <div
              key={b.id}
              className="bg-white shadow-lg rounded-xl border border-gray-200 p-10 flex flex-col justify-between min-w-[600px] mx-auto"
            >
              <div>
                <h2 className="font-serif text-xl text-center">
                  LUMÉ HOTEL & SUITES
                </h2>

                <div className="border-t border-[#d4a86a] mt-3 mb-6 w-3/4 mx-auto"></div>

                <p className="text-right text-sm text-gray-600 font-medium">
                  #{String(b.id).padStart(3, "0")}
                </p>

                <h3 className="text-xl text-center font-semibold mt-2">
                  Booking
                </h3>
              </div>

              <div className="mt-8 space-y-4 text-gray-700 text-[15px]">
                <p>
                  <strong>Name:</strong> {user.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {user.phoneNumber}
                </p>
                <p className="pt-4">
                  <strong>Type:</strong> {room.roomType.name}
                </p>
                <p>
                  <strong>Status:</strong> {b.status}
                </p>

                <div className="flex justify-between">
                  <p>
                    <strong>Price / Night:</strong> ${room.roomType.price}
                  </p>
                  <p>
                    <strong>Nights:</strong> {nights}
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <p>
                    <strong>Check-in:</strong> {formatDate(b.checkIn)}
                  </p>
                  <p>
                    <strong>Check-out:</strong> {formatDate(b.checkOut)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-300 mt-6 pt-6 flex justify-between">
                <p className="text-xl font-bold">${total}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(b.createdAt)}
                </p>
              </div>

              <p className="text-center text-gray-700 mt-6 text-sm leading-relaxed">
                Thank you for choosing Lumé Hotel & Suites.
                <br />
                We look forward to your stay.
              </p>

              <div className="mt-6 flex flex-col space-y-3">
                {b.status === "PENDING" && (
                  <button
                    onClick={() => openChangeDates(b)}
                    className="bg-[#D9C696] hover:bg-[#cdb883] text-black font-medium px-6 py-2 rounded-lg transition"
                  >
                    Change Dates
                  </button>
                )}

                {b.status === "ACTIVE" && (
                  <button
                    onClick={() => navigate(`/bookings/${b.id}`)}
                    className="bg-[#172A45] hover:bg-[#1F3A5A] text-white font-medium px-6 py-2 rounded-lg transition"
                  >
                    View more
                  </button>
                )}

                {["PENDING", "CONFIRMED", "ACTIVE"].includes(b.status) && (
                  <button
                    onClick={() => {
                      setBookingToCancel(b.id);
                      setShowCancelModal(true);
                    }}
                    className="bg-[#C96E5E] hover:bg-[#B86254] text-black font-medium px-6 py-2 rounded-lg transition"
                  >
                    Cancel reservation
                  </button>
                )}
              </div>
            </div>
          );
        })}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-12 mt-10">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron reservas</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHistory.map((booking) => {
                const nights = getNights(booking.checkIn, booking.checkOut);
                const roomPrice = rooms[booking.roomId]?.roomType?.price || 0;
                const roomSubtotal = nights * roomPrice;
                const servicesTotal = booking.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
                const total = booking.totalPaid || (roomSubtotal + servicesTotal);

                return (
                  <div
                    key={booking.id}
                    className="bg-white shadow-lg rounded-xl border border-gray-200 p-8"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Reserva #{String(booking.id).padStart(3, "0")}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold mb-2">Información de la Habitación</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Habitación:</strong> {booking.roomNumber || "N/A"}
                          </p>
                          <p>
                            <strong>Tipo:</strong> {booking.roomType || "N/A"}
                          </p>
                          <p>
                            <strong>Noches:</strong> {nights}
                          </p>
                          <p>
                            <strong>Precio por noche:</strong> ${roomPrice}
                          </p>
                          <p>
                            <strong>Subtotal habitación:</strong> ${roomSubtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Servicios Adicionales</h4>
                        {booking.services && booking.services.length > 0 ? (
                          <div className="space-y-2">
                            {booking.services.map((service, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm border-b pb-1"
                              >
                                <span>{service.serviceName || "Servicio"}</span>
                                <span className="font-medium">${(service.price || 0).toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-semibold pt-2">
                              <span>Total Servicios:</span>
                              <span>${servicesTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No hay servicios adicionales</p>
                        )}
                      </div>
                    </div>

                    {booking.ticket && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">Factura #{booking.ticket.id}</h4>
                            <p className="text-sm text-gray-600">
                              Emitida: {new Date(booking.ticket.issuedAt).toLocaleDateString()}
                            </p>
                            <div className="mt-2 text-sm space-y-1">
                              <p>
                                Subtotal Habitación: ${booking.ticket.subtotalRoom?.toFixed(2) || "0.00"}
                              </p>
                              <p>
                                Subtotal Servicios: ${booking.ticket.subtotalServices?.toFixed(2) || "0.00"}
                              </p>
                              <p>IVA: ${booking.ticket.iva?.toFixed(2) || "0.00"}</p>
                              <p className="font-bold text-lg">
                                Total: ${booking.ticket.total?.toFixed(2) || "0.00"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewInvoice(booking)}
                            className="bg-[#172A45] hover:bg-[#1F3A5A] text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Ver Factura
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Total Pagado</p>
                        <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "ACTIVE" && (
                          <button
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                            className="bg-[#172A45] hover:bg-[#1F3A5A] text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Ver más
                          </button>
                        )}
                        {booking.ticket && (
                          <button
                            onClick={() => handleViewInvoice(booking)}
                            className="bg-[#D9C696] hover:bg-[#cdb883] text-black px-4 py-2 rounded-lg text-sm"
                          >
                            Ver Factura
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showModal && selectedBooking && (
        <ChangeDatesModal
          booking={selectedBooking}
          onClose={() => setShowModal(false)}
          onSave={handleSaveDates}
        />
      )}

      {showCancelModal && bookingToCancel && (
        <ConfirmCancelModal
          bookingId={bookingToCancel}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
        />
      )}

      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Factura Detallada</h2>
                <button
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-serif text-center mb-2">
                  LUMÉ HOTEL & SUITES
                </h3>
                <p className="text-center text-gray-600">
                  Factura #{selectedInvoice.ticket.id}
                </p>
                <p className="text-center text-sm text-gray-500 mt-1">
                  Reserva #{String(selectedInvoice.booking.id).padStart(3, "0")}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Información del Cliente</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Nombre:</strong> {user?.fullName || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {user?.phoneNumber || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Detalles de la Reserva</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Habitación:</strong> {selectedInvoice.booking.roomNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {selectedInvoice.booking.roomType || "N/A"}
                    </p>
                    <p>
                      <strong>Check-in:</strong> {formatDate(selectedInvoice.booking.checkIn)}
                    </p>
                    <p>
                      <strong>Check-out:</strong> {formatDate(selectedInvoice.booking.checkOut)}
                    </p>
                    <p>
                      <strong>Noches:</strong>{" "}
                      {getNights(
                        selectedInvoice.booking.checkIn,
                        selectedInvoice.booking.checkOut
                      )}
                    </p>
                  </div>
                </div>

                {selectedInvoice.booking.services &&
                  selectedInvoice.booking.services.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Servicios Adicionales</h4>
                      <div className="space-y-2">
                        {selectedInvoice.booking.services.map((service, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm border-b pb-1"
                          >
                            <span>{service.serviceName || "Servicio"}</span>
                            <span>${(service.price || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Desglose de Facturación</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal Habitación:</span>
                      <span>${selectedInvoice.ticket.subtotalRoom?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal Servicios:</span>
                      <span>
                        ${selectedInvoice.ticket.subtotalServices?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (10%):</span>
                      <span>${selectedInvoice.ticket.iva?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>${selectedInvoice.ticket.total?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>
                    <strong>Fecha de emisión:</strong>{" "}
                    {new Date(selectedInvoice.ticket.issuedAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedInvoice.ticket.status}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-[#172A45] hover:bg-[#1F3A5A] text-white px-6 py-2 rounded-lg"
                >
                  Imprimir
                </button>
                <button
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
