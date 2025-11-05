import { useState, useEffect } from "react";
import { getAllRooms } from "../../service/api.services";
import { useAuth } from "../../context/AuthContext";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import RegisterRoom from "./RegisterRoom";
import UpdateRoom from "./UpdateRoom";
import DeleteRoom from "./DeleteRoom";

const RoomList = () => {
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

  return (
    <>
      <article className="w-full h-full flex flex-col gap-4 items-center justify-between relative">
        <h4
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
          className="rounded-b-2xl bg-white font-zain-extrabold p-4 w-1/3 text-3xl text-center"
        >
          Listado de Habitaciones
        </h4>

        {isAdmin && (
          <div className="w-full flex justify-end px-4 py-2">
            <button
              onClick={openCreateModal}
              className="bg-pink-400 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
            >
              Crear Habitación
            </button>
          </div>
        )}
        <div className="w-full h-full flex-1  flex flex-col py-5 items-center justify-center overflow-scroll">
          {loading && <Loading fullscreen={false} />}
          {!loading && rooms.length === 0 && (
            <>
              <h2 className="text-center text-2xl font-bold">
                No hay habitaciones registradas
              </h2>
            </>
          )}

          {!loading && rooms.length > 0 && (
            <>
              <div
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                className="w-full max-w-8xl h-full mx-auto p-4 bg-white rounded-3xl"
              >
                <div
                  className={`grid gap-2 mb-4 text-center font-bold ${
                    isAdmin ? "grid-cols-8" : "grid-cols-6"
                  }`}
                >
                  <h5 className="col-span-1 flex items-center justify-center">
                    ID
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Numero
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Estado
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Tipo
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Descripcion
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Precio
                  </h5>
                </div>
                <hr />
                {rooms.map((room) => {
                  return (
                    <div
                      key={room.roomId}
                      className={`grid gap-2 py-4 rounded-lg shadow-md mb-4 w-full ${
                        isAdmin ? "grid-cols-8" : "grid-cols-6"
                      }`}
                    >
                      <p className="text-gray-600 flex items-center justify-center">
                        {room.roomId}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {room.roomNumber}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {room.roomStatus}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {room.roomType.name}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {room.roomType.description}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {room.roomType.price}
                      </p>
                      {isAdmin && (
                        <>
                          <button onClick={() => openUpdateModal(room)}>
                            <BsPencilSquare
                              size={25}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                            />
                          </button>
                          <button onClick={() => openDeleteModal(room)}>
                            <AiFillDelete
                              size={25}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </article>

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
};

export default RoomList;
