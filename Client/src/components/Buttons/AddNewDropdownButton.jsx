// src/components/Buttons/AddNewDropdownButton.jsx
import React, { useState, useRef, useEffect } from "react";

const AddNewDropdownButton = ({ onAddCategory, onAddItem }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // cerrar si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-5 py-2 bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
      >
        Add New
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              onAddCategory();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Add Category
          </button>
          <button
            onClick={() => {
              onAddItem();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Add Item
          </button>
        </div>
      )}
    </div>
  );
};

export default AddNewDropdownButton;
