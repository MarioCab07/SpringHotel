import React, { useState } from "react";

const ChangeDatesModal = ({ booking, onClose, onSave }) => {
  const [checkIn, setCheckIn] = useState(booking.checkIn);
  const [checkOut, setCheckOut] = useState(booking.checkOut);

  const handleSubmit = () => {
    if (!checkIn || !checkOut) {
      alert("Please fill in both dates");
      return;
    }
    onSave({ checkIn, checkOut });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl w-[90%] max-w-[450px]">

        <h2 className="text-2xl font-semibold mb-6 text-center" >Change Reservation Dates</h2>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Check-in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Check-out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#D9C696] text-black rounded-lg hover:bg-[#cdb883] transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDatesModal;
