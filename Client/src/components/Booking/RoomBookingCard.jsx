import {
  FaMapMarkerAlt,
  FaClock,
  FaUserFriends,
  FaBath,
  FaParking,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";

const RoomBookingCard = ({ selectedRoom, info }) => {
  const nights =
    Math.ceil(
      (new Date(info.endDate) - new Date(info.startDate)) /
      (1000 * 60 * 60 * 24)
    ) || 1;

  const pricePerNight = selectedRoom?.roomType?.price || 0;
  const total = pricePerNight * nights;

  // Función para validar si una fecha es válida
  const isValidDate = (date) => {
    const dateObj = new Date(date);
    const timestamp = dateObj.getTime();
    return !isNaN(timestamp) && timestamp > 0;
  };

  const formatDate = (date) => {
    if (!isValidDate(date)) {
      return "Unavailable";
    }
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">

      {/* Room Image with Overlay */}
      <div className="relative h-64 md:h-80 overflow-hidden group">
        <img
          src={selectedRoom?.roomType?.imageUrl}
          alt={selectedRoom?.roomType?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Room Number Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm font-semibold text-gray-800">
            Room <span className="text-[#d4bf92]">#{selectedRoom?.roomNumber}</span>
          </p>
        </div>

        {/* Room Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
            {selectedRoom?.roomType?.name}
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 md:p-8">

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed text-base">
          {selectedRoom?.roomType?.description}
        </p>

        {/* Booking Details */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-6 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-full bg-[#d4bf92]/20 flex items-center justify-center">
              <FaClock className="text-[#d4bf92]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
              <p className="font-semibold">
                {nights} night{nights > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-full bg-[#d4bf92]/20 flex items-center justify-center">
              <FaClock className="text-[#d4bf92]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Check-in / Check-out</p>
              <p className="font-semibold">
                {formatDate(info.startDate)} → {formatDate(info.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-full bg-[#d4bf92]/20 flex items-center justify-center">
              <FaMapMarkerAlt className="text-[#d4bf92]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
              <p className="font-semibold">Lumé Hotel & Suites, San Salvador</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#d4bf92] transition-colors">
              <FaBath className="text-[#d4bf92]" />
              <span className="text-sm text-gray-700">1 Bathroom</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#d4bf92] transition-colors">
              <FaParking className="text-[#d4bf92]" />
              <span className="text-sm text-gray-700">Free Parking</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#d4bf92] transition-colors">
              <FaUtensils className="text-[#d4bf92]" />
              <span className="text-sm text-gray-700">Kitchen</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#d4bf92] transition-colors">
              <FaWifi className="text-[#d4bf92]" />
              <span className="text-sm text-gray-700">Free WiFi</span>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Price per night</span>
            <span className="text-xl font-semibold text-gray-900">${pricePerNight}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#d4bf92]" style={{ fontFamily: '"Playfair Display", serif' }}>
                ${total}
              </p>
              <p className="text-xs text-gray-500">for {nights} night{nights > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoomBookingCard;
