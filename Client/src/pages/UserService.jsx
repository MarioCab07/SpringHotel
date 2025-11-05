import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  GetUserDetails,
  getUserBookings,
  getRoomById,
  getAllServicesTypes,
  getRoomServicesByBookingId,
} from '../service/api.services';

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
  const [specialRequest, setSpecialRequest] = useState(incoming?.specialRequest || '');
  const [loading, setLoading] = useState(true);
  const formatState = state => state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();

  const imagesUrl = {
  Suite:
    "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
  "Double Room":
    "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
  "Single Room":
    "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
};

useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const userRes = await GetUserDetails();
        const userId = userRes.data.data.userId;

        const ubRes = await getUserBookings(userId);
        const found = ubRes.data.data.find(b => b.id === bookingId);
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
        } catch (e) {
          if (e.status !== 404) throw e;
        }
        setBookedServices(srvData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookingId]);

  useEffect(() => {
  if (!incoming) {
    const activeServices = bookedServices.filter(s => s.roomServiceStatus === 'PENDING' || s.roomServiceStatus === 'ACTIVE');
    const ids = activeServices.flatMap(s => s.serviceTypeIds || []);
    setSelected(ids);
    setSpecialRequest(activeServices[0]?.roomServiceDescription || '');
  }
}, [bookedServices, incoming]);

  const toggleService = typeId => {
    setSelected(prev =>
      prev.includes(typeId)
        ? prev.filter(x => x !== typeId)
        : [...prev, typeId]
    );
  };

  const handleProceedToTicket = () => {
    if (!booking || booking.status !== 'ACTIVE' || new Date(booking.checkOut) < new Date()) {
      alert('No se puede solicitar servicios para una reserva pasada o inactiva.');
      return;
    }
    navigate(`/invoice/${bookingId}`, {
      state: { selectedServices: selected, specialRequest }
    });
  };


  if (loading) return <div className="text-center py-20 text-lg">Cargando...</div>;
  if (!booking || !room) return <div className="text-center py-20 text-lg">Reserva no encontrada</div>;

  const isPastOrInactive = booking.status !== 'ACTIVE' || new Date(booking.checkOut) < new Date();
  const hasActiveService = bookedServices.some(s => s.roomServiceStatus === 'PENDING' || s.roomServiceStatus === 'ACTIVE');
  const imageUrl = imagesUrl[room.roomType.name] || room.imageUrl || '';

    return (
    <>
      <div className="min-h-screen bg-[#D6ECF7] flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="relative bg-gray-100 rounded-t-2xl p-5">
            <button
              onClick={() => navigate("/my-bookings")}
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-3xl hover:text-gray-600 transition-colors"
            >
              ←
            </button>
            <h1 className="text-2xl font-semibold text-center">
              Room {room.roomNumber}
            </h1>
          </div>

          {/* Main content */}
          <div className="flex flex-col md:flex-row p-8 gap-8">
            <div className="md:w-1/2 space-y-3 text-lg">
              <img src={imageUrl} alt="Room" className="w-full h-56 object-cover rounded-lg" />
              <p><span className="font-semibold">State:</span> {formatState(booking.status)}</p>
              <p><span className="font-semibold">Room type:</span> {room.roomType.name}</p>
              <p><span className="font-semibold">Check-out:</span> {booking.checkOut}</p>
              <p><span className="font-semibold">Last cleaned:</span> {room.lastCleanedAt || 'N/A'}</p>
            </div>

            <div className="md:w-1/2 bg-[#F6F6F6] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Supplies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableServices.map(s => (
                  <label key={s.id} className="flex items-center space-x-2 cursor-pointer text-base">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleService(s.id)}
                      disabled={isPastOrInactive}
                      className="form-checkbox h-5 w-5 text-pink-400 disabled:opacity-50"
                    />
                    <span className={isPastOrInactive ? 'text-gray-400' : ''}>{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="px-8 py-4">
            <label htmlFor="specialRequest" className="block text-lg font-medium mb-2">Special Request</label>
            <input
              id="specialRequest"
              type="text"
              value={specialRequest}
              onChange={e => setSpecialRequest(e.target.value)}
              placeholder="Write your request..."
              disabled={isPastOrInactive}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-50"
            />
          </div>

          <div className="px-8 pb-6 flex justify-end">
            <button
              onClick={handleProceedToTicket}
              disabled={isPastOrInactive || hasActiveService}
              className={`bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-10 rounded-full transition text-lg ${
                isPastOrInactive || hasActiveService ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {hasActiveService ? 'Service in Progress' : 'View Ticket'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserService;