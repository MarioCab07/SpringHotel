import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Select from "react-select";
import { FaSlidersH } from "react-icons/fa";

const orderOptions = [
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
];

const SearchFilters = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [orderBy, setOrderBy] = useState(orderOptions[0]);

  const handlePriceChange = (_, newValue) => {
    setPriceRange(newValue);
    onFilterChange?.({ priceRange: newValue, orderBy });
  };

  const handleOrderChange = (option) => {
    setOrderBy(option);
    onFilterChange?.({ priceRange, orderBy: option });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center px-3 py-2 border rounded-md text-slate-700 hover:bg-slate-100 bg-white"
      >
        <FaSlidersH className="mr-2" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 p-4 bg-white rounded-lg shadow-lg z-50">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Price Range ($)</label>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={0}
              max={1000}
              valueLabelDisplay="auto"
              sx={{ color: "#1e293b" }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Sort By</label>
            <Select
              value={orderBy}
              onChange={handleOrderChange}
              options={orderOptions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
