// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { GetUserDetails } from "../service/api.services";
import UserMenu from "../components/UserMenu";
import { FaUserCircle } from "react-icons/fa";
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

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white">

      <header className="py-3">
        <UserMenu />
      </header>

      <main className="flex flex-col items-center mt-12">

        <div className="flex items-center justify-center">
          <FaUserCircle className="text-gray-300 text-[200px]" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-center">
          {user.fullName}
        </h1>

        <div className="mt-3 text-center text-gray-700 space-y-3">
          <p><span className="font-semibold">User:</span> {user.userName}</p>
          <p><span className="font-semibold">Country:</span> {user.country}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Phone Number:</span> {user.phoneNumber}</p>
        </div>

        <div className="w-full max-w-md mt-8 border-t border-gray-300"></div>

        <div className="flex mt-8 gap-6">
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-10 py-3 bg-[#d7c28f] hover:bg-[#c6b27f] transition rounded-md font-medium min-w-[200px]"
          >
            Edit Profile
          </button>

          <button
            onClick={handleSignOut}
            className="px-10 py-3 bg-[#d7c28f] hover:bg-[#c6b27f] transition rounded-md font-medium min-w-[200px]"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );

};

export default ProfilePage;
