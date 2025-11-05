import { useEffect, useState } from "react";
import { updateRoom, getAllRoomTypes } from "../../service/api.services";
import { toast } from "react-toastify";
import StandardInput from "../StandardInput";
import BasicSelect from "../Select";

const UpdateRoom = ({ room, onClose, onSuccess }) => {
  const [changeRoom, setChangeRoom] = useState({
    roomId: room.roomId,
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    roomStatus: room.roomStatus,
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(() => {
    const type = roomTypes.find((t) => t.roomTypeId === room.roomType);
    return type ? type.roomTypeName : "";
  });

  const roomStatusOptions = [
    "AVAILABLE",
    "OCCUPIED",
    "RESERVED",
    "MAINTENANCE",
  ];

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getAllRoomTypes();
        if (res.status === 200) {
          const types = res.data.data;
          setRoomTypes(types);
          const names = types.map((t) => t.roomTypeName);
          setRoomTypeOptions(names);
          if (names.length) setSelectedRoomType(names[0]);
        }
      } catch (err) {
        toast.error("Error al cargar tipos de habitación: " + err.message);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const typeObj = roomTypes.find((t) => t.roomTypeName === selectedRoomType);

    if (typeObj) {
      setChangeRoom((prev) => ({
        ...prev,
        roomType: typeObj.roomTypeId,
      }));
    }
  }, [selectedRoomType, roomTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangeRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Actualizando habitación...");
    try {
      const res = await updateRoom(changeRoom);
      toast.dismiss(loadingToast);
      if (res.status === 200) {
        toast.success("Habitacion actualizada exitosamente");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error al actualizar la habitación: " + error.message);
    }
  };

  return (
    <>
      <article className="w-full max-w-2xl mx-auto p-6 bg-[#0C0950] rounded-lg shadow-md top-1/5 left-1/3 absolute z-50 overflow-visible">
        <h2 className="text-2xl font-bold mb-4 text-[#D6ECF7] text-center">
          Actualizar Habitacion
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <StandardInput
            type="number"
            label={"Número de Habitación"}
            name={"roomNumber"}
            value={changeRoom.roomNumber}
            onChange={handleChange}
          />

          <BasicSelect
            label={"Tipo de Habitación"}
            options={roomTypeOptions}
            value={selectedRoomType}
            setValue={setSelectedRoomType}
          />

          <BasicSelect
            label={"Estado de Habitación"}
            options={roomStatusOptions}
            value={changeRoom.roomStatus}
            setValue={(value) =>
              setChangeRoom((prev) => ({ ...prev, roomStatus: value }))
            }
          />
          <div className="flex justify-between ">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 rounded-2xl hover:bg-gray-600 transition-all ease-in-out duration-500 text-white font-bold py-2 px-4 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-pink-400 hover:bg-pink-600 transition-all ease-in-out duration-500 text-white font-bold py-2 px-4 cursor-pointer rounded-2xl"
            >
              Confirmar
            </button>
          </div>
        </form>
      </article>
    </>
  );
};

export default UpdateRoom;
