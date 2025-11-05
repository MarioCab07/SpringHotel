import React from "react";

const PayButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#f77498] text-white font-semibold py-2 px-6 rounded-full hover:opacity-90 transition"
    >
      PAY & GENERATE INVOICE
    </button>
  );
};

export default PayButton;
