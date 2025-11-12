import React, { useState, useMemo, useEffect } from "react";
import RoomCard from "../components/Booking/RoomCard";
import BookingSearchBar from "../components/Booking/BookingSearchBar";
import UserMenu from "../components/UserMenu";
import { getAllRooms } from "../service/api.services";
import { toast } from "react-toastify";
import PaymentPage from "../pages/PaymentPage";
import InvoiceComponent from "../components/Invoice/InvoiceComponent";

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

  // 🔹 Imágenes por tipo
  const imagesUrl = {
    Suite:
      "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
    "Double Room":
      "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
    "Single Room":
      "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
  };

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms();
      if (response.status === 200) {
        // 🔹 Mapeamos las habitaciones con sus imágenes
        const _rooms = response.data.data.map((room) => ({
          ...room,
          roomType: {
            ...room.roomType,
            imageUrl:
              imagesUrl[room.roomType.name] ||
              "https://placehold.co/260x180?text=Room+Image",
          },
        }));

        // 🔹 Seleccionamos solo una de cada tipo: Suite, Double Room, Single Room
        const uniqueRooms = [];
        const seenTypes = new Set();

        for (const room of _rooms) {
          const name = room.roomType.name;
          if (
            (name.includes("Suite") ||
              name.includes("Double") ||
              name.includes("Single")) &&
            !seenTypes.has(name)
          ) {
            uniqueRooms.push(room);
            seenTypes.add(name);
          }
        }

        // 🔹 Solo mostrar las tres habitaciones principales
        setRooms(uniqueRooms.slice(0, 3));
      }
    } catch (error) {
      toast.error("Failed to fetch rooms. Please try again later.");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const [filters, setFilters] = useState({
    orderBy: { value: "price_low_high", label: "Price: Low to High" },
  });

  const filteredRooms = useMemo(() => {
    let result = rooms;
    switch (filters.orderBy.value) {
      case "price_low_high":
        result.sort((a, b) => a.roomType.price - b.roomType.price);
        break;
      case "price_high_low":
        result.sort((a, b) => b.roomType.price - a.roomType.price);
        break;
      default:
        break;
    }
    return result;
  }, [filters, rooms]);

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
          <section
            className="relative w-full h-[340px] bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage:
                "url('https://www.barcelo.com/pinamar/wp-content/uploads/sites/91/2023/02/hotel-room-banner.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white text-5xl font-serif tracking-wide text-center">
                Book your stay in Lumé
              </h2>
            </div>
          </section>

          {/* Search Bar */}
          <div className="relative z-20 flex justify-center mt-[-2.5rem]">
            <BookingSearchBar setInfo={setInfo} onFilterChange={setFilters} />
          </div>

          {/* Room List */}
          <main className="max-w-6xl mx-auto px-6 py-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Explore rooms
            </h3>
            {filteredRooms.length > 0 ? (
              <div className="space-y-8">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.roomId}
                    room={room}
                    info={info}
                    setShowBookingModal={setShowBookingModal}
                    setSelectedRoom={setSelectedRoom}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No rooms available for the selected criteria.
              </p>
            )}
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
