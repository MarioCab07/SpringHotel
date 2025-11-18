import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import logo from "../assets/Logo.png";
import UserMenu from "../components/UserMenu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  getAllBookings,
  getRoomById,
  GetUser,
  checkOut,
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

  const handleGlobalCheckOut = async () => {
    const userId = prompt("Enter the user ID to Check-Out:");
    if (!userId) return;

    try {
      await checkOut(userId);
      toast.success("Check-Out realizado correctamente.");
      loadData();
    } catch {
      toast.error("Error al realizar Check-Out.");
    }
  };

  const columns = [
  { name: "id", label: "Reservation ID" }, 

  { name: "roomNumber", label: "Room #" },
  { name: "roomType", label: "Room Type" },

  {
    name: "checkIn",
    label: "Check-In",
    options: {
      customBodyRender: (value) => formatDate(value),
    },
  },
  {
    name: "checkOut",
    label: "Check-Out",
    options: {
      customBodyRender: (value) => formatDate(value),
    },
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
    elevation: 3,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
    search: true,
    filter: true,
    print: false,
    download: true,
  };

  return (
    <div className="min-h-screen bg-[#D6ECF7] py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6 px-4">
        <h1 className="text-3xl font-bold">Active Reservations</h1>

        <div className="flex gap-3">

          {/* NUEVO CHECK-IN PAGE */}
          <button
            onClick={() => navigate("/employee/check-in")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Check-In
          </button>

          {/* LEGACY CHECK-OUT */}
          <button
            onClick={handleGlobalCheckOut}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full"
          >
            Check-Out
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <MUIDataTable
          title={"Reservations"}
          data={rows}
          columns={columns}
          options={options}
        />
      </div>

      {/* BACK */}
      <div className="flex justify-center mt-10">
        <button
          className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] px-8 py-3 rounded-full"
          onClick={() => (window.location.href = "/admin")}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default ReservationsPage;
