import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  GetUserDetails,
  getUserBookings,
  getRoomById,
  getAllServicesTypes,
  getRoomServicesByBookingId,
  createRoomService,
  updateRoomService,
} from "../service/api.services";

import UserMenu from "../components/UserMenu";
import { toast } from "react-toastify";

// ------------------- FORMAT DATE -------------------
const formatDateShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const UserService = () => {
  const { id } = useParams();
  const bookingId = Number(id);
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------- LOAD DATA -------------------
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const userRes = await GetUserDetails();
        const userId = userRes.data.data.userId;

        const bookingRes = await getUserBookings(userId);
        const foundBooking = bookingRes.data.data.find((b) => b.id === bookingId);

        if (!foundBooking) return;
        setBooking(foundBooking);

        const roomRes = await getRoomById(foundBooking.roomId);
        setRoom(roomRes.data.data);

        const typeRes = await getAllServicesTypes();
        setAvailableServices(typeRes.data.data);

        try {
          const serviceRes = await getRoomServicesByBookingId(bookingId);
          setBookedServices(serviceRes.data.data);
        } catch (err) {}

      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [bookingId]);

  // ------------------- DEFAULT SELECTED -------------------
  useEffect(() => {
    const savedIds = bookedServices.flatMap((s) => s.serviceTypeIds || []);
    setSelected((prev) => Array.from(new Set([...prev, ...savedIds])));
  }, [bookedServices]);

  const alreadySavedIds = bookedServices.flatMap((s) => s.serviceTypeIds || []);

  const toggleService = (id) => {
    if (alreadySavedIds.includes(id)) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const pendingService = bookedServices.find(
    (s) => s.roomServiceStatus === "PENDING"
  );

  // ------------------- SAVE SERVICES -------------------
  const handleSaveServices = async () => {
    try {
      if (pendingService) {
        await updateRoomService(pendingService.roomServiceId, {
          roomServiceStatus: "PENDING",
          serviceTypeIds: selected,
        });
      } else {
        await createRoomService({
          bookingId,
          serviceTypeIds: selected,
          roomServiceStatus: "PENDING",
          requestedAt: new Date().toISOString(),
        });
      }

      toast.success("¡Servicios guardados correctamente!");

      setTimeout(() => {
        navigate("/rooms");
      }, 1200);
    } catch (err) {
      toast.error("Error guardando los servicios.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Cargando...
      </div>
    );

  if (!room || !booking)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        No se encontró la reserva
      </div>
    );

  // ------------------- UI -------------------
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24)
    )
  );

  // ------------------- ROOM IMAGE LOGIC -------------------
  const imagesUrl = {
    Suite:
      "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
    "Double Room":
      "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
    "Single Room":
      "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
  };

  const imageUrl =
    imagesUrl[room.roomType?.name] ||
    room.roomType?.photoUrl ||
    room.photoUrl ||
    room.image ||
    "https://via.placeholder.com/600x350?text=Room";

  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="py-3">
        <UserMenu />
      </header>

      {/* MAIN CONTENT */}
      <main className="flex justify-center mt-10 mb-16">
        <div className="max-w-6xl w-full flex justify-between gap-16">

          {/* ---------------- ROOM CARD ---------------- */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-5">
            <img
              src={imageUrl}
              alt="Room"
              className="rounded-xl w-full h-64 object-cover mb-4"
            />

            <h2 className="text-2xl font-semibold">{room.roomType.name}</h2>
            <p className="text-gray-600">
              Room Number: <strong>{room.roomNumber}</strong>
            </p>

            <p className="mt-2 text-gray-700">{room.roomType.description}</p>

            <ul className="mt-4 text-gray-700 space-y-1">
              <li>
                <strong>{nights}</strong> night(s):{" "}
                {formatDateShort(booking.checkIn)} →{" "}
                {formatDateShort(booking.checkOut)}
              </li>
              <li>
                Location: <strong>Lumé Hotel & Suites</strong>
              </li>
            </ul>

            <div className="mt-4">
              <p className="font-semibold text-gray-900 text-lg">
                ${room.roomType.price} / night
              </p>
              <p className="text-gray-800">
                <strong>${room.roomType.price * nights}</strong> Total
              </p>
            </div>
          </div>

          {/* ---------------- SERVICES CARD ---------------- */}
          <div className="bg-white rounded-2xl shadow-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-6">Room Services</h2>

            <div className="space-y-4">
              {availableServices.map((service) => {
                const isSaved = alreadySavedIds.includes(service.id);

                return (
                  <label
                    key={service.id}
                    className="flex justify-between items-center border p-3 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSaved || selected.includes(service.id)}
                        disabled={isSaved}
                        onChange={() => toggleService(service.id)}
                        className="w-4 h-4 accent-[#d4bf92]"
                      />

                      <span
                        className={isSaved ? "text-gray-400" : "text-gray-800"}
                      >
                        {service.name}
                      </span>
                    </div>

                    <span className="font-medium text-gray-700">
                      ${service.price}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSaveServices}
              className="w-full bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] font-medium px-8 py-3 rounded-full shadow-md transition mt-6"
            >
              Guardar Servicios
            </button>
          </div>
        </div>
      </main>

      {/* RETURN BUTTON */}
      <button
        onClick={() => navigate("/my-bookings")}
        className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] font-medium px-8 py-3 rounded-full shadow-md transition mx-auto mb-4"
      >
        Return
      </button>
    </div>
  );
};

export default UserService;