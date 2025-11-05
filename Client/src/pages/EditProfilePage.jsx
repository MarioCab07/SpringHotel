import React, { useEffect, useState } from "react";
import { GetUserDetails, UpdateUser } from "../service/api.services";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import { FaSave, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const [user, setUser] = useState({
    userId: "",
    fullName: "",
    email: "",
    documentNumber: "",
    phoneNumber: "",
    country: ""
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetUserDetails();
        setUser(res.data.data);
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        toast.error("Error al obtener los datos del perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      documentNumber: user.documentNumber,
      country: user.country,
      phoneNumber: user.phoneNumber, // lo enviamos aunque no se edite
    };

    try {
      await UpdateUser(payload);
      toast.success("Perfil actualizado con éxito");
      navigate("/profile");
    } catch (err) {
      console.error("Error al actualizar el perfil:", err.response?.data || err);
      toast.error("Hubo un problema al actualizar el perfil");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-[#D6ECF7] py-12">
      <header className="flex justify-between items-center px-8 py-4">
        <img src={logo} alt="Hotel Logo" className="w-40 h-auto" />
        <UserMenu />
      </header>

      <main className="max-w-xl mx-auto mt-10">
        <div className="bg-white p-10 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-[#f2789f] mb-6 flex items-center gap-2">
            <FaUserEdit /> Editar Perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700">Nombre Completo</label>
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">Número de Documento</label>
              <input
                type="text"
                name="documentNumber"
                value={user.documentNumber}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">Teléfono</label>
              <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                {user.phoneNumber}
              </p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-2 bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold rounded-full flex items-center gap-2"
              >
                Volver al Perfil
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold rounded-full flex items-center gap-2"
              >
                <FaSave /> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
