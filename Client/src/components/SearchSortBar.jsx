import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const routeOptions = {
  "/admin":  ["Pending", "In progress", "Completed", "Canceled"],
  "/inventory": ["Nombre A-Z", "Nombre Z-A", "Más cantidad", "Menos cantidad"],
};

const SearchSortBar = ({
  query,
  setQuery,
  onSearch,
  onSortChange,
  initialSort = "Sort By",
  options: customOptions,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSort);
  const { pathname } = useLocation();
  const options = customOptions ?? routeOptions[pathname] ?? [];

  const handleSelect = (opt) => {
    setSelected(opt);
    setOpen(false);
    onSortChange(opt);
  };

  const handleReset = () => {
    setQuery("");
    setSelected(initialSort);
    setOpen(false);
    onSortChange(initialSort);
    onSearch("");  
  };

  return (
  <div className="flex flex-wrap items-center gap-2 w-full">
    {/* Search input + button */}
    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-auto shadow-sm focus-within:ring-2 focus-within:ring-[#D9C696] focus-within:border-[#D9C696] transition">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
        className="bg-transparent placeholder-gray-500 text-gray-900 text-sm py-0.5 px-2 focus:outline-none border-0 transition flex-grow min-w-[200px]"
      />
      <button
        onClick={() => onSearch(query)}
        className="bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 p-2 rounded-md transition-all duration-200 flex items-center justify-center"
        title="Buscar"
      >
        <FaSearch size={16} />
      </button>
    </div>

    {/* Dropdown */}
    {options.length > 0 && (
      <div className="relative z-20">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-200"
        >
          {selected} <FaChevronDown size={12} />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-40">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Reset */}
    <button
      onClick={handleReset}
      className="bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
    >
      Reset
    </button>
  </div>
);
};

export default SearchSortBar;
