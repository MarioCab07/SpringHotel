import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

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
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialSort);
  const { pathname } = useLocation();
  const options = routeOptions[pathname] ?? [];

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
  <div className="flex flex-wrap items-center gap-3 w-full">
    {/* Search + button */}
    <div className="flex items-center gap-2 bg-[#2A3E4C] rounded-full px-4 py-2 w-auto">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
        className="flex-grow bg-white placeholder-gray-500 text-gray-900 py-1 px-3 rounded-full focus:outline-none"
      />
      <button
        onClick={() => onSearch(query)}
        className="bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold px-4 py-1 rounded-full"
      >
        Search
      </button>
    </div>

    {/* Dropdown */}

    <div className="relative z-20">
  <button
    onClick={() => setOpen(!open)}
    className="bg-[#f2789f] hover:bg-[#e76b91] text-black px-4 py-2 rounded-full flex items-center gap-2"
  >
    {selected} <FaChevronDown />
  </button>
  {open && (
    <div className="absolute z-999 mt-2 bg-[#f2789f] border rounded shadow w-40">
      {options.map((opt) => (
        <div
          key={opt}
          onClick={() => handleSelect(opt)}
          className="cursor-pointer px-4 py-2 hover:bg-[#e76b91] "
        >
          {opt}
        </div>
      ))}
    </div>
  )}
</div>

    {/* Reset */}
    <button
      onClick={handleReset}
      className="bg-[#f2789f] hover:bg-[#e76b91] text-black px-4 py-2 rounded-full"
    >
      Reset
    </button>
  </div>
);
};

export default SearchSortBar;
