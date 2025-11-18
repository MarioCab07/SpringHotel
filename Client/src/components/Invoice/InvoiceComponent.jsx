import React from "react";
import UserMenu from "../UserMenu";

const InvoiceComponent = ({ booking, user, room, info, onClose }) => {
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(info.endDate) - new Date(info.startDate)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const total = room.roomType.price * nights;

  const toLocalDateString = (dateInput) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article className="min-h-screen bg-white py-12">
      {}
      <header className="flex justify-between items-center px-12 py-6 border-b">
        <h1 className="text-2xl font-serif tracking-wide">LUMÉ HOTEL & SUITES</h1>
        <UserMenu />
      </header>

      <h2 className="text-2xl font-semibold px-16 mt-8">Reservations</h2>

      {}
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-10 border">

        {}
        <div className="text-center">
          <h2 className="text-xl font-serif tracking-wide">
            LUMÉ HOTEL & SUITES
          </h2>

          <div className="flex justify-between mt-1">
            <div className="h-[2px] bg-[#d4bf92] flex-1 mt-3"></div>
            <p className="text-sm font-medium ml-2 mt-1">#{booking.id}</p>
          </div>
        </div>

        {}
        <h3 className="text-center text-lg mt-6 font-semibold">Booking</h3>

        <div className="mt-8 space-y-4 text-[15px]">
          <p>
            <strong>Name:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </p>

          {}
          <p className="pt-4">
            <strong>Type:</strong> {room.roomType.name}
          </p>

          {}
          <p className="mt-1">
            <strong>Room Number:</strong>{" "}
            <span className="font-semibold">{room.roomNumber}</span>
          </p>

          <div className="flex justify-between">
            <p>
              <strong>Price / Night:</strong> ${room.roomType.price}
            </p>
            <p>
              <strong>Nights:</strong> {nights}
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <p>
              <strong>Check-in:</strong> {toLocalDateString(info.startDate)}
            </p>
            <p>
              <strong>Check-out:</strong> {toLocalDateString(info.endDate)}
            </p>
          </div>
        </div>

        {}
        <div className="mt-8">
          <div className="h-[2px] bg-[#d4bf92] w-full"></div>

          <div className="flex justify-between items-center mt-3 text-[17px]">
            <p className="font-semibold">
              <span className="text-xl">$</span>
              {total}
              <span className="text-sm italic ml-1">Total</span>
            </p>
            <p className="text-sm">{toLocalDateString(new Date())}</p>
          </div>
        </div>

        {}
        <div className="text-center mt-6 text-[14px] leading-6 text-gray-700">
          <p>Thank you for choosing Lumé Hotel & Suites.</p>
          <p>We look forward to your stay.</p>
        </div>

        {}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-[#d4bf92] hover:bg-[#c5ac7a] transition text-black font-medium py-3 px-10 rounded-full"
          >
            Continue
          </button>
        </div>
      </div>
    </article>
  );
};

export default InvoiceComponent;
