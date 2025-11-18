import React, { useEffect, useState } from "react";
import {
  GetUserDetails,
  getUserBookings,
  getRoomById,
} from "../service/api.services";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";

const MyBookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
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
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toLocalDateString = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNights = (ci, co) => {
    const start = new Date(ci);
    const end = new Date(co);
    return Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading your reservations...
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-12 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-serif tracking-wide">
          LUMÉ HOTEL & SUITES
        </h1>
        <UserMenu />
      </header>

      {/* TITLE */}
      <h2 className="text-3xl font-semibold mt-8 px-12">Reservations</h2>

      {/* GRID OF CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-12 mt-10">
        {bookings.map((b) => {
          const room = rooms[b.roomId];
          if (!room) return null;

          const nights = getNights(b.checkIn, b.checkOut);
          const total = nights * room.roomType.price;

          return (
            <div
              key={b.id}
              className="bg-white shadow-lg rounded-xl border border-gray-200 p-10 flex flex-col justify-between"
            >
              {/* HEADER */}
              <div>
                <h2 className="font-serif text-xl text-center">
                  LUMÉ HOTEL & SUITES
                </h2>

                <div className="border-t border-[#d4a86a] mt-3 mb-6 w-3/4 mx-auto"></div>

                <p className="text-right text-sm text-gray-600 font-medium">
                  #{String(b.id).padStart(3, "0")}
                </p>

                <h3 className="text-xl text-center font-semibold mt-2">
                  Booking 
                </h3>
              </div>

              {/* BODY */}
              <div className="mt-8 space-y-4 text-gray-700 text-[15px]">
                <p>
                  <strong>Name:</strong> {user.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {user.phoneNumber}
                </p>

                <p className="pt-4">
                  <strong>Type:</strong> {room.roomType.name}
                </p>

                <div className="flex justify-between">
                  <p>
                    <strong>Price / Night:</strong> ${room.roomType.price}
                  </p>
                  <p>
                    <strong>Nights:</strong> {nights}
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {toLocalDateString(b.checkIn)}
                  </p>
                  <p>
                    <strong>Check-out:</strong>{" "}
                    {toLocalDateString(b.checkOut)}
                  </p>
                </div>
              </div>

              {/* TOTAL */}
              <div className="border-t border-gray-300 mt-6 pt-6 flex justify-between">
                <p className="text-xl font-bold">${total}</p>
                <p className="text-sm text-gray-600">
                  {toLocalDateString(b.createdAt)}
                </p>
              </div>

              {/* FOOTER MESSAGE */}
              <p className="text-center text-gray-700 mt-6 text-sm leading-relaxed">
                Thank you for choosing Lumé Hotel & Suites.
                <br />
                We look forward to your stay.
              </p>

              {/* BUTTON */}
              {b.status === "ACTIVE" && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => navigate(`/bookings/${b.id}`)}
                    className="bg-[#172A45] hover:bg-[#1F3A5A] text-white font-medium px-6 py-2 rounded-lg transition"
                  >
                    View more
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RETURN BUTTON */}
      <div className="text-center mt-12">
<button
  onClick={() => navigate("/rooms")}
  className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] font-semibold px-6 py-2 rounded-full shadow-md transition"
>
  Back to Rooms
</button>

      </div>
    </div>
  );
};

export default MyBookingsPage;
