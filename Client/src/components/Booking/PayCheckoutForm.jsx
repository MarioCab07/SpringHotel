import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PayButton from "../Buttons/PayButton";
import { createBooking, GetUserDetails } from "../../service/api.services";
import { toast } from "react-toastify";

const CheckoutForm = ({
  selectedRoom,
  info,
  setShowBookingModal,
  setShowInvoiceModal,
  setBookingData,
  setUser,
}) => {
  const toLocalDateString = (dateInput) => {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    checkIn: toLocalDateString(info.startDate),
    checkOut: toLocalDateString(info.endDate),
    userId: null,
    roomId: selectedRoom.roomId,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await GetUserDetails();

        if (response.status === 200) {
          setUser(response.data.data);
          const id = response.data.data.userId;
          setBookingForm((prev) => {
            return {
              ...prev,
              userId: id,
            };
          });
        }
      } catch (error) {
        toast.error("Debes iniciar sesión para continuar.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayment = async () => {
    const { fullName, email, cardNumber, expiry, cvv } = formData;

    if (!fullName || !email || !cardNumber || !expiry || !cvv) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createBooking(bookingForm);
      console.log(response);

      if (response.status === 201) {
        setShowBookingModal(false);
        setShowInvoiceModal(true);
        setBookingData(response.data.data);
      }
      toast.success("¡Reserva y pago procesados correctamente!");
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Ocurrió un error al procesar la reserva."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#1a1a1a]">
      <h2 className="text-lg font-semibold">Cardholder information</h2>
      <input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        type="text"
        placeholder="Full name"
        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        placeholder="Email address"
        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
      />

      <h2 className="text-lg font-semibold">Card details</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          type="text"
          placeholder="•••• •••• •••• ••••"
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
        <input
          name="expiry"
          value={formData.expiry}
          onChange={handleChange}
          type="text"
          placeholder="MM/YY"
          className="w-full md:w-1/4 px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
        <input
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          type="text"
          placeholder="CVV"
          className="w-full md:w-1/4 px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      <div className="flex justify-end">
        <PayButton onClick={handlePayment} disabled={isSubmitting} />
      </div>
    </div>
  );
};

export default CheckoutForm;
