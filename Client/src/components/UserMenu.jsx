import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="text-slate-800 text-2xl bg-white p-2 rounded-full shadow hover:bg-slate-200 transition"
        onClick={() => setOpen(!open)}
      >
        <FaUser />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-pink-200 rounded-md shadow-md border border-pink-300 z-50">
          <ul className="divide-y divide-pink-300 text-center text-gray-800 font-semibold">
            <li
              className="py-2 hover:bg-pink-300 cursor-pointer transition"
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            >
              Profile
            </li>

            <li
              className="py-2 hover:bg-pink-300 cursor-pointer transition"
              onClick={() => {
                setOpen(false);
                navigate("/my-bookings");
              }}
            >
              Mis Reservaciones
            </li>

            <li
              className="py-2 hover:bg-pink-300 cursor-pointer transition"
              onClick={() => {
                setOpen(false);
                navigate("/rooms");
              }}
            >
              Rooms
            </li>

            <li
              className="py-2 hover:bg-red-300 cursor-pointer transition text-red-700"
              onClick={handleSignOut}
            >
              Sign Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;