import React, { useEffect, useState } from "react";
import {
  GetUserDetails,
  getUserBookings,
  getRoomById,
  cancelBooking,
  modifyBooking,
} from "../service/api.services";

import UserMenu from "../components/UserMenu";
import ChangeDatesModal from "../components/Booking/ChangeDatesModal";
import ConfirmCancelModal from "../components/Booking/ConfirmCancelModal";
import StatusFilter from "../components/Booking/StatusFilter";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyBookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "N/A";
    const [year, month, day] = date.split("T")[0].split("-");
    return new Date(`${month}/${day}/${year}`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const loadBookings = async () => {
    const userRes = await GetUserDetails();
    const userId = userRes.data.data.userId;
    setUser(userRes.data.data);

    const bookingRes = await getUserBookings(userId);
    const fetched = bookingRes.data.data;

    const roomMap = {};
    for (const b of fetched) {
      if (!roomMap[b.roomId]) {
        const r = await getRoomById(b.roomId);
        roomMap[b.roomId] = r.data.data;
      }
    }

    setRooms(roomMap);
    setBookings(fetched);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadBookings();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getNights = (ci, co) => {
    const start = new Date(ci);
    const end = new Date(co);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      toast.success("Reservation cancelled successfully!");
      setLoading(true);
      await loadBookings();
      setLoading(false);
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Could not cancel reservation";
      toast.error(msg);
    }
  };

  const openChangeDates = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleSaveDates = async (newDates) => {
    try {
      await modifyBooking(selectedBooking.id, newDates);
      toast.success("Reservation updated successfully!");
      setLoading(true);
      await loadBookings();
      setShowModal(false);
      setSelectedBooking(null);
      setLoading(false);
    } catch (e) {
      const msg = e?.message || e?.data?.message || e?.response?.data?.message || "Could not modify reservation";
      toast.error(msg);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading your reservations...
      </div>
    );

  const filteredBookings = bookings.filter(
    (b) => statusFilter === "ALL" || b.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="py-3">
        <UserMenu />
      </header>

      {/* Header con filtro */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <h2 className="text-3xl" style={{ fontFamily: '"Playfair Display", serif' }}>
          Reservations
        </h2>
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-12 mt-10">
        {filteredBookings.map((b) => {
          const room = rooms[b.roomId];
          if (!room) return null;

          const nights = getNights(b.checkIn, b.checkOut);
          const total = nights * room.roomType.price;

          return (
            <div
              key={b.id}
              className="bg-white shadow-lg rounded-xl border border-gray-200 p-10 flex flex-col justify-between min-w-[600px] mx-auto"
            >
              <div>
                <h2 className="font-serif text-xl text-center">LUMÉ HOTEL & SUITES</h2>
                <div className="border-t border-[#d4a86a] mt-3 mb-6 w-3/4 mx-auto"></div>
                <p className="text-right text-sm text-gray-600 font-medium">
                  #{String(b.id).padStart(3, "0")}
                </p>
                <h3 className="text-xl text-center font-semibold mt-2">Booking</h3>
              </div>

              <div className="mt-8 space-y-4 text-gray-700 text-[15px]">
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone Number:</strong> {user.phoneNumber}</p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <p><strong>Type:</strong> {room.roomType.name}</p>
                    <p><strong>Room Number:</strong> {room.roomNumber}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p><strong>Status:</strong> {b.status}</p>
                    <p><strong>Price / Night:</strong> ${room.roomType.price}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <p><strong>Nights:</strong> {nights}</p>
                </div>

                <div className="flex justify-between pt-2">
                  <p><strong>Check-in:</strong> {formatDate(b.checkIn)}</p>
                  <p><strong>Check-out:</strong> {formatDate(b.checkOut)}</p>
                </div>
              </div>

              <div className="border-t border-gray-300 mt-6 pt-6 flex justify-between">
                <p className="text-xl font-bold">${total}</p>
                <p className="text-sm text-gray-600">{formatDate(b.createdAt)}</p>
              </div>

              <p className="text-center text-gray-700 mt-6 text-sm leading-relaxed">
                Thank you for choosing Lumé Hotel & Suites.
                <br />
                We look forward to your stay.
              </p>

              <div className="mt-6 flex flex-col space-y-3">
                {b.status === "PENDING" && (
                  <button
                    onClick={() => openChangeDates(b)}
                    className="bg-[#D9C696] hover:bg-[#cdb883] text-black font-medium px-6 py-2 rounded-lg transition"
                  >
                    Change Dates
                  </button>
                )}

                {b.status === "ACTIVE" && (
                  <button
                    onClick={() => navigate(`/bookings/${b.id}`)}
                    className="bg-[#172A45] hover:bg-[#1F3A5A] text-white font-medium px-6 py-2 rounded-lg transition"
                  >
                    View more
                  </button>
                )}

                {["PENDING", "CONFIRMED", "ACTIVE"].includes(b.status) && (
                  <button
                    onClick={() => {
                      setBookingToCancel(b.id);
                      setShowCancelModal(true);
                    }}
                    className="bg-[#C96E5E] hover:bg-[#B86254] text-black font-medium px-6 py-2 rounded-lg transition"
                  >
                    Cancel reservation
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-lg">No reservations found for this filter.</p>
        </div>
      )}

      {showModal && selectedBooking && (
        <ChangeDatesModal
          booking={selectedBooking}
          onClose={() => setShowModal(false)}
          onSave={handleSaveDates}
        />
      )}

      {showCancelModal && bookingToCancel && (
        <ConfirmCancelModal
          bookingId={bookingToCancel}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;