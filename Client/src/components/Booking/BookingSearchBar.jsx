import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const BookingSearchBar = ({ setInfo }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setInfo?.({ startDate, endDate });
  }, [startDate, endDate]);

  return (
    <>
      {/* QUITAR LA FLECHA DEL DATEPICKER */}
      <style>
        {`
          .react-datepicker__triangle {
            display: none;
          }
          .react-datepicker-wrapper input::-webkit-calendar-picker-indicator {
            display: none;
          }
          .react-datepicker__input-container input {
            background-image: none !important;
          }
        `}
      </style>

      <div className="flex justify-center items-center w-full">
        <div
          className="flex items-center bg-white shadow-md rounded-2xl px-6 py-4 gap-6 w-full max-w-3xl border border-gray-100"
        >
          {/* 📅 FECHAS */}
          <div className="flex items-center gap-3 flex-1">
            <FaCalendarAlt className="text-gray-500 text-lg" />
            <div className="flex items-center gap-4 text-[15px] text-gray-800 w-full">

              {/* Start Date */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-400">Check-In</label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  placeholderText="Select"
                  dateFormat="MMM dd"
                  className="outline-none border-b border-gray-300 focus:border-[#bfa166] transition text-gray-700 pb-1"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-400">Check-Out</label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  placeholderText="Select"
                  minDate={startDate}
                  dateFormat="MMM dd"
                  className="outline-none border-b border-gray-300 focus:border-[#bfa166] transition text-gray-700 pb-1"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BookingSearchBar;
