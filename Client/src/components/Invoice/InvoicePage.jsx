import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    GetUserDetails,
    getUserBookings,
    getRoomById,
    getAllServicesTypes,
    createRoomService,
} from '../../service/api.services';

const InvoicePage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedServices = [], specialRequest = '' } = location.state || {};
  const [serviceDetails, setServiceDetails] = useState([]);
  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

 useEffect(() => {
    const loadTypes = async () => {
      try {
        const typesRes = await getAllServicesTypes();
        const types = typesRes.data.data;
        const details = selectedServices.map(id => {
          const t = types.find(x => x.id === id) || {};
          return { id, name: t.name || 'Servicio desconocido', price: t.price || 0 };
        });
        setServiceDetails(details);
      } catch (err) {
        console.error(err);
      }
    };
    if (selectedServices.length) loadTypes();
  }, [selectedServices]);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const userRes = await GetUserDetails();
        const userId = userRes.data.data.userId;
        const ubRes = await getUserBookings(userId);
        const found = ubRes.data.data.find(b => b.id === Number(bookingId));
        setBooking(found);
        const rRes = await getRoomById(found.roomId);
        setRoom(rRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadBooking();
  }, [bookingId]);

  if (!booking || !room) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Cargando...</div>;
  }


    const serviceSubtotal = serviceDetails.reduce((sum, s) => sum + s.price, 0);
    const tax = parseFloat((serviceSubtotal * 0.1).toFixed(2));
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const roomSubtotal = room.roomType.price * nights;
    const total = parseFloat((serviceSubtotal + tax + roomSubtotal).toFixed(2));

    if (!selectedServices.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">No hay servicios seleccionados.</p>
        <button
          onClick={() => navigate(`/bookings/${bookingId}`)}
          className="ml-4 bg-gray-200 px-4 py-2 rounded"
        >
          Volver a servicios
        </button>
      </div>
    );
  }

   const handlePayment = async () => {
  setProcessing(true);
  setError('');
  try {
    await createRoomService({
      bookingId: Number(bookingId),
      serviceTypeIds: selectedServices,
      roomServiceDescription: specialRequest,
      roomServiceStatus: 'PENDING',
      requestedAt: new Date().toISOString(),
    });
    navigate(`/rooms`);
  } catch (err) {
    console.error(err);
    setError(err.message || 'Error al procesar pago.');
  } finally {
    setProcessing(false);
  }
};

  return (
   <div className="min-h-screen bg-[#D6ECF7] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 p-6 text-center">
          <h1 className="text-2xl font-semibold">TICKET DE SERVICIOS</h1>
          <p className="mt-2 text-lg">Reserva #{bookingId}</p>
        </div>

        {/* Room Details */}
        {booking && room && (
          <div className="p-6 border-b">
            <h2 className="font-semibold mb-2">Detalles de Habitación</h2>
            <p><strong>Tipo:</strong> {room.roomType.name}</p>
            <p><strong>Precio por noche:</strong> ${room.roomType.price.toFixed(2)}</p>
            <p><strong>Noches:</strong> {nights}</p>
            <p><strong>Subtotal Habitación:</strong> ${roomSubtotal.toFixed(2)}</p>
          </div>
        )}

        {/* Special Request */}
        {specialRequest && (
          <div className="p-6 border-b">
            <h2 className="font-semibold mb-2">Special Request</h2>
            <p>{specialRequest}</p>
          </div>
        )}

        {/* Services Table */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Servicios Solicitados</h2>
          <table className="w-full mb-6 text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Servicio</th>
                <th className="pb-2">Precio</th>
                <th className="pb-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {serviceDetails.map((s, idx) => (
                <tr key={s.id ?? idx} className="border-b">
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">${s.price.toFixed(2)}</td>
                  <td className="py-2 text-right">${s.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-4 font-semibold">SubTotal Servicios</td>
                <td></td>
                <td className="pt-4 text-right">${serviceSubtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">IVA (10%)</td>
                <td></td>
                <td className="py-1 text-right">${tax.toFixed(2)}</td>
              </tr>
              <tr className="border-t">
                <td className="pt-2 font-semibold">TOTAL</td>
                <td></td>
                <td className="pt-2 text-right font-bold">${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Actions */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => navigate(`/bookings/${bookingId}`)}
              className="bg-white border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50"
              disabled={processing}
            >
              Back to Services
            </button>
            <button
              onClick={handlePayment}
              className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-full"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Pay'}
            </button>
          </div>
          {error && <p className="text-center text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;