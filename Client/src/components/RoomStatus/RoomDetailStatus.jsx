import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import InventoryByCategory from "./InventoryByCategory";

import {
  getRoomById,
  getActiveBookingByRoomId,
  getRoomServiceById,
  getAllBookings,
  getAllServicesTypes,
  PostRoomCleaningRecord,
  updateRoomCleaning,
  getAllCategories,
  getAllInventoryItems,
  updateInventoryItem,
} from "../../service/api.services";

const RoomDetailServicePage = () => {
    const { serviceId: serviceIdParam } = useParams();
    const serviceId = Number(serviceIdParam);
    const [room, setRoom] = useState(null);
    const [service, setService] = useState(null);                           
    const [booking, setBooking] = useState(null);
    const [lastCleaning, setLastCleaning] = useState(null);           
    const [problem, setProblem] = useState("");
    const [suppliesChecked, setSuppliesChecked] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isServiceCompleted = service?.roomServiceStatus === "COMPLETED";
    const [serviceTypes, setServiceTypes] = useState([]);
    const [categories, setCategories]         = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [checkedItems, setCheckedItems]     = useState({});
    const [itemQuantities, setItemQuantities] = useState({});
    const [expandedCats, setExpandedCats]     = useState({});
    const [dirty, setDirty] = useState(false);

    const imagesUrl = {
  Suite:
    "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
  "Double Room":
    "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
  "Single Room":
    "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
};

    const formatStatus = (s = "") =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

useEffect(() => {
  if (!serviceId) {
    setError("No se proporcionó un ID de servicio");
    setLoading(false);
    return;
  }

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching service with ID:", serviceId);
      const [svcRes, typesRes] = await Promise.all([
        getRoomServiceById(serviceId),
        getAllServicesTypes()
      ]);

      console.log("Service response:", svcRes);
      console.log("Types response:", typesRes);

      const svc = svcRes?.data?.data || svcRes?.data;
      if (!svc) {
        throw new Error("No se encontró el servicio");
      }
      setService(svc);

      const checked = Array.isArray(svc.serviceTypeIds)
        ? Object.fromEntries(svc.serviceTypeIds.map(id => [id, true]))
        : svc.serviceTypeId ? { [svc.serviceTypeId]: true } : {};
      setSuppliesChecked(checked);

      setServiceTypes(typesRes?.data?.data || typesRes?.data || []);

      let roomId = svc.roomId;
      if (!roomId && svc.bookingId) {
        try {
          const allBookingsRes = await getAllBookings();
          const bookingFound = allBookingsRes?.data?.data?.find(
            (b) => b.id === svc.bookingId
          );
          roomId = bookingFound?.roomId;
        } catch (e) {
          console.error("Error fetching bookings:", e);
        }
      }
      
      if (!roomId) {
        console.warn("No se pudo determinar el roomId, pero continuando...");
        setLoading(false);
        return;
      }

      const roomRes = await getRoomById(roomId);
      const roomData = roomRes?.data?.data || roomRes?.data;
      if (roomData) {
        setRoom(roomData);

        if (roomData.lastClean) {
          setLastCleaning({
            cleanedAt: roomData.lastClean,
            comments: ""
          });
        }
      }

      try {
        const activeRes = await getActiveBookingByRoomId(roomId);
        let activeBooking = activeRes?.data?.data?.[0] ?? null;
        if (!activeBooking) {
          const allRes = await getAllBookings();
          activeBooking = allRes?.data?.data?.find((b) => b.roomId === roomId) ?? null;
        }
        setBooking(activeBooking);
      } catch (e) {
        console.error("Error fetching booking:", e);
      }

    } catch (err) {
      console.error("Error al cargar detalles:", err);
      setError(err?.message || "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [serviceId]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const [catRes, itemsRes] = await Promise.all([
          getAllCategories(),
          getAllInventoryItems()
        ]);

        const cats  = Array.isArray(catRes.data)   ? catRes.data   : catRes.data.data;
        const items = Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data.data;

        setCategories(cats);
        setInventoryItems(items);

        const initChecked  = {};
        const initQty      = {};
        const initExpanded = {};
        cats.forEach(c  => initExpanded[c.id] = false);
        items.forEach(i => {
          initChecked[i.id]     = false;
          initQty[i.id]         = "";
        });
        setCheckedItems(initChecked);
        setItemQuantities(initQty);
        setExpandedCats(initExpanded);

      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar inventario");
      }
    };
    fetchInventory();
  }, []);

  const toggleCategory = catId =>
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  const toggleItem = itemId =>
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  const changeQty = (itemId, qty) =>
    setItemQuantities(prev => ({ ...prev, [itemId]: qty }));

  const handleMarkClean = async () => {
    try {
      const payload = {
        roomId:    room.roomId,
        userId:    service.userId,
        status:    "COMPLETED",
        cleanedAt: new Date().toISOString(),
        comments:  ""
      };
      const res = await PostRoomCleaningRecord(payload);
      setLastCleaning(res.data.data);
      toast.success("Habitación marcada limpia");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo marcar como limpia");
    }
  };

const handleSubmitInventory = async () => {
  for (const itemIdStr in checkedItems) {
    const itemId = Number(itemIdStr);
    if (!checkedItems[itemId]) continue;
    const used = Number(itemQuantities[itemId]);
    if (used <= 0) continue;

    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) continue;

    if (used > item.quantity) {
      toast.error(`No hay suficiente "${item.name}". Solo quedan ${item.quantity}.`);
      return;
    }
  }

  try {
    await Promise.all(
      inventoryItems.map(async it => {
        const used = Number(itemQuantities[it.id]);
        if (checkedItems[it.id] && used > 0) {
          const newQty = it.quantity - used;
          const payload = {
            name:       it.name,
            type:       it.type,
            quantity:   newQty,
            status:     it.status,
            categoryId: it.categoryId
          };
          await updateInventoryItem(it.id, payload);
        }
      })
    );

    setInventoryItems(prev =>
      prev.map(it => {
        const used = Number(itemQuantities[it.id]);
        if (checkedItems[it.id] && used > 0) {
          return { ...it, quantity: it.quantity - used };
        }
        return it;
      })
    );

    setCheckedItems({});
    setItemQuantities({});

    toast.success("Inventario ajustado correctamente");
  } catch (err) {
    console.error("Error ajustando inventario:", err);
    toast.error("Ocurrió un error al ajustar el inventario");
  }
};

    // Mostrar información de debug
    console.log("Render state:", { serviceId, loading, error, service, room, booking });

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
            <p className="text-lg text-gray-600 mb-2">Cargando habitación…</p>
            <p className="text-sm text-gray-500">Service ID: {serviceId}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
            <p className="text-lg font-semibold text-red-600 mb-2">Error al cargar los datos</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <p className="text-xs text-gray-500 mb-6">Service ID: {serviceId}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-all duration-200"
              >
                Volver
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-5 py-2 bg-[#D9C696] hover:bg-[#c5b386] text-gray-900 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Mostrar información incluso si no hay service o room completo
    if (!service) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
            <p className="text-lg font-semibold text-gray-900 mb-2">Servicio no encontrado</p>
            <p className="text-sm text-gray-600 mb-4">No se pudo cargar el servicio con ID: {serviceId}</p>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-all duration-200"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }

    return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg mr-4 transition-colors"
            >
              <FaChevronLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="flex-1 text-2xl font-semibold text-gray-900">
              {room ? `Room ${room.roomNumber}` : `Service #${serviceId}`}
            </h1>
            <div className="text-xs text-gray-500">
              ID: {serviceId}
            </div>
          </div>

          {/* Información del servicio */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Información del Servicio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="text-gray-500 font-medium">Service ID:</span>{" "}
                <span className="text-gray-900">{service.roomServiceId || serviceId}</span>
              </p>
              <p>
                <span className="text-gray-500 font-medium">Estado:</span>{" "}
                <span className="text-gray-900">{service.roomServiceStatus || "N/A"}</span>
              </p>
              {service.bookingId && (
                <p>
                  <span className="text-gray-500 font-medium">Booking ID:</span>{" "}
                  <span className="text-gray-900">{service.bookingId}</span>
                </p>
              )}
              {service.roomId && (
                <p>
                  <span className="text-gray-500 font-medium">Room ID:</span>{" "}
                  <span className="text-gray-900">{service.roomId}</span>
                </p>
              )}
            </div>
          </div>

          {room && (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <img
                  alt="Room"
                  className="w-full md:w-1/3 max-h-64 object-cover rounded-lg"
                  src={imagesUrl[room.roomType?.name] || room.imageUrl || "/default-room.jpg"}
                />

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-3">
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">Estado:</span>{" "}
                      <span className="text-gray-900">{formatStatus(room.roomStatus)}</span>
                    </p>
                    {room.roomType && (
                      <p className="text-sm">
                        <span className="text-gray-500 font-medium">Tipo de habitación:</span>{" "}
                        <span className="text-gray-900">{room.roomType.name}</span>
                      </p>
                    )}
                    {booking && (
                      <>
                        <p className="text-sm">
                          <span className="text-gray-500 font-medium">Check-in:</span>{" "}
                          <span className="text-gray-900">{booking.checkIn}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500 font-medium">Check-out:</span>{" "}
                          <span className="text-gray-900">{booking.checkOut}</span>
                        </p>
                      </>
                    )}
                    {lastCleaning && (
                      <p className="text-sm">
                        <span className="text-gray-500 font-medium">Última limpieza:</span>{" "}
                        <span className="text-gray-900">{lastCleaning.cleanedAt}</span>
                      </p>
                    )}
                  </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3">Service Types</h2>
                <ul className="grid grid-cols-2 gap-3">
                  {serviceTypes.map(type => (
                    <li key={type.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`srv-type-${type.id}`}
                        checked={!!suppliesChecked[type.id]}
                        disabled
                        className="w-4 h-4 text-[#D9C696] border-gray-300 rounded cursor-not-allowed opacity-60 mr-2"
                      />
                      <label 
                        htmlFor={`srv-type-${type.id}`}
                        className="text-sm text-gray-700 cursor-not-allowed"
                      >
                        {type.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label
                className="block text-sm font-semibold text-gray-900 mb-2"
                htmlFor="problem"
              >
                Problem:
              </label>
              <textarea
                id="problem"
                className="w-full h-24 p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition text-sm text-gray-900"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe el problema..."
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">Special request:</p>
              <p className="text-sm text-gray-700">{service.roomServiceDescription || "—"}</p>
            </div>
          </div>

          <InventoryByCategory
            categories={categories}
            inventoryItems={inventoryItems}
            checkedItems={checkedItems}
            itemQuantities={itemQuantities}
            expandedCats={expandedCats}
            onToggleCategory={toggleCategory}
            onToggleItem={toggleItem}
            onChangeQty={changeQty}
          />

          <div className="flex justify-between gap-4 pt-4 border-t border-gray-200">
            {!isServiceCompleted && (
            <button
              onClick={handleMarkClean}
              disabled={!room}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
                !room 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              Mark as clean
            </button>
            )}
            {isServiceCompleted && (
              <button
                disabled
                className="px-5 py-2 bg-gray-200 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed"
              >
                Already cleaned
              </button>
            )}
            <button
              onClick={handleSubmitInventory}
              disabled={isServiceCompleted}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
                isServiceCompleted
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              Submit Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default RoomDetailServicePage;