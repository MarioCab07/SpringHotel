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
      <article className="w-full h-full flex flex-col gap-4 items-center justify-between relative">
        <h4
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
          className="rounded-b-2xl bg-white font-zain-extrabold p-4 w-1/3 text-3xl text-center"
        >
          Listado de Reservas
        </h4>
        <div className="w-full h-full flex-1  flex flex-col py-5 items-center justify-center overflow-scroll">
          {loading && <Loading fullscreen={false} />}
          {!loading && bookings.length === 0 && (
            <>
              <h2 className="text-center text-2xl font-bold">
                No hay clientes registrados
              </h2>
            </>
          )}

          {!loading && bookings.length > 0 && (
            <>
              <div
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                className="w-full max-w-6xl h-full mx-auto p-4 bg-white rounded-3xl"
              >
                <div className="grid grid-cols-6 gap-4 mb-4 text-center font-bold">
                  <h5 className="col-span-1 flex items-center justify-center">
                    ID
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Cliente
                  </h5>

                  <h5 className="col-span-1 flex items-center justify-center">
                    N.º Habitacion
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Check-In
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Check-Out
                  </h5>

                  <h5 className="col-span-1 flex items-center justify-center">
                    Estado
                  </h5>
                </div>
                <hr />

                {bookings.map((booking) => {
                  return (
                    <div
                      key={booking.id}
                      className="bg-white py-4 rounded-lg shadow-md mb-4 grid grid-cols-6 gap-4 w-full"
                    >
                      <p className="text-gray-600 flex items-center justify-center">
                        {booking.id}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {booking.clientName}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {booking.roomNumber}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {booking.checkIn}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {booking.checkOut}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {booking.status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </article>
    </>
  );
};

export default BookingList;
