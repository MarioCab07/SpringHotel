import React, { useEffect, useState } from "react";
import { FaStar, FaBath, FaParking, FaUtensils } from "react-icons/fa";
import { MdWifi } from "react-icons/md";
import axios from "axios";
import { getRoomTypeReviewsSummary } from "../../service/api.services";

const RoomCard = ({ room, setShowBookingModal, setSelectedRoom }) => {
  const [summary, setSummary] = useState({ count: 0, average: null });
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);
  const API = import.meta.env.VITE_BASE_URL + "/api";

  const handleBooking = () => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const roomTypeId = room?.roomType?.id ?? null;

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      if (!roomTypeId) return;

      try {
        const resp = await axios.get(`${API}/room_type/${roomTypeId}/images`);
        const list = resp?.data?.data ?? [];

        if (mounted) {
          if (list.length > 0) {
            setImageUrl(list[0].url);
          } else {
            setImageUrl(null);
          }
        }
      } catch (err) {
        console.error("Error loading roomType image for RoomCard", err);
      }
    };

    loadImage();
    return () => (mounted = false);
  }, [roomTypeId]);

  // -----------------------------
  // REVIEWS
  // -----------------------------
  useEffect(() => {
    let mounted = true;
    const loadSummary = async () => {
      if (!roomTypeId) {
        setSummary({ count: 0, average: null });
        return;
      }
      setLoadingSummary(true);
      try {
        const res = await getRoomTypeReviewsSummary(roomTypeId);
        const payload = res?.data?.data;
        if (!mounted) return;
        setSummary({
          count: payload?.count ?? 0,
          average: payload?.average ?? null,
        });
      } catch (err) {
        console.error("Error loading summary reviews:", err);
        if (!mounted) return;
        setSummary({ count: 0, average: null });
      } finally {
        if (mounted) setLoadingSummary(false);
      }
    };

    loadSummary();

    return () => {
      mounted = false;
    };
  }, [roomTypeId]);

  const ratingText = loadingSummary ? "..." : summary.average ?? "—";
  const countText = loadingSummary ? "..." : summary.count ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-all duration-300">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={room.roomType?.name}
          className="w-full md:w-[320px] h-[210px] object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
        />
      ) : (
        <div className="w-full md:w-[320px] h-[210px] bg-gray-200 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"></div>
      )}

      <div className="flex-1 flex flex-col justify-between p-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {room.roomType?.name}
          </h2>

          <p className="text-gray-700 text-sm leading-snug">
            {room.roomType?.description}
          </p>

          <p className="text-gray-900 font-semibold mt-2">
            Room Number: {room.roomNumber}
          </p>

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

        <div className="flex flex-col items-end justify-between gap-3 mt-4 md:mt-0 md:ml-6">
          <div className="flex items-center gap-2">
            <FaStar className="text-[#bfa166] text-lg" />
            <span className="text-gray-900 font-medium text-base">{ratingText}</span>
            <span className="text-gray-400 text-sm">{countText} ratings</span>
          </div>

          <div className="text-right">
            <p className="text-xl font-semibold text-gray-900">
              ${room.roomType?.price}
              <span className="text-sm text-gray-600 ml-1">/ night</span>
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Status: {room.roomStatus}
            </p>
          </div>

          <button
            onClick={handleBooking}
            className="bg-[#bfa166] hover:bg-[#a98e4f] text-white font-medium px-6 py-2 rounded-md shadow-sm transition-all"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
