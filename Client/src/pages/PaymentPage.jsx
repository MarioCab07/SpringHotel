import React, { useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white mb-3 top-0 z-50">
        <UserMenu />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="relative mb-12">
          {/* Back Button - Positioned on the left */}
          <button
            type="button"
            onClick={() => setShowBookingModal(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 group flex items-center gap-2 text-gray-700 hover:text-[#d4bf92] transition-all duration-300 font-medium"
          >
            <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Rooms</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
              Complete Your Reservation
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          <div className="lg:col-span-2">
            <RoomBookingCard
              selectedRoom={selectedRoom}
              info={info}
              total={selectedRoom?.roomType?.price}
            />
          </div>

          {/* Payment Form - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
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

        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          {roomTypeId ? (
            <ReviewsList roomTypeId={roomTypeId} />
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500">No room data available to load reviews.</p>
            </div>
          )}
        </div>

      </main>

      {/* Footer Spacing */}
      <div className="h-16"></div>

    </div>
  );
};

export default PaymentPage;
