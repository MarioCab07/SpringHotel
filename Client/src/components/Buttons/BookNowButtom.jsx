import React from "react";

const BookNowButtom = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#f2789f] hover:bg-[#e76b91] text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-md transition duration-200"
    >
      BOOK NOW!
    </button>
  );
};

export default BookNowButtom;