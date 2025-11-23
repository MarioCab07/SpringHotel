import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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

// ------------------- HELPERS -------------------
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
  const location = useLocation();
  const incoming = location.state;

  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);
  const [selected, setSelected] = useState(incoming?.selectedServices || []);
  const [specialRequest, setSpecialRequest] = useState(
    incoming?.specialRequest || ""
  );
  const [loading, setLoading] = useState(true);

  // ------------------- LOAD DATA -------------------
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const userRes = await GetUserDetails();
        const userId = userRes.data.data.userId;

        const ubRes = await getUserBookings(userId);
        const foundBooking = ubRes.data.data.find((b) => b.id === bookingId);

        if (!foundBooking) return;

        setBooking(foundBooking);

        const rRes = await getRoomById(foundBooking.roomId);
        setRoom(rRes.data.data);

        const typesRes = await getAllServicesTypes();
        setAvailableServices(typesRes.data.data);

        let srvData = [];
        try {
          const srvRes = await getRoomServicesByBookingId(bookingId);
          srvData = srvRes.data.data;
        } catch (_) {}

        setBookedServices(srvData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [bookingId]);

  // ---------------- DEFAULT SELECTED -------------------
  useEffect(() => {
    if (!incoming) {
      const pendingOrActive = bookedServices.filter(
        (s) =>
          s.roomServiceStatus === "PENDING" ||
          s.roomServiceStatus === "ACTIVE" ||
          s.roomServiceStatus === "IN_PROGRESS"
      );

      const ids = pendingOrActive.flatMap((s) => s.serviceTypeIds || []);
      setSelected(ids);

      setSpecialRequest(pendingOrActive[0]?.roomServiceDescription || "");
    }
  }, [bookedServices, incoming]);

  // ---------------- CONDITIONS -------------------
  const alreadySavedIds = bookedServices.flatMap((s) => s.serviceTypeIds || []);
  const isPastOrInactive =
    booking?.status !== "ACTIVE" ||
    new Date(booking?.checkOut) < new Date();

  const activeService = bookedServices.find(
    (s) =>
      s.roomServiceStatus === "PENDING" ||
      s.roomServiceStatus === "ACTIVE" ||
      s.roomServiceStatus === "IN_PROGRESS"
  );

  const canModifyOrCancel = !!activeService;

  const getShift = () => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "MORNING" : "EVENING";
};


  // ---------------- TOGGLE SERVICE -------------------
  const toggleService = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ---------------- ACTIONS -------------------
  const handleModifyService = async () => {
    if (!activeService) return;

    try {
      await updateRoomService(activeService.roomServiceId, {
        roomServiceStatus: activeService.roomServiceStatus,
        serviceTypeIds: selected,
        roomServiceDescription: specialRequest,
      });

      const srvRes = await getRoomServicesByBookingId(bookingId);
      setBookedServices(srvRes.data.data);

      toast.success("Service modified successfully.");
    } catch (err) {
      toast.error("Error modifying the service.");
    }
  };

  const handleCancelService = async () => {
    if (!activeService) return;

    if (!window.confirm("Are you sure you want to cancel this service?")) return;

    try {
      await updateRoomService(activeService.roomServiceId, {
        roomServiceStatus: "CANCELED",
        serviceTypeIds: activeService.serviceTypeIds,
      });

      const srvRes = await getRoomServicesByBookingId(bookingId);
      setBookedServices(srvRes.data.data);

      toast.success("Service canceled.");
    } catch (err) {
      toast.error("Error canceling the service");
    }
  };

  const handleSaveServices = async () => {
  try {

    // Si hay un servicio activo → modificarlo
    if (activeService) {
      await updateRoomService(activeService.roomServiceId, {
        roomServiceStatus: activeService.roomServiceStatus,
        serviceTypeIds: selected,
        roomServiceDescription: specialRequest,
        shift: getShift(),
      });
    } 
    // Si NO hay servicio → crear uno nuevo
    else {
      await createRoomService({
        bookingId,
        serviceTypeIds: selected,
        roomServiceStatus: "PENDING",
        roomServiceDescription: specialRequest,
        requestedAt: new Date().toISOString(),
        shift: getShift(),
      });
    }

    toast.success("¡Servicios guardados correctamente!");

    setTimeout(() => {
      navigate("/rooms");
    }, 1200);

  } catch (err) {
    console.log(err);
    toast.error("Error guardando los servicios.");
  }
};

  // ---------------- LOADING / MISSING -------------------
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

  // ---------------- ROOM IMAGE LOGIC -------------------
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24)
    )
  );

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

  // ---------------- UI -------------------
  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="py-3">
        <UserMenu />
      </header>

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
                        checked={selected.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        disabled={isPastOrInactive}
                        className="w-4 h-4 accent-[#d4bf92]"
                      />

                      <span
                        className={
                          isSaved || isPastOrInactive
                            ? "text-gray-400"
                            : "text-gray-800"
                        }
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

            {/* SPECIAL REQUEST */}
            <div className="mt-6">
              <label className="font-medium text-gray-700">Special Request</label>
              <textarea
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                disabled={isPastOrInactive}
                placeholder="Write your request..."
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#d4bf92] outline-none disabled:bg-gray-100"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              {canModifyOrCancel && (
                <>
                  <button
                    onClick={handleModifyService}
                    className="w-full bg-[#e8dcbc] hover:bg-[#dfd0a8] text-[#403a2c] font-semibold py-3 px-8 rounded-full shadow-sm transition-all"
                  >
                    Modify Service
                  </button>

                  <button
                    onClick={handleCancelService}
                    className="w-full bg-[#e9b1ad] hover:bg-[#dea5a0] text-[#2b2b2b] font-semibold py-3 px-8 rounded-full shadow-sm transition-all"
                  >
                    Cancel Service
                  </button>
                </>
              )}

              {!canModifyOrCancel && (
                <button
                  onClick={handleSaveServices}
                  className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] font-medium px-6 py-2 rounded-lg shadow-md transition"
                >
                  Save Services
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* RETURN BUTTON */}
      <button
        onClick={() => navigate("/my-bookings")}
        className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] font-medium px-8 py-3 rounded-full shadow-md transition mx-auto mb-6"
      >
        Return
      </button>
    </div>
  );
};

export default UserService;
