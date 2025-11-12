import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Select from "react-select";

const orderOptions = [
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
];

const BookingSearchBar = ({ setInfo, onFilterChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orderBy, setOrderBy] = useState(orderOptions[0]);
  const dropdownRef = useRef();

  useEffect(() => {
    setInfo?.({ startDate, endDate, adults, children });
  }, [startDate, endDate, adults, children]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrderChange = (option) => {
    setOrderBy(option);
    onFilterChange?.({ orderBy: option });
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className="flex items-center bg-white shadow-lg rounded-full px-8 py-5 gap-6 w-full max-w-5xl border border-gray-100"
        style={{
          boxShadow: "0px 6px 15px rgba(0,0,0,0.08)",
        }}
      >
        {/* 📅 FECHAS */}
        <div className="flex items-center gap-3 flex-1 border-r border-gray-200 pr-6">
          <FaCalendarAlt className="text-gray-700 text-lg" />
          <div className="flex items-center gap-3 text-[15px] text-gray-800">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Add date"
              dateFormat="MMM dd"
              className="outline-none cursor-pointer w-24 text-center text-gray-700"
            />
            <span className="text-gray-400">/</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Check-out"
              minDate={startDate}
              dateFormat="MMM dd"
              className="outline-none cursor-pointer w-24 text-center text-gray-700"
            />
          </div>
        </div>

        {/* 👥 HUÉSPEDES */}
        <div
          className="relative flex-1 border-r border-gray-200 pr-6"
          ref={dropdownRef}
        >
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center justify-between w-full bg-white rounded-full px-5 py-2 text-[15px] text-gray-800 hover:bg-gray-50 border border-gray-200 shadow-sm transition"
          >
            <span className="flex items-center gap-2">
              <FaUser className="text-gray-700" />
              Guests
            </span>
            <span className="text-gray-500 text-sm">
              {adults} adult{adults !== 1 ? "s" : ""}, {children} child
              {children !== 1 ? "ren" : ""}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute top-14 left-0 bg-white shadow-lg rounded-2xl p-5 w-64 z-50 space-y-4 border border-gray-100">
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
            </div>
          )}
        </div>

        {/* 🔽 SORT BY */}
        <div className="flex-1 flex items-center justify-between pr-4">
          <Select
            value={orderBy}
            onChange={handleOrderChange}
            options={orderOptions}
            className="w-full text-[15px]"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "9999px",
                borderColor: "#ddd",
                minHeight: "48px",
                boxShadow: "none",
                "&:hover": { borderColor: "#bfa166" },
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#bfa166"
                  : state.isFocused
                  ? "#f2e6c9"
                  : "white",
                color: state.isSelected ? "white" : "#333",
              }),
            }}
          />
        </div>

        {/* 👉 BOTÓN FINAL */}
        <button
          className="bg-[#bfa166] hover:bg-[#a98d54] text-white text-lg w-12 h-12 flex items-center justify-center rounded-full shadow-md transition"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default BookingSearchBar;
