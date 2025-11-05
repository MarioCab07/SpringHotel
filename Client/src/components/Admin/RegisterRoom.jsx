import { useEffect, useState } from "react";
import { getAllRoomTypes, createRoom } from "../../service/api.services";
import { toast } from "react-toastify";
import { BsArrowLeftShort } from "react-icons/bs";
import StandardInput from "../StandardInput";
import BasicSelect from "../Select";

const RegisterRoom = ({ onClose, onSuccess }) => {
  // State for form data and select name
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: null,
    roomStatus: "",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [errors, setErrors] = useState([]);
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
      setFormData((prev) => ({
        ...prev,
        roomType: typeObj.roomTypeId,
      }));
    }
  }, [selectedRoomType, roomTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingId = toast.loading("Registrando habitación...");
    try {
      const res = await createRoom(formData);
      toast.dismiss(loadingId);
      if (res.status === 201) {
        toast.success("Habitación registrada");
        setFormData({ roomNumber: "", roomType: null, roomStatus: "" });
        setSelectedRoomType(roomTypeOptions[0] || "");
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error("Error al registrar: " + err.message);
      setErrors([err.message]);
      setTimeout(() => setErrors([]), 5000);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="w-2/3 bg-black opacity-30" onClick={onClose} />
      {/* Panel */}
      <div className="w-1/3 bg-gray-500 flex flex-col">
        <header className="bg-[#0C0950] text-white flex items-center p-2">
          <button onClick={onClose} className="hover:text-pink-400">
            <BsArrowLeftShort size={30} />
          </button>
          <h4 className="flex-1 text-center text-2xl font-bold">
            Crear Habitación
          </h4>
        </header>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 flex flex-col gap-4"
        >
          <StandardInput
            type="number"
            label="Número de Habitación"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
          />

          <BasicSelect
            label="Tipo de Habitación"
            options={roomTypeOptions}
            value={selectedRoomType}
            setValue={setSelectedRoomType}
          />

          <BasicSelect
            label={"Estado de Habitación"}
            options={roomStatusOptions}
            value={formData.roomStatus}
            setValue={(value) =>
              setFormData((prev) => ({ ...prev, roomStatus: value }))
            }
          />

          {errors.length > 0 && (
            <ul className="text-red-500">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            className="w-full bg-pink-400 cursor-pointer rounded-2xl text-white py-2 hover:bg-pink-600 transition-colors duration-300 ease-in-out"
          >
            Registrar
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterRoom;
