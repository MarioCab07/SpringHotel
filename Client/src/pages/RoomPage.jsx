import React, { useState, useEffect } from "react";
import RoomCard from "../components/Booking/RoomCard";
import BookingSearchBar from "../components/Booking/BookingSearchBar";
import UserMenu from "../components/UserMenu";
import PaymentPage from "../pages/PaymentPage";
import InvoiceComponent from "../components/Invoice/InvoiceComponent";
import exploreBg from "../assets/backgrounds/explore.jpg";
import { getAllRooms } from "../service/api.services";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);

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
    loadRooms(); 
  };

  const loadRooms = async () => {
    try {
      const res = await getAllRooms();
      const data = res.data.data || [];

      setAllRooms(data);

      const available = data.filter((room) => room.roomStatus === "AVAILABLE");
      const grouped = Object.values(
        available.reduce((acc, room) => {
          if (!acc[room.roomType.id]) acc[room.roomType.id] = room;
          return acc;
        }, {})
      );

      const roomsWithImage = grouped.map((room) => {
        let img = "";

        switch (room.roomType.name) {
          case "Single Room":
            img =
              "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg";
            break;
          case "Double Room":
            img =
              "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg";
            break;
          case "Suite":
            img =
              "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg";
            break;
          default:
            img =
              "https://images.unsplash.com/photo-1590490350335-4043dc518d89?auto=format";
        }

        return {
          ...room,
          roomType: {
            ...room.roomType,
            imageUrl: img,
          },
        };
      });

      setRooms(roomsWithImage);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  useEffect(() => {
    loadRooms();
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

          {}
          <section className="flex justify-center mt-6">
            <div
              className="relative w-[92%] max-w-6xl h-[320px] rounded-3xl overflow-hidden bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${exploreBg})` }}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h2 className="text-white text-5xl font-serif tracking-wide text-center drop-shadow-lg">
                  Book your stay in Lumé
                </h2>
              </div>
            </div>
          </section>

          {}
          <div className="relative z-20 flex justify-center mt-[-2.5rem]">
            <BookingSearchBar setInfo={setInfo} />
          </div>

          {}
          <main className="max-w-6xl mx-auto px-6 py-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Explore rooms
            </h3>

            <div className="space-y-8">
              {rooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  allRooms={allRooms}
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
