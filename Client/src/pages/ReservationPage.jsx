import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  getAllBookings,
  getRoomById,
  GetUser,
} from "../service/api.services";

const ReservationsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const res = await getAllBookings();
      const all = res.data.data;

      const active = all.filter((b) => b.status === "ACTIVE");

      const enriched = await Promise.all(
        active.map(async (b) => {
          let room, user;

          try {
            room = (await getRoomById(b.roomId)).data.data;
          } catch {}

          try {
            user = (await GetUser(b.userId)).data.data;
          } catch {}

          return {
            id: b.id,
            userId: b.userId,
            client: user?.fullName || "N/A",
            roomNumber: room?.roomNumber || "N/A",
            roomType: room?.roomType?.name || "N/A",
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            status: "ACTIVE",
          };
        })
      );

      setRows(enriched);
    } catch {
      toast.error("Error al cargar reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns = [
    { name: "id", label: "Reservation ID" },
    { name: "roomNumber", label: "Room #" },
    { name: "roomType", label: "Room Type" },
    {
      name: "checkIn",
      label: "Check-In",
      options: { customBodyRender: (value) => formatDate(value) },
    },
    {
      name: "checkOut",
      label: "Check-Out",
      options: { customBodyRender: (value) => formatDate(value) },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: () => (
          <span className="font-semibold text-green-600">ACTIVE</span>
        ),
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5, // FIX ERROR
    rowsPerPageOptions: [5, 10, 20],
    search: true,
    filter: true,
    print: false,
    download: true,
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-6 lg:px-8 py-6">

      {}
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          View all active reservations in real time
        </p>
      </div>

      {}
      <div className="flex justify-end gap-3 mb-4">

        {}
        <button
          onClick={() => navigate("/employee/check-in")}
          className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-white px-7 py-2.5 rounded-full shadow-md transition font-light"
        >
          Check-In
        </button>

        {}
        <button
          onClick={() => navigate("/employee/check-out")}
          className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-white px-7 py-2.5 rounded-full shadow-md transition font-light"
        >
          Check-Out
        </button>

      </div>

      {}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <MUIDataTable
          title={
            <span className="text-xl font-semibold text-gray-700">
              Active Reservations
            </span>
          }
          data={rows}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
};

export default ReservationsPage;
