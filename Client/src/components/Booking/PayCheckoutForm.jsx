import React, { useEffect, useState } from "react";
import {
  createBooking,
  GetUserDetails,
  validateCardPayment,
  processBookingPayment,
  updateRoom
} from "../../service/api.services";
import { toast } from "react-toastify";
import PaymentProcessing from "./PaymentProcessing";

const CheckoutForm = ({
  selectedRoom,
  info,
  setUser,
  setBookingData,
  setShowInvoiceModal,
  setShowBookingModal,
}) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const deposit = 10;
  const iva = deposit * 0.13;
  const subtotal = deposit - iva;

  const [userId, setUserId] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    GetUserDetails().then((res) => {
      setUser(res.data.data);
      setUserId(res.data.data.userId);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePay = async () => {
    // Limpiar mensaje previo
    setErrorMessage("");

    if (!info.startDate || !info.endDate) {
      const msg = "Debe seleccionar fechas válidas para continuar.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    const start = new Date(info.startDate);
    const end = new Date(info.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const msg = "Las fechas seleccionadas no son válidas.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (start >= end) {
      const msg =
        "La fecha de salida debe ser mayor que la fecha de entrada.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (Object.values(form).some((v) => !v.trim())) {
      const msg = "Debe completar todos los campos antes de continuar.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      // Validación de tarjeta
      await validateCardPayment({
        cardNumber: form.cardNumber.replace(/\s/g, ""),
        month: parseInt(form.expiry.split("/")[0]),
        year: parseInt("20" + form.expiry.split("/")[1]),
        cvv: form.cvv,
      });

      // Procesar pago fake
      await processBookingPayment({
        clientName: form.fullName,
        clientEmail: form.email,
        subtotal,
        iva,
        total: deposit,
        paymentMethodId: 1,
        bookingId: 0,
      });

      // Animación
      setProcessingPayment(true);

      setTimeout(async () => {
        // Crear la reserva
        const booking = await createBooking({
          roomId: selectedRoom.roomId,
          userId,
          checkIn: info.startDate,
          checkOut: info.endDate,
        });

        // Actualizar estado de la habitación
        await updateRoom(selectedRoom.roomId, {
          roomNumber: selectedRoom.roomNumber,
          roomType: selectedRoom.roomType.id,
          roomStatus: "RESERVED",
        });

        setBookingData(booking.data.data);
        setShowInvoiceModal(true);
        setShowBookingModal(false);
        setProcessingPayment(false);
      }, 1800);

    } catch (err) {
      const msg = err?.response?.data || "Error al procesar el pago.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  if (processingPayment) {
    return <PaymentProcessing onFinish={() => {}} />;
  }

  return (
    <div className="w-[380px] bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <h3 className="text-center text-[20px] font-medium tracking-wide mb-8">
        Payment Details
      </h3>

      <div className="space-y-6">
        <input
          className="w-full border-b pb-1"
          placeholder="Cardholder Name"
          name="fullName"
          onChange={handleChange}
        />
        <input
          className="w-full border-b pb-1"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          className="w-full border-b pb-1"
          placeholder="Card Number"
          name="cardNumber"
          onChange={handleChange}
        />

        <div className="flex gap-6">
          <input
            className="w-1/2 border-b pb-1"
            placeholder="MM/YY"
            name="expiry"
            onChange={handleChange}
          />
          <input
            className="w-1/2 border-b pb-1"
            placeholder="CVV"
            name="cvv"
            onChange={handleChange}
          />
        </div>
      </div>

      {}
      <div className="mt-10 px-2">
        <div className="flex justify-between mb-2">
          <span>IVA (13%)</span>
          <span>${iva.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-[18px]">
          <span>Total</span>
          <span>${deposit.toFixed(2)}</span>
        </div>
      </div>

      {}
      {errorMessage && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        onClick={handlePay}
        className="w-full mt-4 py-3 rounded-md font-medium bg-[#d4bf92] hover:bg-[#c6ae7b]"
      >
        Pay
      </button>
    </div>
  );
};

export default CheckoutForm;
