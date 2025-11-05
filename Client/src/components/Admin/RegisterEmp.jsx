import { useEffect, useState } from "react";
import { RegisterEmployee } from "../../service/api.services";
import { toast } from "react-toastify";
import { BsArrowLeftShort } from "react-icons/bs";
import StandardInput from "../StandardInput";
import DatePickerValue from "../DatePicker";
import CountrySelector from "../CountrySelector";
import dayjs from "dayjs";

const RegisterEmp = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    documentNumber: "",
    country: "",
    phoneNumber: "",
  });

  const [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const [birthDate, setBirthDate] = useState(dayjs());
  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        birthDate: birthDate.format("YYYY-MM-DD"),
        country: formData.country || "SV",
      };
      toast.update("Registrando empleado...");
      const response = await RegisterEmployee(data);
      if (response.status === 201) {
        toast.success("Empleado registrado exitosamente");
        setFormData({
          fullName: "",
          email: "",
          documentNumber: "",
          country: "",
          phoneNumber: "",
        });
        setBirthDate(dayjs());

        setCredentials({
          userName: response.data.data.userName,
          password: response.data.data.generatedPassword,
        });
      }
    } catch (error) {
      toast.error("Error al registrar empleado: ");
      setErrors(error.message);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <section className="w-full h-full mx-auto rounded-lg shadow-md right-0 absolute z-50 overflow-visible flex">
        <article
          className="w-2/3 bg-black opacity-30"
          onClick={onClose}
        ></article>
        <article className="flex flex-col bg-gray-500 items-start  w-1/3   text-black">
          <div className="bg-[#0C0950] text-white w-full flex items-center">
            <button
              onClick={onClose}
              className="flex items-center justify-center p-2 hover:text-pink-400 transition-colors duration-300 cursor-pointer"
            >
              <BsArrowLeftShort size={40} />
            </button>
            <h4 className="flex-1 font-bold text-2xl text-center">
              Registrar Empleado
            </h4>
          </div>

          <form className="flex gap-36 w-full h-1/2 justify-center items-center ">
            <div className="flex flex-col gap-8  ">
              <StandardInput
                label={"Nombre Completo"}
                name={"fullName"}
                value={formData.fullName}
                onChange={handleChange}
                type="text"
              />
              <StandardInput
                label={"Correo Electrónico"}
                name={"email"}
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              <StandardInput
                label={"Número de Documento"}
                name={"documentNumber"}
                value={formData.documentNumber}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-center flex-col gap-10 ">
              <StandardInput
                label={"Número de Teléfono"}
                name={"phoneNumber"}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <CountrySelector
                value={formData.country}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, country: value }))
                }
                className="bg-white/70 border border-gray-300 focus-within:border-amber-500 shadow-sm rounded-lg"
              />
              <DatePickerValue
                date={birthDate}
                setDate={setBirthDate}
                label={"Fecha de Nacimiento"}
              />
            </div>
          </form>
          <div className="flex w-full justify-center items-center gap-8 mt-4">
            <button
              onClick={handleSubmit}
              type="submit"
              style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
              className="bg-pink-400 w-1/2 cursor-pointer rounded-2xl py-1 px-2   hover:bg-pink-600 transition-all 0.5s ease-in-out"
            >
              Registrar
            </button>
          </div>

          <div className="flex gap-4 flex-col items-center justify-center w-full p-4 text-white">
            {credentials.userName && credentials.password && (
              <>
                <h5 className="font-bold">Credenciales para Empleado</h5>
                <p>
                  Usuario:{" "}
                  <span className="font-semibold">{credentials.userName}</span>
                </p>
                <p>
                  Contraseña:{" "}
                  <span className="font-semibold">{credentials.password}</span>
                </p>

                <button
                  onClick={onSuccess}
                  className="rounded-2xl p-4 bg-gray-400 text-white cursor-pointer hover:bg-gray-600 transition-all duration-300"
                >
                  Cerrar
                </button>
              </>
            )}
            {errors.length > 0 && (
              <>
                {errors.map((error, index) => {
                  return (
                    <>
                      <p className="text-white" key={index}>
                        Error:{" "}
                        <span key={index} className="font-bold">
                          {error}
                        </span>
                      </p>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </article>
      </section>
    </>
  );
};

export default RegisterEmp;
