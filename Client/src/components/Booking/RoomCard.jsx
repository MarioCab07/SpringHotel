import React from "react";
import { FaStar, FaBath, FaParking, FaUtensils } from "react-icons/fa";
import { MdWifi } from "react-icons/md";

const RoomCard = ({ room = {}, setShowBookingModal, setSelectedRoom }) => {
  const handleBooking = () => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-all">
      {/* 🖼 Imagen */}
      <img
        src={
          room.roomType?.imageUrl ||
          "https://images.unsplash.com/photo-1590490350335-4043dc518d89?auto=format&fit=crop&w=900&q=80"
        }
        alt={room.roomType?.name || "Room"}
        className="w-full md:w-[300px] h-[200px] object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
      />

      {/* 📄 Contenido */}
      <div className="flex-1 flex flex-col justify-between p-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {room.roomType?.name || "Deluxe Room"}
          </h2>

          <p className="text-gray-700 text-sm">
            {room.roomType?.description || "With private balcony and garden view"}
          </p>

          <p className="text-gray-800 text-sm">2 Adults, 0 Children</p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
              <FaBath /> 1 bathroom
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
              <MdWifi /> Free WiFi
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
              <FaParking /> Free Parking
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
              <FaUtensils /> Kitchen
            </span>
          </div>
        </div>

        {/* ⭐ Rating + Precio + Botón */}
        <div className="flex flex-col items-end justify-between gap-3 mt-4 md:mt-0 md:ml-6">
          <div className="flex items-center gap-2">
            <FaStar className="text-[#bfa166] text-lg" />
            <span className="text-gray-900 font-medium text-base">4.8</span>
            <span className="text-gray-400 text-sm">24 ratings</span>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              $160 <span className="text-sm text-gray-600">/ night</span>
            </p>
          </div>

          <button
            onClick={handleBooking}
            className="bg-[#d6c083] hover:bg-[#c2aa68] text-white font-medium px-6 py-2 rounded-md shadow-sm transition"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
