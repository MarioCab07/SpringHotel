import { useState } from "react";
import { UpdateUser } from "../../service/api.services";
import StandardInput from "../StandardInput";
import CountrySelector from "../CountrySelector";
import { toast } from "react-toastify";

const UpdateUserComp = ({ user, onClose, onSuccess }) => {
  const [changeUser, setChangeUser] = useState({
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    documentNumber: user.documentNumber,
    country: user.country,
    phoneNumber: user.phoneNumber,
    userName: user.userName,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangeUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCountryChange = (countryCode) => {
    setChangeUser((prev) => ({ ...prev, country: countryCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UpdateUser(changeUser);
      if (response.status === 200) {
        toast.success("Cliente actualizado exitosamente");
        setTimeout(() => {}, 1000);
        onSuccess();
      }
    } catch (error) {
      toast.error("Error al actualizar el cliente: " + error.message);
    }
  };
  return (
    <>
      <article className="w-full max-w-2xl mx-auto p-6 bg-[#0C0950] rounded-lg shadow-md top-1/5 left-1/3 absolute z-50 overflow-visible">
        <h2 className="text-2xl font-bold mb-4 text-[#D6ECF7] text-center">
          Actualizar Usuario
        </h2>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <StandardInput
            type="text"
            label={"Nombre Completo"}
            name={"fullName"}
            value={changeUser.fullName}
            onChange={handleChange}
          />
          <StandardInput
            type="email"
            label={"Coreo Electrónico"}
            name={"email"}
            value={changeUser.email}
            onChange={handleChange}
          />
          <StandardInput
            type="text"
            label={"Número de Documento"}
            name={"documentNumber"}
            value={changeUser.documentNumber}
            onChange={handleChange}
          />
          <CountrySelector
            value={changeUser.country}
            onChange={handleCountryChange}
          />
          <StandardInput
            type="text"
            label={"Número de Teléfono"}
            name={"phoneNumber"}
            value={changeUser.phoneNumber}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-pink-400 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-200"
          >
            Actualizar Usuario
          </button>
          <button
            className="w-full bg-gray-400 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </form>
      </article>
    </>
  );
};

export default UpdateUserComp;
