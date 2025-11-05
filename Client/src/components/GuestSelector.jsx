import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";

const GuestSelector = () => {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [rooms, setRooms] = useState(1);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-white text-black rounded-lg px-4 py-2 shadow-md text-sm"
      >
        <FaUser />
        {adults} adult{adults !== 1 ? "s" : ""} - {children} child{children !== 1 ? "ren" : ""}, {rooms} room{rooms !== 1 ? "s" : ""}
      </button>

      {open && (
        <div className="absolute top-14 left-0 w-72 bg-white shadow-xl rounded-xl p-4 z-50 space-y-4">
          {[
            { label: "Adults", count: adults, setCount: setAdults, min: 1 },
            { label: "Children", count: children, setCount: setChildren, min: 0 },
            { label: "Rooms", count: rooms, setCount: setRooms, min: 1 },
          ].map(({ label, count, setCount, min }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-slate-700">{label}</span>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCount(Math.max(min, count - 1))}
                  className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                >
                  −
                </button>
                <span>{count}</span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setOpen(false)}
            className="w-full bg-[#f2789f] hover:bg-[#e76b91] text-white py-2 rounded-full font-semibold"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
