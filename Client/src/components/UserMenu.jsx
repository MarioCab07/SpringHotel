import React from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center gap-10 text-base font-medium tracking-wide text-[#1a1a1a]">
      <button
        onClick={() => navigate("/profile")}
        className="hover:text-[#bfa166] transition-colors duration-200"
      >
        Profile
      </button>
      <button
        onClick={() => navigate("/my-bookings")}
        className="hover:text-[#bfa166] transition-colors duration-200"
      >
        My Bookings
      </button>
      <button
        onClick={() => navigate("/rooms")}
        className="hover:text-[#bfa166] transition-colors duration-200"
      >
        Rooms
      </button>
      <button
        onClick={handleSignOut}
        className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default UserMenu;
