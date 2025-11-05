import React, { useEffect } from "react";
import { FaBath, FaWifi, FaParking, FaUtensils } from "react-icons/fa";
import BookNowButton from "../Buttons/BookNowButtom";
import { useState } from "react";

const RoomCard = ({ room, info, setShowBookingModal, setSelectedRoom }) => {
  const [total, setTotal] = useState(() => {
    const nights =
      info && info.startDate && info.endDate
        ? Math.max(
            1,
            Math.ceil(
              (new Date(info.endDate) - new Date(info.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;
    return room.roomType.price * nights;
  });

  useEffect(() => {
    const nights =
      info && info.startDate && info.endDate
        ? Math.max(
            1,
            Math.ceil(
              (new Date(info.endDate) - new Date(info.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;
    setTotal(room.roomType.price * nights);
  }, [info]);

  const handleBooking = (selectRoom) => {
    setShowBookingModal(true);
    setSelectedRoom(selectRoom);
  };

  // const handleBooking = () => {
  //   console.log("Reservando habitación ID:", room.roomId);
  // };

  // const nights =
  //   dates && dates.start && dates.end
  //     ? Math.max(
  //         1,
  //         Math.ceil(
  //           (new Date(dates.end) - new Date(dates.start)) /
  //             (1000 * 60 * 60 * 24)
  //         )
  //       )
  //     : 1;

  // const total = room.price * nights;

  // let roomTypeName = "Tipo no especificado";
  // let description = "Sin descripción";

  // if (typeof room.roomType === "string") {
  //   roomTypeName = room.roomType;
  // } else if (typeof room.roomType === "object" && room.roomType !== null) {
  //   roomTypeName =
  //     room.roomType.roomTypeName ||
  //     room.roomType.name ||
  //     "Tipo no especificado";
  //   description = room.roomType.description || "Sin descripción";
  // }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-6">
        <img
          src={
            room.roomType.imageUrl ||
            "https://placehold.co/260x180?text=Room+Image"
          }
          alt={room.roomTypeName}
          className="rounded-lg w-full md:w-[260px] h-[180px] object-cover"
        />

        <div className="flex flex-col flex-1 justify-between text-slate-700">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
              {room.roomType.name}
            </h2>
            <p className="text-sm text-slate-500">
              {room.roomType.description}
            </p>
          </div>

          <div className="flex items-start justify-between pt-2">
            <p className="text-xl font-bold text-slate-900">
              ${room.roomType.price}
              <span className="text-sm font-normal text-slate-600">
                {" "}
                per night
              </span>
            </p>

            <div className="flex flex-col items-center text-right gap-1 -mt-4">
              <p className="text-slate-800 font-semibold text-base">
                Total: ${total}
              </p>
              <BookNowButton onClick={() => handleBooking(room)} />
            </div>
          </div>
        </div>

        <div className="hidden md:flex">
          <div className="w-px bg-gray-300 h-full" />
        </div>

        <div className="w-full md:w-[180px] flex flex-col justify-center items-end text-sm text-slate-600 space-y-2 text-right">
          <div className="flex items-center gap-2">
            <span>{room.bathrooms || 1} bathroom</span>
            <FaBath className="text-lg" />
          </div>
          <div className="flex items-center gap-2">
            <span>Free WIFI</span>
            <FaWifi className="text-lg" />
          </div>
          <div className="flex items-center gap-2">
            <span>Free Parking</span>
            <FaParking className="text-lg" />
          </div>
          <div className="flex items-center gap-2">
            <span>Kitchen</span>
            <FaUtensils className="text-lg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomCard;
