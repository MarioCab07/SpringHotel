import { useState, useEffect } from "react";
import { updateServiceType } from "../../service/api.services";
import { toast } from "react-toastify";
import StandardInput from "../StandardInput";

const UpdateServiceType = ({ service, onClose, onSuccess }) => {
  const [changeService, setChangeService] = useState({
    id: service.id,
    name: service.name,
    price: service.price,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangeService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateServiceType(changeService);
      if (response.status === 200) {
        toast.success("Servicio actualizado exitosamente");

        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      toast.error("Error al actualizar el servicio: " + error.message);
    }
  };

  return (
    <>
      <article className="w-full max-w-2xl mx-auto p-6 bg-[#0C0950] rounded-lg shadow-md top-1/5 left-1/3 absolute z-50 overflow-visible">
        <h2 className="text-2xl font-bold mb-4 text-[#D6ECF7] text-center">
          Actualizar Servicio
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <StandardInput
            type="text"
            label="Nombre del Servicio"
            name="name"
            value={changeService.name}
            onChange={handleChange}
          />
          <StandardInput
            type="number"
            label="Precio del Servicio"
            name="price"
            value={changeService.price}
            onChange={handleChange}
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

export default UpdateServiceType;
