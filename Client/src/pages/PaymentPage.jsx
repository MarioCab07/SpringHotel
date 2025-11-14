import React from "react";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import RoomBookingCard from "../components/Booking/RoomBookingCard";
import CheckoutForm from "../components/Booking/PayCheckoutForm";

const PaymentPage = ({
  selectedRoom,
  info,
  setShowInvoiceModal,
  setShowBookingModal,
  setUser,
  setBookingData,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">

<header className="flex justify-between items-center px-16 py-6 shadow-sm bg-white">
  <h1 className="text-2xl font-serif tracking-wide">
    LUMÉ HOTEL & SUITES
  </h1>
  <UserMenu />
</header>


      {}
      <main className="flex justify-center mt-10 mb-16">
        <div className="max-w-6xl w-full flex justify-between gap-16">

          {}
          <div className="flex-1">
            <RoomBookingCard
              selectedRoom={selectedRoom}
              info={info}
              total={selectedRoom.roomType.price}
            />
          </div>

          {}
          <div className="flex justify-center flex-none">
            <CheckoutForm
              selectedRoom={selectedRoom}
              info={info}
              total={selectedRoom.roomType.price}
              setUser={setUser}
              setBookingData={setBookingData}
              setShowInvoiceModal={setShowInvoiceModal}
              setShowBookingModal={setShowBookingModal}
            />
          </div>

        </div>
      </main>

      {}
      <button
        type="button"
        onClick={() => setShowBookingModal(false)}
        className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] font-medium px-8 py-3 rounded-full shadow-md transition mx-auto mt-10 mb-12"
      >
        Regresar
      </button>

    </div>
  );
};

export default PaymentPage;
