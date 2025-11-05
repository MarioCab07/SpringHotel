import { useState, useEffect } from "react";
import { createServiceType } from "../../service/api.services";
import { toast } from "react-toastify";
import { BsArrowLeftShort } from "react-icons/bs";
import StandardInput from "../StandardInput";

const RegisterServiceType = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const response = await createServiceType(formData);
      if (response.status === 201) {
        toast.success("Servicio creado exitosamente");
        setFormData({
          name: "",
          price: 0,
        });
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      toast.error("Error al crear el servicio: " + error.message);
      setErrors(Array.isArray(error.message) ? error.message : [error.message]);
    }
  };

  return (
    <>
      <section className="fixed inset-0 z-50 flex">
        <div className="w-2/3 bg-black opacity-30" onClick={onClose} />
        <div className="w-1/3 bg-gray-500 flex flex-col">
          <header className="bg-[#0C0950] text-white flex items-center p-2">
            <button onClick={onClose} className="hover:text-pink-400">
              <BsArrowLeftShort size={30} />
            </button>
            <h4 className="flex-1 text-center text-2xl font-bold">
              Registrar Servicio
            </h4>
          </header>
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 flex flex-col gap-4"
          >
            <StandardInput
              label="Nombre del Servicio"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
            />
            <StandardInput
              label="Precio del Servicio"
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
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
    </>
  );
};

export default RegisterServiceType;
