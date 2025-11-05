import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
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
  if (!serviceId) return;

  const fetchDetails = async () => {
    try {
      const [svcRes, typesRes] = await Promise.all([
        getRoomServiceById(serviceId),
        getAllServicesTypes()
      ]);

      const svc = svcRes.data.data;
      setService(svc);

      const checked = Array.isArray(svc.serviceTypeIds)
        ? Object.fromEntries(svc.serviceTypeIds.map(id => [id, true]))
        : { [svc.serviceTypeId]: true };
      setSuppliesChecked(checked);

      setServiceTypes(typesRes.data.data);

      let roomId = svc.roomId;
      if (!roomId) {
        const allBookingsRes = await getAllBookings();
        const bookingFound = allBookingsRes.data.data.find(
          (b) => b.id === svc.bookingId
        );
        roomId = bookingFound?.roomId;
      }
      if (!roomId) throw new Error("No pude determinar el roomId");

      const roomRes = await getRoomById(roomId);
      const roomData = roomRes.data.data;
      setRoom(roomData);

      if (roomData.lastClean) {
        setLastCleaning({
          cleanedAt: roomData.lastClean,
          comments: ""
        });
      }

      const activeRes = await getActiveBookingByRoomId(roomId);
      let activeBooking = activeRes.data.data[0] ?? null;
      if (!activeBooking) {
        const allRes = await getAllBookings();
        activeBooking = allRes.data.data.find((b) => b.roomId === roomId) ?? null;
      }
      setBooking(activeBooking);

    } catch (err) {
      console.error("Error al cargar detalles:", err);
      setError("No se pudieron cargar los datos");
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

    if (error) return <div></div>;
    if (!service || !room) return <div>Cargando habitación…</div>;

    return (
    <div className="flex h-screen bg-blue-50">
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded mr-4"
            >
              <FaChevronLeft size={20} />
            </button>
            <h1 className="flex-1 text-center font-jomolhari text-3xl">
              Room: {room.roomNumber}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <img
              alt="Room"
              className="w-full md:w-1/3 max-h-64 object-cover rounded-lg"
              src={imagesUrl[room.roomType.name] || room.imageUrl || "/default-room.jpg"}
            />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg flex flex-col gap-2">
                <p>
                  <strong>Estado:</strong> {formatStatus(room.roomStatus)}
                </p>
                <p>
                  <strong>Tipo de habitación:</strong> {room.roomType.name}
                </p>
                {booking && (
                  <>
                    <p>
                      <strong>Check-in:</strong> {booking.checkIn}
                    </p>
                    <p>
                      <strong>Check-out:</strong> {booking.checkOut}
                    </p>
                  </>
                )}
                {lastCleaning && (
                  <p>
                    <strong>Última limpieza:</strong>{" "}
                    {lastCleaning.cleanedAt}
                  </p>
                )}
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="font-medium mb-2">Service Types</h2>
                <ul className="grid grid-cols-2 gap-4">
                  {serviceTypes.map(type => (
                    <li key={type.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`srv-type-${type.id}`}
                        checked={!!suppliesChecked[type.id]}
                        disabled
                        className="form-checkbox w-6 h-6 black mr-2 cursor-not-allowed opacity-80 "
                      />
                      <label 
                        htmlFor={`srv-type-${type.id}`}
                        className="cursor-not-allowed text-gray-700"
                      >
                        {type.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-100 rounded-lg">
              <label
                className="block font-medium mb-1"
                htmlFor="problem"
              >
                Problem:
              </label>
              <textarea
                id="problem"
                className="w-full h-24 p-2 rounded"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-medium mb-1">Special request:</p>
              <p>{service.roomServiceDescription}</p>
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

          <div className="flex justify-between">
            {!isServiceCompleted && (
              <button
                onClick={handleMarkClean}
                className="bg-[#f2789f] hover:bg-[#e76b91] text-white py-2 px-6 rounded-full"
              >
                Mark as clean
              </button>
            )}
            {isServiceCompleted && (
              <button
                disabled
                className="bg-gray-300 text-gray-600 py-2 px-6 rounded-full cursor-not-allowed opacity-50"
              >
                Already cleaned
              </button>
            )}
            <button
              onClick={handleSubmitInventory}
              disabled={isServiceCompleted}
              className={`py-2 px-6 rounded-full ${
                isServiceCompleted
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"
                  : "bg-[#f2789f] hover:bg-[#e76b91] text-white"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default RoomDetailServicePage;