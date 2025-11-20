import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  GetUserDetails,
  getUserBookings,
  getRoomById,
  getAllServicesTypes,
  getRoomServicesByBookingId,
  updateRoomService
} from "../service/api.services";

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
  const [specialRequest, setSpecialRequest] = useState(incoming?.specialRequest || "");
  const [loading, setLoading] = useState(true);

  // ---------------- HELPERS ----------------

  const formatState = (state) =>
    state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("es-SV", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

  const imagesUrl = {
    Suite: "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
    "Double Room": "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
    "Single Room": "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg"
  };

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const userRes = await GetUserDetails();
        const userId = userRes.data.data.userId;

        const ubRes = await getUserBookings(userId);
        const found = ubRes.data.data.find((b) => b.id === bookingId);
        if (!found) return;

        setBooking(found);

        const rRes = await getRoomById(found.roomId);
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
    fetchData();
  }, [bookingId]);

  // ---------------- DEFAULT SELECTED ----------------

  useEffect(() => {
    if (!incoming) {
      const pendingOrActive = bookedServices.filter(
        (s) => s.roomServiceStatus === "PENDING" || s.roomServiceStatus === "ACTIVE"
      );

      const ids = pendingOrActive.flatMap((s) => s.serviceTypeIds || []);
      setSelected(ids);
      setSpecialRequest(pendingOrActive[0]?.roomServiceDescription || "");
    }
  }, [bookedServices, incoming]);

  // ---------------- UI LOGIC ----------------

  const toggleService = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const isPastOrInactive =
    booking?.status !== "ACTIVE" || new Date(booking?.checkOut) < new Date();

  const pendingService = bookedServices.find(
    (s) => s.roomServiceStatus === "PENDING"
  );

  const canModifyOrCancel = !!pendingService; // solo si está PENDING

  const imageUrl = imagesUrl[room?.roomType.name] || room?.imageUrl;

  // ---------------- ACTIONS ----------------

  const handleProceedToTicket = () => {
    if (isPastOrInactive) {
      alert("No puedes solicitar servicios para una reserva inactiva.");
      return;
    }
    navigate(`/invoice/${bookingId}`, {
      state: { selectedServices: selected, specialRequest }
    });
  };

  const handleModifyService = async () => {
    if (!pendingService) return;

    try {
      await updateRoomService(pendingService.roomServiceId, {
        roomServiceStatus: "PENDING",
        serviceTypeIds: selected,
        roomServiceDescription: specialRequest
      });

      const srvRes = await getRoomServicesByBookingId(bookingId);
      setBookedServices(srvRes.data.data);

      alert("Service modified successfully.");
    } catch (err) {
      alert("Error modifying the service.");
    }
  };

  const handleCancelService = async () => {
    if (!pendingService) return;

    if (!window.confirm("Are you sure you want to cancel this service?")) return;

    try {
      await updateRoomService(pendingService.roomServiceId, {
        roomServiceStatus: "CANCELED",
        serviceTypeIds: pendingService.serviceTypeIds
      });

      const srvRes = await getRoomServicesByBookingId(bookingId);
      setBookedServices(srvRes.data.data);

      alert("Service canceled.");
    } catch (err) {
      alert("Error canceling the service");
    }
  };

  // ---------------- RENDER ----------------

  if (loading)
    return <div className="text-center py-20 text-lg text-gray-600">Cargando...</div>;

  if (!booking || !room)
    return <div className="text-center py-20 text-lg text-gray-600">Reserva no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="relative bg-gray-50 border-b px-6 py-4">
          <button
            onClick={() => navigate("/my-bookings")}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-center text-gray-900">
            Room {room.roomNumber}
          </h1>
        </div>

        {/* CONTENT */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ROOM DETAILS */}
          <div className="space-y-3 text-gray-800">
            <img
              src={imageUrl}
              className="w-full h-56 object-cover rounded-lg shadow-sm"
              alt="Room"
            />

            <p><span className="font-semibold">Status:</span> {formatState(booking.status)}</p>
            <p><span className="font-semibold">Room type:</span> {room.roomType.name}</p>
            <p><span className="font-semibold">Check-out:</span> {booking.checkOut}</p>

            <p>
              <span className="font-semibold">Last cleaned: </span>
              {room.lastClean ? formatDate(room.lastClean) : "N/A"}
            </p>
          </div>

          {/* SERVICES */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:border-gray-300"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleService(s.id)}
                      disabled={
                        isPastOrInactive ||
                        (!!pendingService && pendingService.roomServiceStatus !== "PENDING")
                      }
                      className="w-4 h-4 accent-[#D9C696]"
                    />
                    <span className={isPastOrInactive ? "text-gray-400" : ""}>
                      {s.name}
                    </span>
                  </div>

                  <span className="text-gray-700 font-medium">${s.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SPECIAL REQUEST */}
        <div className="px-6 pb-4">
          <label className="font-medium text-gray-700">Special Request</label>
          <textarea
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            disabled={
                        isPastOrInactive ||
                        (!!pendingService && pendingService.roomServiceStatus !== "PENDING")
                      }
            placeholder="Write your request..."
            className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#D9C696] outline-none disabled:bg-gray-100"
          />
        </div>

        {/* BUTTONS */}
        <div className="px-6 pb-6 flex justify-end gap-4">

          {canModifyOrCancel && (
            <>
              <button
                onClick={handleModifyService}
                className="bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800"
              >
                Modify Service
              </button>

              <button
                onClick={handleCancelService}
                className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600"
              >
                Cancel Service
              </button>
            </>
          )}

          {!canModifyOrCancel && (
            <button
              onClick={handleProceedToTicket}
              disabled={isPastOrInactive}
              className={`bg-[#D9C696] text-white py-3 px-10 rounded-lg font-semibold hover:bg-[#c5b386] ${
                isPastOrInactive ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              View Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserService;
