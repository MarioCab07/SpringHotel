import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

const BookingSearchBar = ({ onDateChange, setInfo }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    setInfo({ startDate, endDate, adults, children }); // Quitamos rooms
  }, [startDate, endDate, adults, children, setInfo]);

  useEffect(() => {
    onDateChange?.(startDate, endDate);
  }, [startDate, endDate, onDateChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#0e1b2c] p-2 px-3 md:px-5 rounded-md flex flex-col md:flex-row items-center justify-center gap-2 shadow-lg w-fit mx-auto mt-0">
      <div className="bg-white rounded-md px-3 py-2 flex items-center gap-2 text-sm">
        <FaCalendarAlt className="text-[#4a4a4a]" />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="MMM dd"
          className="outline-none w-20 cursor-pointer"
          placeholderText="Check-in"
        />
        <span>-</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="MMM dd"
          className="outline-none w-20 cursor-pointer"
          placeholderText="Check-out"
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="bg-white rounded-md px-3 py-2 flex items-center gap-2 text-sm"
        >
          <FaUser className="text-[#4a4a4a]" />
          {adults} adult{adults !== 1 ? "s" : ""} - {children} child
          {children !== 1 ? "ren" : ""}
        </button>

        {dropdownOpen && (
          <div className="absolute top-14 z-50 bg-white shadow-lg rounded-lg p-4 w-64 space-y-4">
            {[ 
              { label: "Adults", value: adults, setValue: setAdults, min: 1 },
              { label: "Children", value: children, setValue: setChildren, min: 0 }
            ].map(({ label, value, setValue, min }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-800">{label}</span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setValue(Math.max(min, value - 1))}
                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                  >
                    −
                  </button>
                  <span>{value}</span>
                  <button
                    onClick={() => setValue(value + 1)}
                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setDropdownOpen(false)}
              className="w-full bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold py-2 rounded-full mt-2"
            >
              Confirm
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => console.log("Buscar con info:", { startDate, endDate, adults, children })}
        className="bg-[#f2789f] hover:bg-[#e76b91] text-white text-sm font-semibold px-6 py-2 rounded-full shadow-md transition duration-200"
      >
        Search
      </button>
    </div>
  );
};

export default BookingSearchBar;
