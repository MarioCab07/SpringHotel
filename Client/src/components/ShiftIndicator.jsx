import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useShift } from "./hooks/useShift";

const ShiftIndicator = () => {
  const shift = useShift();
  const isMorning = shift === "MORNING";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border shadow-xs transition-all duration-500
        ${
          isMorning
            ? "bg-yellow-100 border-yellow-300 text-yellow-800"
            : "bg-gray-200 border-gray-300 text-gray-700"
        }`}
      style={{ minWidth: "fit-content" }}
    >
      {isMorning ? (
        <FaSun className="text-yellow-500 text-xl" />
      ) : (
        <FaMoon className="text-gray-600 text-xl" />
      )}

      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-sm">
          {isMorning ? "Morning Shift" : "Evening Shift"}
        </span>
        <span className="text-xs opacity-80">
          {isMorning ? "06:00 AM – 06:00 PM" : "06:00 PM – 06:00 AM"}
        </span>
      </div>
    </div>
  );
};

export default ShiftIndicator;
