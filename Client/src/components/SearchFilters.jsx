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
        className="flex items-center px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 bg-white shadow-sm"
      >
        <FaSlidersH className="mr-2" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-5 z-50">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-800">
              Price Range ($)
            </label>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={0}
              max={1000}
              valueLabelDisplay="auto"
              sx={{ color: "#bfa166" }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-800">
              Sort By
            </label>
            <Select
              value={orderBy}
              onChange={handleOrderChange}
              options={orderOptions}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "9999px",
                  borderColor: "#ddd",
                }),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
