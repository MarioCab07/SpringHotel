import { useEffect, useState } from "react";
import {
  getAllBookings,
  GetUser,
  getRoomById,
} from "../../service/api.services";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingsConDetalles = async () => {
      setLoading(true);
      try {
        const resp = await getAllBookings();
        if (resp.status === 200) {
          const raw = resp.data.data;

          const enriched = await Promise.all(
            raw.map(async (b) => {
              const userRes = await GetUser(b.userId);
              const roomRes = await getRoomById(b.roomId);

              return {
                ...b,
                clientName: userRes.data.data.fullName,
                roomNumber: roomRes.data.data.roomNumber,
              };
            })
          );

          setBookings(enriched);
        }
      } catch (err) {
        toast.error("Error al cargar las reservas: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsConDetalles();
  }, []);

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        {loading && <Loading fullscreen={false} />}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-600">
              No hay reservas registradas
            </h2>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Room Number
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Check-In
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Check-Out
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    State
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-3 text-sm text-gray-600">{booking.id}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                      {booking.clientName}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">
                      {booking.roomNumber}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">{booking.checkIn}</td>
                    <td className="py-2 px-3 text-sm text-gray-600">
                      {booking.checkOut}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingList;
