import React, { useState } from "react";

const ChangeDatesModal = ({ booking, onClose, onSave }) => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const tomorrowStr = today.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(booking.checkIn);
  const [checkOut, setCheckOut] = useState(booking.checkOut);


  const minCheckout = (() => {
    const ci = new Date(checkIn);
    ci.setDate(ci.getDate() + 1);
    return ci.toISOString().split("T")[0];
  })();

  const handleSubmit = () => {
    if (!checkIn || !checkOut) {
      alert("Please fill in both dates.");
      return;
    }

    if (new Date(checkIn) < new Date(tomorrowStr)) {
      alert("Check-in must be tomorrow or later.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out must be at least 1 day after check-in.");
      return;
    }

    onSave({ checkIn, checkOut });
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-xl w-[90%] max-w-[420px]">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Change Reservation Dates
        </h2>

        <div className="space-y-4">

          <div>
            <label className="font-semibold">Check-in:</label>
            <input
              type="date"
              value={checkIn}
              min={tomorrowStr}
              onChange={(e) => {
                setCheckIn(e.target.value);


                if (new Date(checkOut) <= new Date(e.target.value)) {
                  const newCheckout = new Date(e.target.value);
                  newCheckout.setDate(newCheckout.getDate() + 1);
                  setCheckOut(newCheckout.toISOString().split("T")[0]);
                }
              }}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Check-out:</label>
            <input
              type="date"
              value={checkOut}
              min={minCheckout}
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
            className="px-4 py-2 bg-[#D9C696] hover:bg-[#cdb883] text-black rounded-lg hover:bg-[#1F3A5A] transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDatesModal;
