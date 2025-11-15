import React, { useState } from "react";
import { 
  getBookingById,
  GetUser,
  getRoomById,
  updateBooking,
  updateRoom,
  validateCardPayment,
  processCheckInPayment
} from "../service/api.services";
import { toast } from "react-toastify";
import PaymentProcessing from "../components/Booking/PaymentProcessing";

const EmployeeCheckInPage = () => {

  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: ""
  });

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.split("T")[0];
  };

  const handleSearch = async () => {
    try {
      const resBooking = await getBookingById(bookingId);
      const b = resBooking.data.data;

      if (!b) return toast.error("Reserva no encontrada");

      if (b.status !== "PENDING") {
        toast.error("Solo puedes buscar reservas PENDING");
        return;
      }

      const resUser = await GetUser(b.userId);
      const resRoom = await getRoomById(b.roomId);

      setBooking(b);
      setUser(resUser.data.data);
      setRoom(resRoom.data.data);

    } catch (err) {
      toast.error("Error buscando reserva");
    }
  };

  const updateBookingToActive = async () => {
    return await updateBooking(booking.id, {
      userId: booking.userId,
      roomId: booking.roomId,
      checkIn: normalizeDate(booking.checkIn),
      checkOut: normalizeDate(booking.checkOut),
      status: "ACTIVE",
    });
  };

  const updateRoomToOccupied = async () => {
    await updateRoom(room.roomId, {
      roomNumber: room.roomNumber,
      roomType: room.roomType.id,
      roomStatus: "OCCUPIED",
      lastClean: room.lastClean,
    });
  };

  const handleCashPayment = async () => {
    try {
      setProcessing(true);
      await updateBookingToActive();
      await updateRoomToOccupied();

      setTimeout(() => window.location.href = "/employee", 2500);

    } catch (err) {
      setProcessing(false);
      toast.error("Error con pago en efectivo");
    }
  };

  const handleCardPayment = async () => {
    try {
      if (!card.number || !card.expiry || !card.cvv) {
        return toast.error("Debe llenar todos los datos de la tarjeta");
      }

      const [month, yearShort] = card.expiry.split("/");
      const year = "20" + yearShort;

      await validateCardPayment({
        cardNumber: card.number.replace(/\s/g, ""),
        month: parseInt(month),
        year: parseInt(year),
        cvv: card.cvv,
      });

      setProcessing(true);

      await processCheckInPayment({
        clientName: user.fullName,
        clientEmail: user.email,
        subtotal: 0,
        iva: 0,
        total: 0,
        paymentMethodId: 1,
        bookingId: booking.id,
        reason: "Check-In",
      });

      await updateBookingToActive();
      await updateRoomToOccupied();

      setTimeout(() => window.location.href = "/employee", 2500);

    } catch (err) {
      setProcessing(false);
      toast.error("Error pagando con tarjeta");
    }
  };

  const nights = booking
    ? Math.max(
        1,
        Math.ceil(
          (new Date(booking.checkOut) - new Date(booking.checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const total = room ? room.roomType.price * nights : 0;

  const toLocalDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#f4f3f0] flex flex-col items-center p-10">

      {processing && <PaymentProcessing onFinish={() => {}} />}

      {}
      <h1 className="text-4xl font-bold mb-10 text-[#3a3a3a] tracking-wide">
        Employee Check-In
      </h1>

      {}
      <div className="flex gap-3 mb-10 bg-white p-6 shadow-lg rounded-2xl border border-gray-200">
        <input
          className="border border-gray-300 p-3 w-80 rounded-lg focus:ring-2 focus:ring-[#d4bf92] focus:outline-none"
          placeholder="Ingrese Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />
        <button
          className="bg-[#d4bf92] hover:bg-[#c4af82] transition text-white px-8 py-3 rounded-lg font-semibold shadow-md"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      {}
      {booking && user && room && (
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-[650px] border border-[#e8e6e2]">

          {}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif tracking-wide">LUMÉ HOTEL & SUITES</h2>

            <div className="flex justify-between items-center mt-2">
              <div className="h-[2px] bg-[#d4bf92] flex-1 mt-3"></div>
              <p className="text-sm font-medium ml-2">#{booking.id}</p>
            </div>

            <h3 className="text-xl font-semibold mt-6 text-gray-800">
              Booking Information
            </h3>
          </div>

          {}
          <div className="space-y-3 text-gray-700 text-[16px] leading-relaxed">

            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>

            <p className="pt-4"><strong>Type:</strong> {room.roomType.name}</p>

            <p>
              <strong>Room Number:</strong>{" "}
              <span className="font-semibold">{room.roomNumber}</span>
            </p>

            <div className="flex justify-between">
              <p><strong>Price / Night:</strong> ${room.roomType.price}</p>
              <p><strong>Nights:</strong> {nights}</p>
            </div>

            <div className="flex justify-between pt-2">
              <p><strong>Check-in:</strong> {toLocalDate(booking.checkIn)}</p>
              <p><strong>Check-out:</strong> {toLocalDate(booking.checkOut)}</p>
            </div>

            {}
            <div className="mt-6">
              <div className="h-[2px] bg-[#d4bf92] w-full"></div>

              <div className="flex justify-between items-center mt-3 text-[17px]">
                <p className="font-semibold">
                  <span className="text-xl">$</span>{total}
                  <span className="text-sm italic ml-1">Total</span>
                </p>
                <p className="text-sm">{toLocalDate(new Date())}</p>
              </div>
            </div>
          </div>

          {}
          <div className="flex flex-col mt-8 gap-4">

            <button
              onClick={handleCashPayment}
  className="w-full bg-[#d4bf92] hover:bg-[#b99f6c] transition text-white py-3 rounded-full font-semibold shadow-lg"
            >
              Pago en efectivo
            </button>

            <div className="border p-6 rounded-xl bg-[#faf9f7] shadow-inner">
              <p className="font-semibold mb-4 text-gray-700 text-[17px]">
                Pago con tarjeta
              </p>

              <input
                className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
                placeholder="Número de tarjeta"
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
                Pagar con tarjeta
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default EmployeeCheckInPage;
