// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { GetUserDetails } from "../service/api.services";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaIdBadge,
  FaEdit,
  FaGlobe
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetUserDetails();
        setUser(res.data.data);
      } catch (err) {
        console.error("Error al cargar los datos del usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-[#D6ECF7] py-12">
      <header className="flex justify-between items-center px-8 py-4">
        <img src={logo} alt="Hotel Logo" className="w-40 h-auto" />
        <UserMenu />
      </header>

      <main className="max-w-3xl mx-auto mt-10">
        <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center">
          <FaUserCircle className="text-pink-400 text-7xl mb-4" />
          <h1 className="text-3xl font-bold text-[#f2789f] mb-6">Mi Perfil</h1>
          <div className="w-full text-lg text-gray-700 space-y-4">
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-[#f2789f]" />
              <p><span className="font-semibold">Nombre completo:</span> {user.fullName}</p>
            </div>
            <div className="flex items-center gap-3">
              <FaUserTag className="text-[#f2789f]" />
              <p><span className="font-semibold">Nombre de Usuario:</span> {user.userName}</p>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#f2789f]" />
              <p><span className="font-semibold">Email:</span> {user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-[#f2789f]" />
              <p><span className="font-semibold">Teléfono:</span> {user.phoneNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              <FaGlobe className="text-[#f2789f]" />
              <p><span className="font-semibold">País:</span> {user.country}</p>
            </div>
            <div className="flex items-center gap-3">
              <FaUserTag className="text-[#f2789f]" />
              <p><span className="font-semibold">Rol:</span> {user.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <FaIdBadge className="text-[#f2789f]" />
              <p><span className="font-semibold">Usuario ID:</span> {user.userId}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/edit-profile")}
            className="mt-8 px-6 py-2 bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold rounded-full flex items-center gap-2"
          >
            <FaEdit />
            Editar Perfil
          </button>
        </div>
      </main>
 {}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => navigate("/rooms")}
          className="bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-200"
        >
          Regresar al menú
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
