import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  getAllCategories,
  getAllInventoryItems,
  updateInventoryItem,
} from "../../service/api.services";

const ServiceDetailPanel = ({ isOpen, serviceId, onClose, onMarkClean, userId }) => {
  const [room, setRoom] = useState(null);
  const [service, setService] = useState(null);
  const [booking, setBooking] = useState(null);
  const [lastCleaning, setLastCleaning] = useState(null);
  const [problem, setProblem] = useState("");
  const [suppliesChecked, setSuppliesChecked] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isServiceCompleted = service?.roomServiceStatus === "COMPLETED";
  const [serviceTypes, setServiceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [expandedCats, setExpandedCats] = useState({});

  const imagesUrl = {
    Suite: "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
    "Double Room": "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
    "Single Room": "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
  };

  const formatStatus = (s = "") => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  useEffect(() => {
    if (!isOpen || !serviceId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [svcRes, typesRes] = await Promise.all([
          getRoomServiceById(serviceId),
          getAllServicesTypes(),
        ]);

        const svc = svcRes?.data?.data || svcRes?.data;
        if (!svc) {
          throw new Error("No se encontró el servicio");
        }
        setService(svc);

        const checked = Array.isArray(svc.serviceTypeIds)
          ? Object.fromEntries(svc.serviceTypeIds.map((id) => [id, true]))
          : svc.serviceTypeId
          ? { [svc.serviceTypeId]: true }
          : {};
        setSuppliesChecked(checked);

        setServiceTypes(typesRes?.data?.data || typesRes?.data || []);

        let roomId = svc.roomId;
        if (!roomId && svc.bookingId) {
          try {
            const allBookingsRes = await getAllBookings();
            const bookingFound = allBookingsRes?.data?.data?.find((b) => b.id === svc.bookingId);
            roomId = bookingFound?.roomId;
          } catch (e) {
            console.error("Error fetching bookings:", e);
          }
        }

        if (roomId) {
          const roomRes = await getRoomById(roomId);
          const roomData = roomRes?.data?.data || roomRes?.data;
          if (roomData) {
            setRoom(roomData);

            if (roomData.lastClean) {
              setLastCleaning({
                cleanedAt: roomData.lastClean,
                comments: "",
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
        }
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        setError(err?.message || "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, serviceId]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchInventory = async () => {
      try {
        const [catRes, itemsRes] = await Promise.all([getAllCategories(), getAllInventoryItems()]);

        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data;
        const items = Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data.data;

        setCategories(cats);
        setInventoryItems(items);

        const initChecked = {};
        const initQty = {};
        const initExpanded = {};
        cats.forEach((c) => (initExpanded[c.id] = false));
        items.forEach((i) => {
          initChecked[i.id] = false;
          initQty[i.id] = "";
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
  }, [isOpen]);

  const toggleCategory = (catId) =>
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  const toggleItem = (itemId) => setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  const changeQty = (itemId, qty) => setItemQuantities((prev) => ({ ...prev, [itemId]: qty }));

  const handleMarkClean = async () => {
    if (!room || !service || !userId) {
      toast.error("Faltan datos necesarios");
      return;
    }
    try {
      const payload = {
        roomId: room.roomId,
        userId: userId,
        status: "COMPLETED",
        cleanedAt: new Date().toISOString(),
        comments: "",
      };
      await PostRoomCleaningRecord(payload);
      setLastCleaning(payload);
      toast.success("Habitación marcada limpia");
      if (onMarkClean) onMarkClean();
      onClose();
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

      const item = inventoryItems.find((i) => i.id === itemId);
      if (!item) continue;

      if (used > item.quantity) {
        toast.error(`No hay suficiente "${item.name}". Solo quedan ${item.quantity}.`);
        return;
      }
    }

    try {
      await Promise.all(
        inventoryItems.map(async (it) => {
          const used = Number(itemQuantities[it.id]);
          if (checkedItems[it.id] && used > 0) {
            const newQty = it.quantity - used;
            const payload = {
              name: it.name,
              type: it.type,
              quantity: newQty,
              status: it.status,
              categoryId: it.categoryId,
            };
            await updateInventoryItem(it.id, payload);
          }
        })
      );

      setInventoryItems((prev) =>
        prev.map((it) => {
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <FaChevronLeft size={16} className="text-gray-700" />
          </button>
          <h2 className="text-base font-semibold text-gray-900">
            {room ? `Room ${room.roomNumber}` : `Service #${serviceId}`}
          </h2>
          <div className="w-8" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-6">
              <p className="text-xs text-gray-600">Cargando detalles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-xs text-red-600 mb-3 break-words">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          ) : service ? (
            <>
              {/* Información del servicio */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Información del Servicio</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p className="truncate">
                    <span className="text-gray-500">Service ID:</span>{" "}
                    <span className="text-gray-900 font-medium">{service.roomServiceId || serviceId}</span>
                  </p>
                  <p className="truncate">
                    <span className="text-gray-500">Estado:</span>{" "}
                    <span className="text-gray-900 font-medium capitalize">
                      {service.roomServiceStatus?.toLowerCase().replace("_", " ") || "N/A"}
                    </span>
                  </p>
                  {service.bookingId && (
                    <p className="truncate">
                      <span className="text-gray-500">Booking ID:</span>{" "}
                      <span className="text-gray-900 font-medium">{service.bookingId}</span>
                    </p>
                  )}
                  {service.roomId && (
                    <p className="truncate">
                      <span className="text-gray-500">Room ID:</span>{" "}
                      <span className="text-gray-900 font-medium">{service.roomId}</span>
                    </p>
                  )}
                </div>
              </div>

              {room && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <img
                      alt="Room"
                      className="w-full sm:w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      src={imagesUrl[room.roomType?.name] || room.imageUrl || "/default-room.jpg"}
                    />

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-2">
                        <p className="text-xs">
                          <span className="text-gray-500">Estado:</span>{" "}
                          <span className="text-gray-900 font-medium">{formatStatus(room.roomStatus)}</span>
                        </p>
                        {room.roomType && (
                          <p className="text-xs">
                            <span className="text-gray-500">Tipo:</span>{" "}
                            <span className="text-gray-900 font-medium truncate">{room.roomType.name}</span>
                          </p>
                        )}
                        {booking && (
                          <>
                            <p className="text-xs">
                              <span className="text-gray-500">Check-in:</span>{" "}
                              <span className="text-gray-900 font-medium text-xs">{booking.checkIn}</span>
                            </p>
                            <p className="text-xs">
                              <span className="text-gray-500">Check-out:</span>{" "}
                              <span className="text-gray-900 font-medium text-xs">{booking.checkOut}</span>
                            </p>
                          </>
                        )}
                        {lastCleaning && (
                          <p className="text-xs">
                            <span className="text-gray-500">Última limpieza:</span>{" "}
                            <span className="text-gray-900 font-medium text-xs">{lastCleaning.cleanedAt}</span>
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 mb-2">Service Types</h4>
                        <ul className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto">
                          {serviceTypes.map((type) => (
                            <li key={type.id} className="flex items-center min-w-0">
                              <input
                                type="checkbox"
                                id={`srv-type-${type.id}`}
                                checked={!!suppliesChecked[type.id]}
                                disabled
                                className="w-3 h-3 text-[#D9C696] border-gray-300 rounded cursor-not-allowed opacity-60 mr-1.5 flex-shrink-0"
                              />
                              <label
                                htmlFor={`srv-type-${type.id}`}
                                className="text-xs text-gray-700 cursor-not-allowed truncate"
                              >
                                {type.name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-0">
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5" htmlFor="problem">
                    Problem:
                  </label>
                  <textarea
                    id="problem"
                    className="w-full h-20 p-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition text-xs text-gray-900 resize-none"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Describe el problema..."
                  />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 mb-1.5">Special request:</p>
                  <p className="text-xs text-gray-700 break-words max-h-20 overflow-y-auto">
                    {service.roomServiceDescription || "—"}
                  </p>
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

              <div className="flex flex-wrap justify-between gap-2 pt-3 border-t border-gray-200">
                {!isServiceCompleted && (
                  <button
                    onClick={handleMarkClean}
                    disabled={!room}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ease-in-out ${
                      !room
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 shadow-sm hover:shadow-md"
                    }`}
                  >
                    Mark as clean
                  </button>
                )}
                {isServiceCompleted && (
                  <button
                    disabled
                    className="px-4 py-1.5 bg-gray-200 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed"
                  >
                    Already cleaned
                  </button>
                )}
                <button
                  onClick={handleSubmitInventory}
                  disabled={isServiceCompleted}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ease-in-out ${
                    isServiceCompleted
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  Submit Inventory
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-gray-600">No se encontró el servicio</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ServiceDetailPanel;

