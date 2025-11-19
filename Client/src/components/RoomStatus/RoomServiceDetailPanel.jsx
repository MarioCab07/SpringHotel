import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import MaterialRequestForm from "../MaterialRequest/MaterialRequestForm";
import {
  getRoomById,
  getActiveBookingByRoomId,
  getRoomServiceById,
  getAllBookings,
  getAllServicesTypes,
  PostRoomCleaningRecord,
  updateRoomService,
  getAllCategories,
  getAllInventoryItems,
  updateItemQuantity,
  GetUserDetails,
} from "../../service/api.services";

const RoomServiceDetailPanel = ({ isOpen, serviceId, onClose, onSuccess, role }) => {
  const [room, setRoom] = useState(null);
  const [service, setService] = useState(null);
  const [booking, setBooking] = useState(null);
  const [lastCleaning, setLastCleaning] = useState(null);
  const [problem, setProblem] = useState("");
  const [suppliesChecked, setSuppliesChecked] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isServiceCompleted = service?.roomServiceStatus === "COMPLETED";
  const [serviceTypes, setServiceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  const [showMaterialRequest, setShowMaterialRequest] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const isAdmin = role === "ADMIN";
  const isCleaningStaff = role === "CLEANING_STAFF";

  const imagesUrl = {
    Suite: "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
    "Double Room": "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
    "Single Room": "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
  };

  const formatStatus = (s = "") => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const fetchDetails = async () => {
    if (!serviceId) return;
      setLoading(true);
      try {
        const [svcRes, typesRes] = await Promise.all([
          getRoomServiceById(serviceId),
          getAllServicesTypes(),
        ]);

        const svc = svcRes.data.data;
        setService(svc);

        const checked = Array.isArray(svc.serviceTypeIds)
          ? Object.fromEntries(svc.serviceTypeIds.map((id) => [id, true]))
          : { [svc.serviceTypeId]: true };
        setSuppliesChecked(checked);

        setServiceTypes(typesRes.data.data);

        let roomId = svc.roomId;
        if (!roomId) {
          const allBookingsRes = await getAllBookings();
          const bookingFound = allBookingsRes.data.data.find((b) => b.id === svc.bookingId);
          roomId = bookingFound?.roomId;
        }
        if (!roomId) throw new Error("No pude determinar el roomId");

        const roomRes = await getRoomById(roomId);
        const roomData = roomRes.data.data;
        setRoom(roomData);

        if (roomData.lastClean) {
          setLastCleaning({
            cleanedAt: roomData.lastClean,
            comments: "",
          });
        }

        // Intentar obtener reserva activa, pero no fallar si no existe
        let activeBooking = null;
        try {
          const activeRes = await getActiveBookingByRoomId(roomId);
          activeBooking = activeRes.data.data?.[0] ?? null;
        } catch (err) {
          // Si no hay reserva activa (404), es un caso válido, intentar buscar en todas las reservas
          if (err.response?.status === 404 || err.status === 404) {
            try {
              const allRes = await getAllBookings();
              activeBooking = allRes.data.data?.find((b) => b.roomId === roomId) ?? null;
            } catch (bookingErr) {
              console.log("No se encontró reserva para esta habitación");
            }
          } else {
            // Si es otro tipo de error, lo registramos pero no detenemos la carga
            console.warn("Error al obtener reserva activa:", err);
          }
        }
        setBooking(activeBooking);
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        setError("No se pudieron cargar los datos");
        toast.error("Error al cargar los detalles del servicio");
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    if (!isOpen || !serviceId) return;
    fetchDetails();
  }, [isOpen, serviceId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userRes = await GetUserDetails();
        setCurrentUserId(userRes.data.data.userId);
      } catch (err) {
        console.error("Error obteniendo userId:", err);
      }
    };
    if (isOpen) {
      fetchUserId();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchInventory = async () => {
      try {
        const [catRes, itemsRes] = await Promise.all([
          getAllCategories(),
          getAllInventoryItems(),
        ]);

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
  const toggleItem = (itemId) =>
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  const changeQty = (itemId, qty) =>
    setItemQuantities((prev) => ({ ...prev, [itemId]: qty }));

  const handleMarkClean = async () => {
    const getShift = () => {
      const hour = new Date().getHours();
      return hour >= 6 && hour < 18 ? "MORNING" : "EVENING";
    };

    if (!room || !room.roomId) {
      toast.error("No se pudo obtener la información de la habitación");
      return;
    }

    if (!currentUserId) {
      toast.error("No se pudo obtener la información del usuario");
      return;
    }

    try {
      const payload = {
        roomId: room.roomId,
        userId: currentUserId,
        status: "COMPLETED",
        cleanedAt: new Date().toISOString(),
        comments: problem || "",
        shift: getShift(),
      };
      await PostRoomCleaningRecord(payload);
      setLastCleaning(payload);
      await updateRoomService(serviceId, {
        roomServiceStatus: "COMPLETED",
        serviceTypeIds: service.serviceTypeIds || [],
      });
      toast.success("Habitación marcada como limpia");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo marcar como limpia: " + (err.response?.data?.message || err.message || "Error desconocido"));
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
            await updateItemQuantity(it.id, newQty);
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

      <div className="relative ml-auto w-full md:w-1/2 h-full bg-white shadow-xl flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg font-semibold text-gray-900">
            {room ? `Room: ${room.roomNumber}` : "Detalles del Servicio"}
          </h2>
          <div className="w-10" />
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 max-w-full">
            {loading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-base">Cargando detalles...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-red-500">
                <p className="text-base">{error}</p>
              </div>
            )}

            {!loading && !error && room && service && (
              <>
                {/* Room Image and Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Room Image */}
                  <div className="lg:col-span-1">
                    <div className="w-full h-48 lg:h-full max-h-64 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        alt="Room"
                        className="w-full h-full object-cover"
                        src={
                          imagesUrl[room.roomType.name] ||
                          room.imageUrl ||
                          "/default-room.jpg"
                        }
                      />
                    </div>
                  </div>

                  {/* Room Details and Service Types */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Room Details Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                        Información de Habitación
                      </h3>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">Estado</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatStatus(room.roomStatus)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">Tipo de habitación</span>
                          <span className="text-sm font-medium text-gray-900">
                            {room.roomType.name}
                          </span>
                        </div>
                        {booking && (
                          <>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 mb-1">Check-in</span>
                              <span className="text-sm font-medium text-gray-900">
                                {booking.checkIn}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 mb-1">Check-out</span>
                              <span className="text-sm font-medium text-gray-900">
                                {booking.checkOut}
                              </span>
                            </div>
                          </>
                        )}
                        {lastCleaning && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Última limpieza</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(lastCleaning.cleanedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Types Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                        Tipos de Servicio
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {Object.keys(suppliesChecked).length > 0 ? (
                          serviceTypes
                            .filter((type) => suppliesChecked[type.id])
                            .map((type) => (
                              <div
                                key={type.id}
                                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                              >
                                <input
                                  type="checkbox"
                                  id={`srv-type-${type.id}`}
                                  checked={!!suppliesChecked[type.id]}
                                  disabled
                                  className="w-4 h-4 text-gray-600 border-gray-300 rounded cursor-not-allowed opacity-60"
                                  readOnly
                                />
                                <label
                                  htmlFor={`srv-type-${type.id}`}
                                  className="flex-1 text-sm text-gray-700 cursor-not-allowed break-words"
                                >
                                  {type.name}
                                </label>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-gray-500">No hay servicios solicitados</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem and Special Request */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Problem Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide"
                      htmlFor="problem"
                    >
                      Problema
                    </label>
                    <textarea
                      id="problem"
                      className="w-full h-32 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-transparent resize-none text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      disabled={isServiceCompleted}
                      placeholder={
                        isServiceCompleted
                          ? "Servicio completado"
                          : "Describe el problema..."
                      }
                    />
                  </div>

                  {/* Special Request Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Solicitud Especial
                    </h3>
                    <div className="min-h-[8rem] p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {service.roomServiceDescription || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inventory Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {showMaterialRequest && isCleaningStaff ? "Solicitar Materiales" : "Inventario"}
                    </h3>
                    {isCleaningStaff && (
                      <button
                        onClick={() => setShowMaterialRequest(!showMaterialRequest)}
                        className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                          showMaterialRequest
                            ? "bg-gray-600 hover:bg-gray-700 text-white"
                            : "bg-[#D9C696] hover:bg-[#c5b386] text-gray-900 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {showMaterialRequest ? "← Volver a Inventario" : "Solicitar Materiales"}
                      </button>
                    )}
                  </div>
                  
                  {showMaterialRequest && isCleaningStaff ? (
                    <div className="w-full">
                      <MaterialRequestForm
                        onSuccess={() => {
                          setShowMaterialRequest(false);
                          fetchDetails(); // Recargar datos
                        }}
                        onCancel={() => setShowMaterialRequest(false)}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex-1">
                    {!isServiceCompleted && (
                      <button
                        onClick={handleMarkClean}
                        className="w-full sm:w-auto bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 py-2.5 px-6 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
                      >
                        Mark as clean
                      </button>
                    )}
                    {isServiceCompleted && (
                      <button
                        disabled
                        className="w-full sm:w-auto bg-gray-300 text-gray-600 py-2.5 px-6 rounded-lg cursor-not-allowed opacity-50 text-sm font-semibold"
                      >
                        Already cleaned
                      </button>
                    )}
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={handleSubmitInventory}
                      disabled={isServiceCompleted}
                      className={`w-full sm:w-auto py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
                        isServiceCompleted
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"
                          : "bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                    >
                      Submit Inventory
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RoomServiceDetailPanel;

