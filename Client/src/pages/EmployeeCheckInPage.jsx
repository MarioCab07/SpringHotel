import React, { useState } from "react";
import {
  getBookingById,
  GetUser,
  getRoomById,
  updateBooking,
  updateRoom,
  validateCardPayment,
  processCheckInPayment,
} from "../service/api.services";

import { toast } from "react-toastify";
import PaymentProcessing from "../components/Booking/PaymentProcessing";
import PaymentProcessingCash from "../components/Booking/PaymentProcessingCash";
import AdminBanner from "../components/Admin/AdminBanner"; 
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const EmployeeCheckInPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [processing, setProcessing] = useState(null);

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
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
      if (b.status !== "PENDING")
        return toast.error("Solo puedes buscar reservas con estado PENDING");

      const resUser = await GetUser(b.userId);
      const resRoom = await getRoomById(b.roomId);

      setBooking(b);
      setUser(resUser.data.data);
      setRoom(resRoom.data.data);
    } catch {
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
      setProcessing("cash");
      await updateBookingToActive();
      await updateRoomToOccupied();
      setTimeout(() => (window.location.href = "/employee"), 2500);
    } catch {
      setProcessing(null);
      toast.error("Error con pago en efectivo");
    }
  };

  const handleCardPayment = async () => {
    try {
      if (!card.number || !card.expiry || !card.cvv)
        return toast.error("Debe llenar todos los datos");

      const [month, yearShort] = card.expiry.split("/");
      const year = "20" + yearShort;

      await validateCardPayment({
        cardNumber: card.number.replace(/\s/g, ""),
        month: parseInt(month),
        year: parseInt(year),
        cvv: card.cvv,
      });

      setProcessing("card");

      await processCheckInPayment({
        clientName: user.fullName,
        clientEmail: user.email,
        subtotal,
        iva,
        total,
        paymentMethodId: 1,
        bookingId: booking.id,
        reason: "Check-In",
      });

      await updateBookingToActive();
      await updateRoomToOccupied();

      setTimeout(() => (window.location.href = "/employee"), 2500);
    } catch {
      setProcessing(null);
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

  const pricePerNight = room ? room.roomType.price : 0;
  const totalReservationPrice = pricePerNight * nights;
  const deposit = 10;
  const remaining = totalReservationPrice - deposit;
  const subtotal = remaining / 1.13;
  const iva = remaining - subtotal;
  const total = remaining;

  return (
    <div className="min-h-screen bg-white px-4 md:px-6 lg:px-8 py-6">

      {}
      {processing === "cash" && <PaymentProcessingCash />}
      {processing === "card" && <PaymentProcessing />}

      {}
      <AdminBanner title="Employee Check-In" showButton={false} />

      {}
      <div className="flex justify-end mt-4 mb-6">
        <button
          onClick={() => (window.location.href = "/employee")}
          className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-white px-7 py-2.5 rounded-full shadow-md transition font-light"
        >
          Back to Menu
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 w-full max-w-xl mx-auto mb-8">
        <div className="flex gap-3 justify-center">
          <input
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
            placeholder="Enter Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <button
            className="bg-[#d4bf92] hover:bg-[#c4af82] transition text-white px-6 py-3 rounded-full font-semibold shadow-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {}
      {booking && user && room && (
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200 max-w-2xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif tracking-wide text-gray-800">
              LUMÉ HOTEL & SUITES
            </h2>
            <div className="h-[2px] bg-[#d4bf92] w-full mt-3"></div>
            <p className="text-sm mt-2 font-medium text-gray-600">
              Booking #{booking.id}
            </p>
          </div>

          {/* INFORMACIÓN */}
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>

            <p className="pt-4"><strong>Room:</strong> {room.roomType.name}</p>
            <p><strong>Room Number:</strong> {room.roomNumber}</p>

            <div className="flex justify-between pt-2">
              <p><strong>Price / Night:</strong> ${pricePerNight}</p>
              <p><strong>Nights:</strong> {nights}</p>
            </div>

            <div className="flex justify-between pt-2">
              <p><strong>Check-in:</strong> {dayjs(booking.checkIn).format("MMM DD, YYYY")}</p>
              <p><strong>Check-out:</strong> {dayjs(booking.checkOut).format("MMM DD, YYYY")}</p>
            </div>

            {/* PAYMENT */}
            <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Breakdown
              </h3>

              <div className="space-y-2 text-[15px]">
                <div className="flex justify-between">
                  <span>Total reservation:</span>
                  <span>${totalReservationPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#b18a3f] font-semibold">
                  <span>Deposit applied:</span>
                  <span>- $10.00</span>
                </div>

                <div className="border-t my-3"></div>

                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>IVA (13%):</span>
                  <span>${iva.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-[18px] pt-2">
                  <span>Total to pay:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES DE PAGO */}
          <div className="flex flex-col mt-8 gap-4">
            <button
              onClick={handleCashPayment}
              className="w-full bg-[#d4bf92] hover:bg-[#b99f6c] transition text-white py-3 rounded-full font-semibold shadow-lg"
            >
              Pago en efectivo
            </button>

            <div className="border p-6 rounded-xl bg-white shadow-inner">
              <p className="font-semibold mb-4 text-gray-700 text-[17px]">
                Pago con tarjeta
              </p>

              <input
                className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
                placeholder="Número de tarjeta"
                onChange={(e) =>
                  setCard({ ...card, number: e.target.value })
                }
              />

              <div className="flex gap-4">
                <input
                  className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
                  placeholder="MM/YY"
                  onChange={(e) =>
                    setCard({ ...card, expiry: e.target.value })
                  }
                />
                <input
                  className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#d4bf92]"
                  placeholder="CVV"
                  onChange={(e) =>
                    setCard({ ...card, cvv: e.target.value })
                  }
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
