import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UserRegister } from "../../service/api.services";
import CountrySelector from "../CountrySelector";
import DatePickerValue from "../DatePicker";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import { GoogleLogin } from "@react-oauth/google";
import { LoginWithGoogle } from "../../service/api.services";
import { CircularProgress } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login, loginGoogle, loading, setLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    documentNumber: "",
    country: "",
    userName: "",
    password: "",
    phoneNumber: "",
    birthDate: "",
  });

  const [birthDate, setBirthDate] = useState(dayjs());
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (countryCode) => {
    setFormData((prev) => ({ ...prev, country: countryCode }));
  };

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const token = credentialResponse.credential;

      const response = await LoginWithGoogle({ token });
      if (response.status === 200) {
        loginGoogle(response.data);
        toast.success("Sesión iniciada exitosamente");

        const role = response.data.role;

        if (role === "EMPLOYEE") {
          navigate("/employee");
        } else if (role === "ADMIN") {
          navigate("/admin");
        } else if (role === "CLEANING_STAFF") {
          navigate("/cleaning-staff");
        } else {
          navigate("/rooms");
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      birthDate: birthDate.format("YYYY-MM-DD"),
      country: formData.country || "SV",
    };
    toast.info("Registrando usuario...");
    try {
      const response = await UserRegister(data);
      if (response.status === 200) {
        toast.success("Usuario registrado exitosamente");
        setFormData({
          fullName: "",
          email: "",
          documentNumber: "",
          country: "",
          userName: "",
          password: "",
          phoneNumber: "",
        });
        setBirthDate(dayjs());
        setErrors([]);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (Array.isArray(error.message)) {
        setErrors(error.message);
      } else {
        setErrors([error.message]);
      }
      toast.error("Error al registrar el usuario");
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const handleError = () => {
    toast.error("Error en el inicio de sesión con Google");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white text-center">Registro</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Columna Izquierda */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Nombre Completo</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="border border-white bg-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">
                Número de Documento
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                className="border border-white bg-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">
                Número de Teléfono
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border border-white bg-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">País</label>
              <CountrySelector
                value={formData.country}
                onChange={handleCountryChange}
                className="border border-white bg-white px-4 py-2 rounded-md focus-within:border-orange-500"
              />
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="border border-white bg-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-white bg-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-white bg-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">
                Fecha de Nacimiento
              </label>
              <DatePickerValue date={birthDate} setDate={setBirthDate} />
            </div>
          </div>
        </div>

        {/* Errores */}
        {errors.length > 0 && (
          <div className="text-red-400 text-sm">
            {errors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}

        <div className="text-center text-white">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-orange-300 hover:underline">
            Inicia Sesión
          </Link>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold px-6 py-2 rounded hover:bg-orange-600 transition"
        >
          Crear cuenta
        </button>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </form>
      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default RegisterForm;
