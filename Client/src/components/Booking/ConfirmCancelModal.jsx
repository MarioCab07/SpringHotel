import React from "react";

const ConfirmCancelModal = ({ bookingId, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-xl w-[90%] max-w-[420px]">

        <h2 className="text-2xl font-semibold text-center mb-4">
          Cancel Reservation
        </h2>

        <p className="text-center text-gray-700 mb-8">
          Are you sure you want to cancel reservation #{String(bookingId).padStart(3, "0")}?<br/>
          This action cannot be undone.
        </p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            No, go back
          </button>

          <button
            onClick={() => onConfirm(bookingId)}
            className="px-4 py-2 bg-[#C96E5E] hover:bg-[#B86254] text-white rounded-lg transition"
          >
            Yes, cancel it
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmCancelModal;
