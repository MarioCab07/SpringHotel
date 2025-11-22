import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaClock,
  FaUserFriends,
  FaBath,
  FaParking,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";

/* Simple ImageCarousel inline (pequeño, mantiene tamaño y overlay) */
const ImageCarousel = ({ images = [], children }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) {
    // fallback: render children but with empty background
    return (
      <div className="relative h-64 md:h-80 overflow-hidden group bg-gray-100">
        {children}
      </div>
    );
  }

  const prev = (e) => { e?.stopPropagation(); setIdx(i => (i === 0 ? images.length-1 : i-1)); };
  const next = (e) => { e?.stopPropagation(); setIdx(i => (i === images.length-1 ? 0 : i+1)); };

  return (
    <div className="relative h-64 md:h-80 overflow-hidden group">
      <img
        src={images[idx]}
        alt={`room-img-${idx}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

      {/* flechas */}
      <button onClick={prev} aria-label="prev" className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white px-2 py-1 rounded shadow">
        ‹
      </button>
      <button onClick={next} aria-label="next" className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white px-2 py-1 rounded shadow">
        ›
      </button>

      {/* indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <span key={i} className={`block w-2 h-2 rounded-full ${i===idx ? "bg-[#bfa166]" : "bg-gray-300"}`} />
        ))}
      </div>

      {/* overlays children */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};


const RoomBookingCard = ({ selectedRoom, info = {} }) => {
  const [images, setImages] = useState([]);
  const VITE_API = import.meta.env.VITE_BASE_URL + "/api";

  // cálculo de noches y precios (sin cambios)
  const nights =
    Math.ceil(
      (new Date(info.endDate) - new Date(info.startDate)) /
      (1000 * 60 * 60 * 24)
    ) || 1;

  const pricePerNight = selectedRoom?.roomType?.price || 0;
  const total = pricePerNight * nights;

  const isValidDate = (date) => {
    const dateObj = new Date(date);
    const timestamp = dateObj.getTime();
    return !isNaN(timestamp) && timestamp > 0;
  };

  const formatDate = (date) => {
    if (!isValidDate(date)) return "Unavailable";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    let mounted = true;

    const loadImages = async () => {
      // 1) si el selectedRoom ya trae images dentro de roomType, úsalas
      const imagesFromSelected = selectedRoom?.roomType?.images;
      if (imagesFromSelected && imagesFromSelected.length > 0) {
        const urls = imagesFromSelected.map(i => i.url);
        if (mounted) setImages(urls);
        return;
      }

      // 2) fallback: pedir al endpoint publico de images: /api/room_type/{id}/images
      const roomTypeId = selectedRoom?.roomType?.id;
      if (!roomTypeId) {
        // fallback legacy (imageUrl)
        const legacy = selectedRoom?.roomType?.imageUrl;
        if (legacy && mounted) setImages([legacy]);
        return;
      }

      try {
        const resp = await axios.get(`${VITE_API}/room_type/${roomTypeId}/images`);
        // respuesta: GeneralResponse -> resp.data.data = array images
        const imgs = (resp?.data?.data ?? []).map(i => i.url).filter(Boolean);
        if (mounted) {
          if (imgs.length > 0) setImages(imgs);
          else {
            // último fallback: imageUrl si existe
            const legacy = selectedRoom?.roomType?.imageUrl;
            setImages(legacy ? [legacy] : []);
          }
        }
      } catch (err) {
        console.error("Error loading roomType images ", err.response?.data ?? err);
        // si falla (403 u otro), fallback a imageUrl si existe
        const legacy = selectedRoom?.roomType?.imageUrl;
        if (mounted) setImages(legacy ? [legacy] : []);
      }
    };

    if (selectedRoom) loadImages();

    return () => { mounted = false; };
  }, [selectedRoom]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      {/* Room Image with Overlay -> ahora carrusel */}
      <ImageCarousel images={images}>
        {/* Room Number Badge */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm font-semibold text-gray-800">
              Room <span className="text-[#d4bf92]">#{selectedRoom?.roomNumber}</span>
            </p>
          </div>
        </div>

        {/* Room Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
          <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
            {selectedRoom?.roomType?.name}
          </h2>
        </div>
      </ImageCarousel>

      {/* Card content (igual que antes) */}
      <div className="p-6 md:p-8">
        <p className="text-gray-600 mb-6 leading-relaxed text-base">
          {selectedRoom?.roomType?.description}
        </p>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-6 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-full bg-[#d4bf92]/20 flex items-center justify-center">
              <FaClock className="text-[#d4bf92]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
              <p className="font-semibold">
                {nights} night{nights > 1 ? "s" : ""}
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
              <p className="text-xs text-gray-500">for {nights} night{nights > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoomBookingCard;
