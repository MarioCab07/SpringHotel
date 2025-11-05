import { useState } from "react";
import logo from "../../assets/Logo.png"; // Adjust the path as necessary
import UserMenu from "../UserMenu";

const InvoiceComponent = ({ booking, user, room, info, onClose }) => {
  const [total, setTotal] = useState(() => {
    const nights =
      info && info.startDate && info.endDate
        ? Math.max(
            1,
            Math.ceil(
              (new Date(info.endDate) - new Date(info.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;
    return room.roomType.price * nights;
  });

  const dateDiff = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };
  const toLocalDateString = (dateInput) => {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <>
    <article className="min-h-screen bg-[#D6ECF7] py-12">
      {/* Header con logo y UserMenu */}
      <header className="flex justify-between items-center px-8 py-4">
        <img src={logo} alt="Hotel Logo" className="h-28" />
        <UserMenu />
      </header>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <header className="bg-[#f2789f] text-white px-8 py-6 flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-bold">Invoice</h1>
              <p className="text-sm opacity-90">
                Booking ID: <span className="font-semibold">{booking.id}</span>
              </p>
            </div>
          </header>

          {/* Body */}
          <section className="p-8 space-y-8">
            {/* Customer & Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">
                  Customer Information
                </h2>
                <p>
                  <strong>Name:</strong> {user.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
              </div>

              {/* Room */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">
                  Room Details
                </h2>
                <p>
                  <strong>Type:</strong> {room.roomType.name}
                </p>
                <p>
                  <strong>Price/Night:</strong> ${room.roomType.price}
                </p>
                <p>
                  <strong>Nights:</strong>{" "}
                  {dateDiff(info.startDate, info.endDate)}
                </p>
                <p className="text-xl font-bold mt-2">Total: ${total}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold border-b pb-2">
                  Booking Dates
                </h2>
                <p>
                  <strong>Check-in:</strong> {toLocalDateString(info.startDate)}
                </p>
              </div>
              <div>
                <h2 className="invisible text-lg font-semibold border-b pb-2">
                  Placeholder
                </h2>
                <p>
                  <strong>Check-out:</strong> {toLocalDateString(info.endDate)}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="text-center">
              <button
                onClick={() => onClose()}
                className="inline-block bg-[#f2789f] hover:bg-[#e76b91] text-white font-semibold py-3 px-8 rounded-full transition"
              >
                Continuar
              </button>
            </div>
          </section>
        </div>
      </article>
    </>
  );
};

export default InvoiceComponent;
