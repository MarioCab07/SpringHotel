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
        className="bg-blue-900 text-white px-6 py-2 rounded-xl hover:bg-blue-800 transition"
      >
        Add New
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
          <button
            onClick={() => {
              onAddCategory();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Add Category
          </button>
          <button
            onClick={() => {
              onAddItem();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Add Item
          </button>
        </div>
      )}
    </div>
  );
};

export default AddNewDropdownButton;
