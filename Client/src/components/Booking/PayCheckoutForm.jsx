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
import { FaCreditCard, FaLock, FaShieldAlt } from "react-icons/fa";

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
  const [focusedField, setFocusedField] = useState("");

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
      toast.error(err?.response?.data || "Error processing payment");
      console.log(err);
    }
  };

  if (processingPayment) {
    return <PaymentProcessing onFinish={() => { }} />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#d4bf92] to-[#c6ae7b] p-6">
        <div className="flex items-center justify-center gap-3 text-white">
          <FaCreditCard className="text-2xl" />
          <h3 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
            Payment Details
          </h3>
        </div>
      </div>

      <div className="p-6 md:p-8">

        {/* Form */}
        <div className="space-y-5 mb-8">

          {/* Cardholder Name */}
          <div className="relative">
            <input
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none ${focusedField === 'fullName'
                ? 'border-[#d4bf92] bg-[#d4bf92]/5'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              placeholder="Cardholder Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField('')}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none ${focusedField === 'email'
                ? 'border-[#d4bf92] bg-[#d4bf92]/5'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              placeholder="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
            />
          </div>

          {/* Card Number */}
          <div className="relative">
            <input
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none ${focusedField === 'cardNumber'
                ? 'border-[#d4bf92] bg-[#d4bf92]/5'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              placeholder="Card Number"
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField('')}
              maxLength="19"
            />
            <FaCreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none ${focusedField === 'expiry'
                  ? 'border-[#d4bf92] bg-[#d4bf92]/5'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                placeholder="MM/YY"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField('')}
                maxLength="5"
              />
            </div>
            <div className="relative">
              <input
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none ${focusedField === 'cvv'
                  ? 'border-[#d4bf92] bg-[#d4bf92]/5'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                placeholder="CVV"
                name="cvv"

                value={form.cvv}
                onChange={handleChange}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField('')}
                maxLength="4"
              />
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

        </div>

        {/* Payment Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">Payment Summary</h4>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>IVA (13%)</span>
              <span className="font-medium">${iva.toFixed(2)}</span>
            </div>

            <div className="border-t-2 border-gray-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Deposit</span>
                <span className="text-2xl font-bold text-[#d4bf92]" style={{ fontFamily: '"Playfair Display", serif' }}>
                  ${deposit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-[#d4bf92] to-[#c6ae7b] hover:from-[#c6ae7b] hover:to-[#b89d6c] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Complete Payment
        </button>

      </div>
    </div>
  );
};

export default CheckoutForm;
