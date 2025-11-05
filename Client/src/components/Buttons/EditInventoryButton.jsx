import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditInventoryButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth

  const role = sessionStorage.getItem("role");
  if(role!=="ADMIN"){
    return null;
  }

  return (
    <button
      onClick={() => navigate("/inventory/edit")}
      className="bg-[#172A45] text-white px-6 py-2 rounded-xl hover:bg-blue-800 transition"
    >
      Edit Inventory
    </button>
  );
};

export default EditInventoryButton;


