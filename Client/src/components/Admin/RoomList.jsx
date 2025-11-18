import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getAllRooms } from "../../service/api.services";
import { useAuth } from "../../context/AuthContext";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import RegisterRoom from "./RegisterRoom";
import UpdateRoom from "./UpdateRoom";
import DeleteRoom from "./DeleteRoom";

const RoomList = forwardRef((props, ref) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const role = sessionStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getAllRooms();
      if (response.status === 200) {
        setRooms(response.data.data);
      }
    } catch (error) {
      toast.error("Error al cargar las habitaciones: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openUpdateModal = (room) => {
    setSelectedRoom(room);
    setShowUpdate(true);
  };
  const closeUpdateModal = () => {
    setShowUpdate(false);
    setSelectedRoom(null);
  };
  const handleUpdateSuccess = () => {
    setShowUpdate(false);
    setSelectedRoom(null);
    fetchRooms();
  };
  const openCreateModal = () => {
    setShowCreate(true);
  };
  const closeCreateModal = () => {
    setShowCreate(false);
  };
  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchRooms();
  };
  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setShowDelete(true);
  };
  const closeDeleteModal = () => {
    setShowDelete(false);
    setSelectedRoom(null);
  };

  const handleDeleteSuccess = () => {
    setShowDelete(false);
    setSelectedRoom(null);
    fetchRooms();
  };

  useImperativeHandle(ref, () => ({
    openCreateModal,
  }));

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {loading && <Loading fullscreen={false} />}
          {!loading && rooms.length === 0 && (
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold text-gray-600">
                No hay habitaciones registradas
              </h2>
            </div>
          )}

          {!loading && rooms.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Number
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      State
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    {isAdmin && (
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr
                      key={room.roomId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-3 text-sm text-gray-600">{room.roomId}</td>
                      <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                        {room.roomNumber}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {room.roomStatus}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {room.roomType.name}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        ${room.roomType.price}
                      </td>
                      {isAdmin && (
                        <td className="py-2 px-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openUpdateModal(room)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              <BsPencilSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(room)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <AiFillDelete className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isAdmin && showCreate && (
        <RegisterRoom
          onClose={closeCreateModal}
          onSuccess={handleCreateSuccess}
        />
      )}
      {isAdmin && showUpdate && (
        <UpdateRoom
          room={selectedRoom}
          onClose={closeUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}
      {isAdmin && showDelete && (
        <DeleteRoom
          room={selectedRoom}
          onClose={closeDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
});

RoomList.displayName = "RoomList";

export default RoomList;
