import React, { useEffect, useState } from "react";
import {
  createBooking,
  GetUserDetails,
  validateCardPayment,
  processBookingPayment,
  updateRoom,
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
    if (Object.values(form).some((v) => !v.trim())) {
      return toast.error("Complete all fields");
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

      setProcessingPayment(true);

      setTimeout(async () => {
        // Crear la reserva
        const booking = await createBooking({
          roomId: selectedRoom.roomId,
          userId,
          checkIn: info.startDate,
          checkOut: info.endDate,
        });

        await processBookingPayment({
          clientName: form.fullName,
          clientEmail: form.email,
          subtotal,
          iva,
          total: deposit,
          paymentMethodId: 1,
          bookingId: booking.data.data.id,
        });

        // 🚀 Cambiar habitación a RESERVED
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
      toast.error(err?.response?.data || "Error processing payment");
      console.log(err);
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

      <button
        onClick={handlePay}
        className="w-full mt-8 bg-[#d4bf92] hover:bg-[#c6ae7b] py-3 rounded-md font-medium"
      >
        Pay
      </button>
    </div>
  );
};

export default CheckoutForm;
