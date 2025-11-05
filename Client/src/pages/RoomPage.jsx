import React, { useState, useMemo, useEffect } from "react";
import RoomCard from "../components/Booking/RoomCard";
import logo from "../assets/Logo.png";
import BookingSearchBar from "../components/Booking/BookingSearchBar";
import SearchFilters from "../components/SearchFilters";
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

  const imagesUrl = {
    Suite:
      "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
    "Double Room":
      "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
    "Single Room":
      "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
  };

  const fecthRooms = async () => {
    try {
      const response = await getAllRooms();
      if (response.status === 200) {
        const _rooms = response.data.data.map((room) => {
          return {
            ...room,
            roomType: {
              ...room.roomType,
              imageUrl:
                imagesUrl[room.roomType.name] ||
                "https://placehold.co/260x180?text=Room+Image",
            },
          };
        });
        setRooms(_rooms);
      }
    } catch (error) {
      toast.error("Failed to fetch rooms. Please try again later.");
    }
  };

  useEffect(() => {
    fecthRooms();
  }, []);

  const [filters, setFilters] = useState({
    priceRange: [50, 500],
    orderBy: { value: "price_low_high", label: "Price: Low to High" },
  });

  const filteredRooms = useMemo(() => {
    let result = rooms.filter((room) => {
      const { price, name } = room.roomType;
      const { adults, children } = info;

      const inPriceRange =
        price >= filters.priceRange[0] && price <= filters.priceRange[1];

      let show = false;

      if (adults === 1 && children === 0) {
        show = true; // Mostrar todas
      } else if (adults === 2 && children === 0) {
        show = name.includes("Double") || name.includes("Suite");
      } else if (children > 0 || (adults > 2)) {
        show = name.includes("Suite");
      }

      return inPriceRange && show;
    });

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
  }, [filters, rooms, info]);

  return (
    <>
      {!showBookingModal && !showInvoiceModal && (
        <div className="min-h-screen bg-[#D6ECF7]">
          {/* Header */}
          <header className="flex justify-between items-center px-6 pt-3 pb-1">
            <img src={logo} alt="Hotel Logo" className="w-40 h-auto" />
            <UserMenu />
          </header>

          {/* Search Bar + Filters */}
          <section className="flex flex-col lg:flex-row justify-center lg:justify-between items-start gap-4 px-4 max-w-6xl mx-auto mb-6">
            <div className="flex-1 flex justify-center lg:justify-start">
              <BookingSearchBar setInfo={setInfo} />
            </div>
            <div className="flex justify-center lg:justify-end">
              <SearchFilters onFilterChange={setFilters} />
            </div>
          </section>

          {/* Room List */}
          <main className="max-w-6xl mx-auto px-4 space-y-6 pb-10">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  info={info}
                  setShowBookingModal={setShowBookingModal}
                  setSelectedRoom={setSelectedRoom}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">
                No hay habitaciones disponibles para los criterios seleccionados.
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