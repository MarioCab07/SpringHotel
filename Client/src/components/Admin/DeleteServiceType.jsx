import { useState } from "react";
import { deleteServiceType } from "../../service/api.services";
import { toast } from "react-toastify";

const DeleteServiceType = ({ service, onSuccess, onClose }) => {
  const [serviceSelected, setServiceSelected] = useState(service);
  console.log(service);

  const [confirmText, setConfirmText] = useState("");

  const handleChange = (e) => {
    setConfirmText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = serviceSelected.id;
      const response = await deleteServiceType(id);

      if (response.status === 200) {
        toast.success("Servicio eliminado exitosamente");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      toast.error("Error al eliminar el servicio: " + error.message);
    }
  };

  const isConfirmValid = confirmText.trim().toUpperCase() === "CONFIRMAR";

  return (
    <>
      <article className="w-full max-w-3xl mx-auto p-6 bg-[#0C0950] rounded-lg shadow-md top-1/5 left-1/3 absolute z-50 overflow-visible">
        <h2 className="text-2xl font-bold mb-4 text-[#D6ECF7] text-center">
          Eliminar Servicio
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex gap-8">
            <p className="text-white text-lg">
              <b>ID del Servicio:</b>
              {serviceSelected.id}
            </p>
            <p className="text-white text-lg">
              <b>Nombre del Servicio:</b>
              {serviceSelected.name}
            </p>
            <p className="text-white text-lg">
              <b>Precio del Servicio:</b>
              {serviceSelected.price} USD
            </p>
          </div>
          <label htmlFor="confirm" className="flex flex-col w-full">
            <span className="mb-2 text-red-500 font-semibold text-center tracking-wide">
              Escribe <b>CONFIRMAR</b> para eliminar la habitación
            </span>
            <input
              id="confirm"
              type="text"
              value={confirmText}
              onChange={handleChange}
              placeholder="CONFIRMAR"
              className="border-2 border-red-500 focus:border-red-700 rounded-xl px-4 py-2 text-center text-red-700 font-bold bg-red-50 placeholder-red-300 outline-none transition-all duration-300 shadow-md"
              autoComplete="off"
              required
            />
          </label>
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
              disabled={!isConfirmValid}
              className={`font-bold py-2 px-4 rounded-2xl transition-all ease-in-out duration-500
                ${
                  isConfirmValid
                    ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-lg"
                    : "bg-red-200 text-red-400 cursor-not-allowed opacity-70"
                }`}
            >
              Confirmar
            </button>
          </div>
        </form>
      </article>
    </>
  );
};

export default DeleteServiceType;
