import React, { useState } from "react";

const StatusFilter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "ACTIVE", label: "Active" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="
          bg-white
          border-2
          border-[#D9C696]
          text-gray-800
          font-medium
          px-5
          py-1.5
          rounded-xl
          w-44
          flex
          items-center
          justify-between
          transition-all
          duration-200
          hover:border-[#CDB883]
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-[#D9C696]/50
        "
      >
        <span>
          {statusOptions.find((o) => o.value === value)?.label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
            absolute
            mt-2
            w-44
            bg-white
            border
            border-[#D9C696]
            rounded-xl
            shadow-lg
            overflow-hidden
            z-50
          "
        >
          {statusOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`
                px-5
                py-1.5
                cursor-pointer
                transition-all
                duration-150
                ${
                  value === opt.value
                    ? "bg-[#D9C696] text-gray-900 font-semibold"
                    : "text-gray-700 hover:bg-[#D9C696]/60"
                }
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusFilter;