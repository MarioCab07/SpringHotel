import React, { useEffect } from "react";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import RoomBookingCard from "../components/Booking/RoomBookingCard";
import CheckoutForm from "../components/Booking/PayCheckoutForm";

import ReviewsList from "../components/Reviews/ReviewList";

const PaymentPage = ({
  selectedRoom,
  info,
  setShowInvoiceModal,
  setShowBookingModal,
  setUser,
  setBookingData,
}) => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 
    const t = setTimeout(() => window.scrollTo(0, 0), 80);
    return () => clearTimeout(t);
  }, []);

  const roomTypeId =
    selectedRoom && selectedRoom.roomType && selectedRoom.roomType.id
      ? selectedRoom.roomType.id
      : null;

  return (
    <div className="bg-white flex flex-col">

      <header className="py-3">
        <UserMenu />
      </header>

      <main className="flex justify-center mt-10 mb-16">
        <div className="max-w-6xl w-full flex justify-between gap-16 ">

          <div className="flex-1">
            <RoomBookingCard
              selectedRoom={selectedRoom}
              info={info}
              total={selectedRoom?.roomType?.price}
            />
          </div>

          <div className="flex justify-center flex-none">
            <CheckoutForm
              selectedRoom={selectedRoom}
              info={info}
              total={selectedRoom?.roomType?.price}
              setUser={setUser}
              setBookingData={setBookingData}
              setShowInvoiceModal={setShowInvoiceModal}
              setShowBookingModal={setShowBookingModal}
            />
          </div>

        </div>
      </main>

      <button
        type="button"
        onClick={() => setShowBookingModal(false)}
        className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] font-medium px-8 py-3 rounded-full shadow-md transition mx-auto mb-4"
      >
        Return 
      </button>

      <div className="w-full bg-[#f8fafc] py-10">
        <div className="max-w-6xl mx-auto px-4">
          {roomTypeId ? (
            <ReviewsList roomTypeId={roomTypeId} />
          ) : (
            <div className="text-center text-gray-500">
              No se encontraron datos de la habitación para cargar reseñas.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PaymentPage;
