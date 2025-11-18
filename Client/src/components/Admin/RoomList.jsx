import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getAllRooms } from "../../service/api.services";
import { useAuth } from "../../context/AuthContext";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import RegisterRoom from "./RegisterRoom";
import RoomDetailPanel from "./RoomDetailPanel";

const RoomList = forwardRef((props, ref) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

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

  const openDetailPanel = (room) => {
    setSelectedRoom(room);
    setShowDetailPanel(true);
  };
  const closeDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedRoom(null);
  };
  const handleDetailSuccess = () => {
    setShowDetailPanel(false);
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
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr
                      key={room.roomId}
                      onClick={() => isAdmin && openDetailPanel(room)}
                      className={`border-b border-gray-100 transition-colors ${
                        isAdmin ? "cursor-pointer hover:bg-gray-50" : ""
                      }`}
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
          isOpen={showCreate}
          onClose={closeCreateModal}
          onSuccess={handleCreateSuccess}
        />
      )}
      {isAdmin && showDetailPanel && (
        <RoomDetailPanel
          isOpen={showDetailPanel}
          room={selectedRoom}
          onClose={closeDetailPanel}
          onSuccess={handleDetailSuccess}
        />
      )}
    </>
  );
});

RoomList.displayName = "RoomList";

export default RoomList;
