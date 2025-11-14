import React, { useState, useEffect } from "react";
import RoomCard from "../components/Booking/RoomCard";
import BookingSearchBar from "../components/Booking/BookingSearchBar";
import UserMenu from "../components/UserMenu";
import PaymentPage from "../pages/PaymentPage";
import InvoiceComponent from "../components/Invoice/InvoiceComponent";
import exploreBg from "../assets/backgrounds/explore.jpg";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [info, setInfo] = useState({
    startDate: new Date(),
    endDate: new Date(),
    adults: 1,
    children: 0,
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [user, setUser] = useState(null);

  const onClose = () => {
    setShowBookingModal(false);
    setShowInvoiceModal(false);
    setSelectedRoom(null);
    setBookingData(null);
    setUser(null);
  };

  useEffect(() => {
    const fixedRooms = [
      {
        roomId: 1,
        roomType: {
          name: "Single Room",
          description: "A cozy room for one person",
          price: 160,
          imageUrl:
            "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
        },
      },
      {
        roomId: 2,
        roomType: {
          name: "Double Room",
          description: "A spacious room for two people",
          price: 220,
          imageUrl:
            "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
        },
      },
      {
        roomId: 3,
        roomType: {
          name: "Suite",
          description: "A luxurious suite with a living area",
          price: 300,
          imageUrl:
            "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
        },
      },
    ];

    setRooms(fixedRooms);
  }, []);

  return (
    <>
      {!showBookingModal && !showInvoiceModal && (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
          {/* Navbar */}
          <header className="flex justify-between items-center px-12 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-serif tracking-wide">
              LUMÉ HOTEL & SUITES
            </h1>
            <UserMenu />
          </header>
          {/* Hero */}
<section className="flex justify-center mt-6">
  <div
    className="relative w-[92%] max-w-6xl h-[320px] rounded-3xl overflow-hidden bg-cover bg-center shadow-lg"
    style={{
      backgroundImage: `url(${exploreBg})`,
    }}
  >
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
      <h2 className="text-white text-5xl font-serif tracking-wide text-center drop-shadow-lg">
        Book your stay in Lumé
      </h2>
    </div>
  </div>
</section>


          {/* Search Bar */}
          <div className="relative z-20 flex justify-center mt-[-2.5rem]">
            <BookingSearchBar setInfo={setInfo} />
          </div>

          {/* Room List */}
          <main className="max-w-6xl mx-auto px-6 py-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Explore rooms
            </h3>
            <div className="space-y-8">
              {rooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  info={info}
                  setShowBookingModal={setShowBookingModal}
                  setSelectedRoom={setSelectedRoom}
                />
              ))}
            </div>
          </main>
        </div>
      )}

      {showBookingModal && !showInvoiceModal && (
        <PaymentPage
          selectedRoom={selectedRoom}
          info={info}
          setShowBookingModal={setShowBookingModal}
          setShowInvoiceModal={setShowInvoiceModal}
          setUser={setUser}
          setBookingData={setBookingData}
        />
      )}

      {showInvoiceModal && (
        <InvoiceComponent
          booking={bookingData}
          user={user}
          room={selectedRoom}
          info={info}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default RoomPage;
