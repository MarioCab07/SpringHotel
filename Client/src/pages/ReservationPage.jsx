import React, { useEffect, useState } from "react";
import {
  getAllBookings,
  getRoomById,
  updateBooking,
  deleteBooking
} from "../service/api.services";
import { toast } from "react-toastify";
import logo from "../assets/Logo.png";

const ReservationsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [searchId, setSearchId] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      const rawBookings = res.data.data;

      const enriched = await Promise.all(
        rawBookings.map(async (b) => {
          let roomType = "N/A";
          let roomNumber = "N/A";

          try {
            const roomRes = await getRoomById(b.roomId);
            roomType = roomRes.data.data.roomType?.name || "Sin tipo";
            roomNumber = roomRes.data.data.roomNumber || "N/A";
          } catch (error) {
            console.error(`Error cargando habitación ${b.roomId}:`, error);
          }

          return {
            ...b,
            roomType,
            roomNumber,
            checkIn: b.startDate || b.checkIn,
            checkOut: b.endDate || b.checkOut,
          };
        })
      );

      setBookings(enriched);
    } catch (err) {
      toast.error("Error al cargar reservaciones");
      console.error("Error cargando reservaciones:", err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBooking(bookingId, {
        bookingId: bookingId,
        status: newStatus,
      });
      toast.success("Estado actualizado correctamente");

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      toast.error("Error actualizando estado");
      console.error("Error actualizando estado:", err);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("¿Seguro que deseas borrar esta reserva?")) return;
    try {
      await deleteBooking(bookingId);
      toast.success("Reserva eliminada correctamente");
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      toast.error("Error al borrar reserva");
      console.error("Error al borrar reserva:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No definida";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) =>
    searchId === "" ? true : booking.id.toString() === searchId
  );

  return (
    <div className="min-h-screen bg-[#D6ECF7] py-12">
      <header className="flex justify-start items-center px-8 py-4">
        <img src={logo} alt="Hotel Logo" className="w-40 h-auto" />
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Todas las Reservas</h1>

        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Buscar por ID exacto..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-72"
          />
        </div>

        {filteredBookings.length === 0 ? (
          <p className="text-center text-gray-600">No hay reservas encontradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead className="bg-[#f2789f] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Habitación</th>
                  <th className="px-6 py-3 text-left">Tipo</th>
                  <th className="px-6 py-3 text-left">Check-In</th>
                  <th className="px-6 py-3 text-left">Check-Out</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{booking.id}</td>
                    <td className="px-6 py-4">{booking.roomNumber}</td>
                    <td className="px-6 py-4">{booking.roomType}</td>
                    <td className="px-6 py-4">{formatDate(booking.checkIn)}</td>
                    <td className="px-6 py-4">{formatDate(booking.checkOut)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value)
                        }
                        className="border rounded p-1 text-sm"
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="CANCELLED">Cancelado</option>
                        <option value="ACTIVE">Activo</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReservationsPage;
