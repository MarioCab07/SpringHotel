import React, { useState, useEffect, useRef } from "react";
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
  updateItemQuantityWithLog,
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

  const [serviceTypes, setServiceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  const [showCategories, setShowCategories] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const materialRequestFormRef = useRef(null);

  const isAdmin = role === "ADMIN";
  const isCleaningStaff = role === "CLEANING_STAFF";
  const isEmployee = role === "EMPLOYEE";
  const canShowCategoriesButton = isCleaningStaff || isEmployee || isAdmin;

  const imagesUrl = {
    Suite: "https://www.acevivillarroelbarcelona.com/img/jpg/habitaciones/Hab-Deluxe-01.jpg",
    "Double Room": "https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg",
    "Single Room": "https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07003-HDR-Edit-Edit-1.jpg",
  };

  const formatStatus = (s = "") => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  //–––––––––––––––––––––––––––––––––––––––––––––
  // ESTADOS DEL SERVICIO
  //–––––––––––––––––––––––––––––––––––––––––––––
  const isCompleted = service?.roomServiceStatus === "COMPLETED";
  const isCanceled = service?.roomServiceStatus === "CANCELED";
  const isInProgress = service?.roomServiceStatus === "IN_PROGRESS";
  const isPending = service?.roomServiceStatus === "PENDING";

  // SOLO BLOQUEA EN COMPLETED O CANCELED
  const disableEverything = isCompleted || isCanceled;

  //–––––––––––––––––––––––––––––––––––––––––––––

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

      let activeBooking = null;
      try {
        const activeRes = await getActiveBookingByRoomId(roomId);
        activeBooking = activeRes.data.data?.[0] ?? null;
      } catch (err) {
        if (err.response?.status === 404 || err.status === 404) {
          try {
            const allRes = await getAllBookings();
            activeBooking = allRes.data.data?.find((b) => b.roomId === roomId) ?? null;
          } catch {}
        }
      }
      setBooking(activeBooking);
    } catch (err) {
      console.error("Error al cargar detalles:", err);
      setError("Failed to load data");
      toast.error("Error loading service details");
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
    if (isOpen) fetchUserId();
  }, [isOpen]);

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
        toast.error("Failed to load inventory");
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

    if (!room || !room.roomId) return toast.error("Failed to get room information");
    if (!currentUserId) return toast.error("Failed to get user information");

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

      toast.success("Room marked as clean");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as clean");
    }
  };

  const handleSubmitInventory = async () => {
    if (materialRequestFormRef.current?.submit) {
      materialRequestFormRef.current.submit();
    } else {
      toast.error("Could not submit inventory");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative ml-auto w-full md:w-1/2 h-full bg-white shadow-xl flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg font-semibold text-gray-900">
            {room ? `Room: ${room.roomNumber}` : "Service Details"}
          </h2>
          <div className="w-10" />
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {loading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-base">Loading details...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && room && service && (
              <>
                {/* Image + Room Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="w-full h-48 lg:h-full rounded-xl overflow-hidden bg-gray-100">
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

                  {/* Room + Service Types */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* ROOM INFO */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
                        Room Information
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500">Status</span>
                          <p className="text-sm font-medium">{formatStatus(room.roomStatus)}</p>
                        </div>

                        <div>
                          <span className="text-xs text-gray-500">Room Type</span>
                          <p className="text-sm font-medium">{room.roomType.name}</p>
                        </div>

                        {booking && (
                          <>
                            <div>
                              <span className="text-xs text-gray-500">Check-in</span>
                              <p className="text-sm font-medium">{booking.checkIn}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Check-out</span>
                              <p className="text-sm font-medium">{booking.checkOut}</p>
                            </div>
                          </>
                        )}

                        {lastCleaning && (
                          <div>
                            <span className="text-xs text-gray-500">Last Cleaning</span>
                            <p className="text-sm font-medium">
                              {new Date(lastCleaning.cleanedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SERVICE TYPES */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
                        Service Types
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
                                  checked
                                  disabled
                                  className="w-4 h-4 opacity-60 cursor-not-allowed"
                                />
                                <span className="text-sm text-gray-700">{type.name}</span>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-gray-500">No services requested</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATUS MESSAGES */}
                {isCompleted && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
                    <p className="text-sm font-medium">This service was completed</p>
                  </div>
                )}

                {isCanceled && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                    <p className="text-sm font-medium">This service was canceled</p>
                  </div>
                )}

                {/* PROBLEM + REQUEST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PROBLEM */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase">
                      Problem
                    </label>

                    <textarea
                      className="w-full h-32 p-3 rounded-lg border border-gray-300 focus:ring-[#D9C696] text-sm resize-none"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      disabled={disableEverything}
                      placeholder={
                        isCompleted
                          ? "Service completed"
                          : isCanceled
                          ? "Service canceled"
                          : "Describe the problem..."
                      }
                    />
                  </div>

                  {/* SPECIAL REQUEST */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                      Special Request
                    </h3>
                    <div className="min-h-[8rem] p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 break-words">
                        {service.roomServiceDescription || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* INVENTORY FORM */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Inventory
                    </h3>

                    {canShowCategoriesButton && (
                      <button
                        onClick={() => setShowCategories(!showCategories)}
                        className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                          showCategories
                            ? "bg-gray-600 hover:bg-gray-700 text-white"
                            : "bg-[#D9C696] hover:bg-[#c5b386] text-gray-900"
                        }`}
                      >
                        {showCategories ? "Hide Categories" : "Show Categories"}
                      </button>
                    )}
                  </div>

                  <MaterialRequestForm
                    ref={materialRequestFormRef}
                    onSuccess={fetchDetails}
                    currentUserId={currentUserId}
                    directConsume={true}
                    showNotes={true}
                    showCategories={showCategories}
                    hideSubmitButton={true}
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex-1">
                    {/* MARK CLEAN */}
                    {isCompleted && (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-2.5 px-6 rounded-lg cursor-not-allowed opacity-50 text-sm font-semibold"
                      >
                        Already cleaned
                      </button>
                    )}

                    {isCanceled && (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-2.5 px-6 rounded-lg cursor-not-allowed opacity-50 text-sm font-semibold"
                      >
                        Canceled
                      </button>
                    )}

                    {isPending || isInProgress ? (
                      <button
                        onClick={handleMarkClean}
                        className="w-full bg-[#D9C696] hover:bg-[#c5b386] text-gray-900 py-2.5 px-6 rounded-lg text-sm font-semibold shadow-md"
                      >
                        Mark as clean
                      </button>
                    ) : null}
                  </div>

                  <div className="flex-1 flex justify-end">
                    {/* SUBMIT INVENTORY */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!disableEverything) handleSubmitInventory();
                      }}
                      disabled={disableEverything}
                      className={`w-full sm:w-auto py-2.5 px-6 rounded-lg text-sm font-semibold transition-all ${
                        disableEverything
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"
                          : "bg-[#D9C696] hover:bg-[#c5b386] text-gray-900 shadow-md"
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