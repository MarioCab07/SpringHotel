import { FaMapMarkerAlt, FaClock, FaUserFriends } from "react-icons/fa";
import {
  MdBathroom,
  MdOutlineWifi,
  MdLocalParking,
  MdKitchen,
} from "react-icons/md";
import BookNowButton from "../Buttons/BookNowButtom";

const RoomBookingCard = ({ selectedRoom, info, total }) => {
  const dateDiff = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const formatDayMonth = (dateInput) => {
    if (!dateInput) return "";
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white w-full rounded-xl shadow-lg p-6 flex gap-6 max-w-5xl relative">
      {}
      <div className="flex flex-col">
        <img
          src="https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg"
          alt="Room"
          className="w-64 h-48 object-cover rounded-lg mb-4"
        />

        <div className="text-sm text-gray-600 space-y-2 pl-1">
          <div className="flex items-center gap-2">
            <FaClock />
            <span>
              {dateDiff(info.startDate, info.endDate)} days stay:{" "}
              {formatDayMonth(info.startDate)} - {formatDayMonth(info.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserFriends />
            <span>{info.adults + info.children} guests</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt />
            <span>UBICACION DEL HOTEL</span>
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 flex flex-col justify-between pr-40">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {selectedRoom?.roomType?.name || "Room Name"}
          </h2>

          <div className="flex items-center text-sm text-gray-600 flex-wrap gap-4 mb-4">
            <span className="flex items-center gap-1">
              <MdBathroom /> 1 bathroom
            </span>
            <span className="flex items-center gap-1">
              <MdOutlineWifi /> Free WIFI
            </span>
            <span className="flex items-center gap-1">
              <MdLocalParking /> Free Parking
            </span>
            <span className="flex items-center gap-1">
              <MdKitchen /> Kitchen
            </span>
          </div>

          <div className="text-sm text-gray-500 leading-5">
            {selectedRoom?.roomType?.description ? (
              selectedRoom.roomType.description
                .split(".")
                .filter(Boolean)
                .map((sentence, i) => <p key={i}>{sentence.trim()}.</p>)
            ) : (
              <p>No description available.</p>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="absolute right-6 bottom-6 flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-800">
          ${selectedRoom?.roomType?.price}
          <span className="text-sm text-gray-600"> per night</span>
        </div>
        <BookNowButton />
        <span className="text-sm mt-1 text-gray-700">Total: ${total}</span>
      </div>
    </div>
  );
};

export default RoomBookingCard;
