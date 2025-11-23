import React, { useEffect, useState } from "react";
import { GetUserDetails, UpdateUser } from "../service/api.services";
import UserMenu from "../components/UserMenu";
import { FaUserEdit, FaUserCircle } from "react-icons/fa";
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
    <div className="min-h-screen bg-white">

      <header className="py-3" >
        <UserMenu />
      </header>

      <div className="flex justify-center mt-10"  style={{ fontFamily: '"Playfair Display", serif' }}>
        <h1 className="text-4xl">Edit Profile</h1>
      </div>

      <main className="flex justify-center items-center min-h-[60vh] gap-20">


        <div className="flex items-center justify-center">
          <FaUserCircle className="text-gray-300 text-[200px]" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[500px] gap-5"
        >
          <div>
            <label className="block text-gray-500">Name</label>
            <input
              type="text"
              placeholder="Name"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-black rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-500">Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-black rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-500">Document Number</label>
            <input
              type="text"
              placeholder="Document Number"
              name="documentNumber"
              value={user.documentNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-black rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-500">PhoneNumber</label>
            <input
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-black rounded-md"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-10 py-3 bg-[#D9C696] hover:bg-[#cdb883] transition rounded-md font-medium min-w-[200px]"
            >
              Return
            </button>

            <button
              type="submit"
              className="px-10 py-3 bg-[#D9C696] hover:bg-[#cdb883] transition rounded-md font-medium min-w-[200px]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );

};

export default EditProfilePage;
