import React, { useEffect, useState } from "react";
import { GetUserDetails, getUserBookings, getRoomById } from "../service/api.services";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";

const MyBookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userRes = await GetUserDetails();
        const userId = userRes.data.data.userId;
        setUser(userRes.data.data);

        const bookingRes = await getUserBookings(userId);
        const fetchedBookings = bookingRes.data.data;

        const roomMap = {};
        for (const booking of fetchedBookings) {
          if (!roomMap[booking.roomId]) {
            const roomRes = await getRoomById(booking.roomId);
            roomMap[booking.roomId] = roomRes.data.data;
          }
        }

        setRooms(roomMap);
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error cargando reservas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toLocalDateString = (dateInput) => {
    const d = new Date(dateInput);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-[#D6ECF7] py-12">
      <header className="flex justify-between items-center px-8 py-4">
        <img src={logo} alt="Hotel Logo" className="w-40 h-auto" />
        <UserMenu />
      </header>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Mis Reservas</h1>

        {loading ? (
          <p className="text-center text-gray-600">Cargando reservas...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600">No tienes reservas aún.</p>
        ) : (
          bookings.map((booking) => {
            const room = rooms[booking.roomId];
            if (!room) return null;

            const nights = getNights(booking.checkIn, booking.checkOut);
            const price = room.roomType.price;
            const total = price * nights;

            return (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
                <header className="bg-[#f2789f] text-white px-8 py-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Reserva #{booking.id}</h2>
                    <p className="text-sm">Estado: {booking.status}</p>
                  </div>
                </header>

                <section className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold border-b pb-2">Información del Cliente</h3>
                      <p><strong>Nombre:</strong> {user.fullName}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Teléfono:</strong> {user.phoneNumber}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold border-b pb-2">Detalles de la Habitación</h3>
                      <p><strong>Tipo:</strong> {room.roomType.name}</p>
                      <p><strong>Descripción:</strong> {room.roomType.description}</p>
                      <p><strong>Precio por noche:</strong> ${price}</p>
                      <p><strong>Noches:</strong> {nights}</p>
                      <p className="font-bold text-lg mt-2">Total: ${total}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold border-b pb-2">Fechas de Reserva</h3>
                      <p><strong>Check-in:</strong> {toLocalDateString(booking.checkIn)}</p>
                    </div>
                    <div>
                      <h3 className="invisible border-b pb-2">.</h3>
                      <p><strong>Check-out:</strong> {toLocalDateString(booking.checkOut)}</p>
                    </div>
                  </div>
                </section>
              {booking.status === 'ACTIVE' && (
                  <div className="px-8 pb-8 flex justify-end">
                    <button
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                      className="bg-[#172A45] hover:bg-[#1F3A5A] text-white font-semibold px-6 py-2 rounded-xl transition"
                    >
                      Ver más
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      {}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => navigate("/rooms")}
          className="bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-200"
        >
          Regresar al menú
        </button>
      </div>
    </div>
  );
};

export default MyBookingsPage;
