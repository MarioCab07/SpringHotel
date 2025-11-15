import {
  FaMapMarkerAlt,
  FaClock,
  FaUserFriends,
} from "react-icons/fa";

const RoomBookingCard = ({ selectedRoom, info }) => {
  const nights =
    Math.ceil(
      (new Date(info.endDate) - new Date(info.startDate)) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const pricePerNight = selectedRoom?.roomType?.price || 0;
  const total = pricePerNight * nights;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex gap-10 w-[900px] mx-auto">

      {/* Room Image */}
      <img
        src={selectedRoom?.roomType?.imageUrl}
        alt="Room"
        className="w-96 h-64 object-cover rounded-lg shadow-md"
      />

      <div className="flex flex-col justify-between flex-1">
        <div>

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-2">
            {selectedRoom?.roomType?.name}
          </h2>

          {/* 🔥 Room Number */}
          <p className="text-gray-700 text-sm font-medium mb-3">
            Room Number:{" "}
            <span className="font-semibold">
              {selectedRoom?.roomNumber}
            </span>
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {selectedRoom?.roomType?.description}
          </p>

          <div className="text-sm text-gray-600 space-y-3">
            <div className="flex items-center gap-2">
              <FaClock />
              <span>
                {nights} night(s): {formatDate(info.startDate)} →{" "}
                {formatDate(info.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FaUserFriends />
              <span>{info.adults + info.children} guests</span>
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>Lumé Hotel & Suites, San Salvador</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-lg font-semibold">
              ${pricePerNight}
              <span className="text-sm text-gray-500"> / night</span>
            </p>

            <p className="font-semibold mt-1 text-[17px]">
              ${total}
              <span className="text-sm text-gray-600"> Total</span>
            </p>
          </div>

          {/* Amenities */}
          <div className="flex gap-4 mt-6">
            <div className="px-5 py-2 bg-[#f4f4f4] text-gray-700 rounded-full text-sm shadow-sm">
              1 bathroom
            </div>

            <div className="px-5 py-2 bg-[#f4f4f4] text-gray-700 rounded-full text-sm shadow-sm">
              Free Parking
            </div>

            <div className="px-5 py-2 bg-[#f4f4f4] text-gray-700 rounded-full text-sm shadow-sm">
              Kitchen
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomBookingCard;
