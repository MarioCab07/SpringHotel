import React from "react";
import { useAuth } from "../../context/AuthContext";

const EditInventoryButton = ({ onClick }) => {
  const { user } = useAuth;

  const role = sessionStorage.getItem("role");
  if(role !== "ADMIN"){
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="px-5 py-2 bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
    >
      Edit Inventory
    </button>
  );
};

export default EditInventoryButton;


