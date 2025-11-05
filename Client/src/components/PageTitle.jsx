import React from "react";
import { useNavigate } from "react-router-dom";

const PageTitle = ({ title, backTo, backLabel }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {backTo && (
        <button
          onClick={() => navigate(backTo)}
          className="text-sm text-gray-500 hover:underline flex items-center gap-1"
        >
          <span className="text-xl font-light">&larr;</span>
          {backLabel}
        </button>
      )}
      <h1 className="text-2xl font-bold mt-1">{title}</h1>
    </div>
  );
};

export default PageTitle;
