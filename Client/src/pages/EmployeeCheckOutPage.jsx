import React, { useState } from "react";
import {
  getBookingById,
  GetUser,
  getRoomById,
  updateBooking,
  updateRoom,
  validateCardPayment,
  getBookingServices
} from "../service/api.services";

import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const EmployeeCheckOutPage = () => {
  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  const normalizeDate = (dateStr) => dateStr?.split("T")[0];

  const handleSearch = async () => {
    try {
      const resBooking = await getBookingById(bookingId);
      const b = resBooking.data.data;

      if (!b) return toast.error("Reserva no encontrada.");
      if (b.status !== "ACTIVE")
        return toast.error("Solo puedes buscar reservas ACTIVAS.");

      const resUser = await GetUser(b.userId);
      const resRoom = await getRoomById(b.roomId);

      setBooking(b);
      setUser(resUser.data.data);
      setRoom(resRoom.data.data);

      let servicios = [];

      try {
        const srv = await getBookingServices(b.id);

        if (Array.isArray(srv.data)) {
          servicios = srv.data.map((s) => ({
            name: s.serviceName,
            price: s.price ?? 0
          }));
        }
      } catch (err) {
        servicios = [];
      }

      setServices(servicios);
    } catch (err) {
      toast.error("Error buscando reserva.");
    }
  };

  const total = services.reduce((sum, s) => sum + s.price, 0);
  const subtotal = total / 1.13;
  const iva = total - subtotal;

  const updateBookingToCancelled = async () => {
    return await updateBooking(booking.id, {
      userId: booking.userId,
      roomId: booking.roomId,
      checkIn: normalizeDate(booking.checkIn),
      checkOut: normalizeDate(booking.checkOut),
      status: "CANCELLED"
    });
  };

  const updateRoomToAvailable = async () => {
    return await updateRoom(room.roomId, {
      roomNumber: room.roomNumber,
      roomType: room.roomType.id,
      roomStatus: "AVAILABLE",
      lastClean: room.lastClean
    });
  };

  const handleEmptyServicesCheckout = async () => {
    try {
      await updateBookingToCancelled();
      await updateRoomToAvailable();
      navigate("/employee");
    } catch (err) {
      toast.error("Error realizando el check-out");
    }
  };

  const handleCashPayment = async () => {
    try {
      await updateBookingToCancelled();
      await updateRoomToAvailable();
      navigate("/employee");
    } catch (err) {
      toast.error("Error con pago en efectivo");
    }
  };

  const handleCardPayment = async () => {
    try {
      if (!card.number || !card.expiry || !card.cvv)
        return toast.error("Debe completar los datos de la tarjeta.");

      const [month, yearShort] = card.expiry.split("/");
      const year = "20" + yearShort;

      await validateCardPayment({
        cardNumber: card.number.replace(/\s/g, ""),
        month: parseInt(month),
        year: parseInt(year),
        cvv: card.cvv
      });

      await updateBookingToCancelled();
      await updateRoomToAvailable();

      navigate("/employee");
    } catch (err) {
      toast.error("Error pagando con tarjeta");
    }
  };

  return (
    <div className="min-h-screen bg-[#eee9df] flex flex-col items-center p-10">

      <h1 className="text-4xl font-bold mb-10">Employee Check-Out</h1>

      <div className="flex gap-3 mb-10 bg-white p-6 shadow-lg rounded-xl">
        <input
          className="border p-3 rounded-lg w-80"
          placeholder="Booking ID (Activo)"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Buscar
        </button>
      </div>

      {booking && user && room && (
        <div className="bg-white p-10 rounded-3xl shadow-xl w-[650px]">

          <h2 className="text-2xl font-serif text-center">
            LUMÉ HOTEL & SUITES
          </h2>

          <div className="h-[2px] bg-[#d4bf92] mt-3 mb-3"></div>

          <p><strong>Nombre:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <p className="mt-4"><strong>Habitación:</strong> {room.roomNumber}</p>
          <p><strong>Tipo:</strong> {room.roomType.name}</p>

          <p className="mt-4">
            <strong>Check In:</strong> {dayjs(booking.checkIn).format("MMM DD, YYYY")}
          </p>
          <p>
            <strong>Check Out:</strong> {dayjs(booking.checkOut).format("MMM DD, YYYY")}
          </p>

          <h3 className="text-xl font-semibold mt-6">Servicios Consumidos</h3>

          {services.length === 0 ? (
            <div className="mt-4 flex flex-col items-center">
              <p className="italic text-gray-600 mb-4">
                No hay servicios registrados para esta reserva.
              </p>

              <button
                onClick={handleEmptyServicesCheckout}
                className="bg-[#d4bf92] hover:bg-[#b99f6c] transition text-white 
                           py-3 px-10 rounded-full font-semibold shadow-lg"
              >
                Realizar Check-Out
              </button>
            </div>
          ) : (
            <>
              <table className="w-full mt-3">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Servicio</th>
                    <th className="py-2 text-right">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{s.name}</td>
                      <td className="py-2 text-right">${s.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 p-6 bg-[#f7f6f3] rounded-xl">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (13%):</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">

                {}
                <button
                  onClick={handleCashPayment}
                  className="w-full bg-[#d4bf92] hover:bg-[#b99f6c] transition text-white py-3 rounded-full font-semibold shadow-lg"
                >
                  Pago en Efectivo
                </button>

                {}
                <div className="border p-6 rounded-xl bg-[#faf9f7] shadow-inner">
                  <p className="font-semibold mb-4 text-gray-700 text-[17px]">
                    Pago con Tarjeta
                  </p>

                  <input
                    className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
                    placeholder="Número de Tarjeta"
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                  />

                  <div className="flex gap-4">
                    <input
                      className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
                      placeholder="MM/YY"
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    />

                    <input
                      className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
                      placeholder="CVV"
                      onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleCardPayment}
                    className="w-full bg-[#d4bf92] hover:bg-[#b99f6c] transition text-white py-3 rounded-full font-semibold shadow-lg"
                  >
                    Pagar con Tarjeta
                  </button>
                </div>

              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default EmployeeCheckOutPage;
