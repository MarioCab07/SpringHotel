import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para saber si una ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex justify-between items-center px-12 pt-4 w-full">

      {/* TITULO IZQUIERDA */}
      <div
        className="text-black font-display tracking-wide cursor-pointer"
        style={{ fontFamily: '"Playfair Display", serif' }}
        onClick={() => navigate("/rooms")}
      >
        <h3 className="text-md md:text-lg lg:text-lg hover:text-[#bfa166] transition-colors">
          Lumé Hotel & Suites
        </h3>
      </div>

      {/* MENU DERECHA */}
      <nav className="flex items-center gap-10 text-base font-medium tracking-wide">

        <button
          onClick={() => navigate("/my-bookings")}
          className={`transition-colors duration-200 ${
            isActive("/my-bookings") ? "text-[#bfa166]" : "text-[#1a1a1a] hover:text-[#bfa166]"
          }`}
        >
          My Bookings
        </button>

            <button
          onClick={() => navigate("/profile")}
          className={`transition-colors duration-200 ${
            isActive("/profile") ? "text-[#bfa166]" : "text-[#1a1a1a] hover:text-[#bfa166]"
          }`}
        >
          Profile
        </button>

      </nav>

    </header>
  );
};

export default UserMenu;
