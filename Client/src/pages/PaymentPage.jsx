import React from "react";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import RoomBookingCard from "../components/Booking/RoomBookingCard";
import CheckoutForm from "../components/Booking/PayCheckoutForm";
import { useState, useEffect } from "react";

const PaymentPage = ({
  selectedRoom,
  info,
  setShowBookingModal,
  setShowInvoiceModal,
  setUser,
  setBookingData,
}) => {
  const [total, setTotal] = useState(() => {
    const nights =
      info && info.startDate && info.endDate
        ? Math.max(
            1,
            Math.ceil(
              (new Date(info.endDate) - new Date(info.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;
    return selectedRoom.roomType.price * nights;
  });

  useEffect(() => {
    const nights =
      info && info.startDate && info.endDate
        ? Math.max(
            1,
            Math.ceil(
              (new Date(info.endDate) - new Date(info.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;
    setTotal(selectedRoom.roomType.price * nights);
  }, [info]);

  return (
    <div className="min-h-screen bg-[#d7f0fc] flex flex-col">
      <header className="flex justify-between items-center px-8 py-4">
        <img src={logo} alt="Logo" className="h-28" />
        <UserMenu />
      </header>

      <main className="flex justify-center">
        <div className="w-full max-w-5xl space-y-6 p-4">
          <RoomBookingCard
            total={total}
            selectedRoom={selectedRoom}
            info={info}
          />
          <CheckoutForm
            setUser={setUser}
            setBookingData={setBookingData}
            setShowInvoiceModal={setShowInvoiceModal}
            setShowBookingModal={setShowBookingModal}
            info={info}
            selectedRoom={selectedRoom}
          />
        </div>
      </main>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowBookingModal(false);
        }}
        className="bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-200 mx-auto mt-4"
      >
        Regresar
      </button>
    </div>
  );
};

export default PaymentPage;
