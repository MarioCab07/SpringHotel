import React, { useEffect, useState, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import UserMenu from "../components/UserMenu";
import SearchSortBar from "../components/SearchSortBar";
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
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("Sort By");

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
      toast.error("Error loading reservations.");
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

  // Filtrar y ordenar datos
  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows;

    // Aplicar búsqueda
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter((row) =>
        row.client?.toLowerCase().includes(searchLower) ||
        row.roomNumber?.toString().toLowerCase().includes(searchLower) ||
        row.roomType?.toLowerCase().includes(searchLower) ||
        row.id?.toString().includes(searchLower)
      );
    }

    // Aplicar ordenamiento
    if (sortOption === "Nombre A-Z") {
      filtered = [...filtered].sort((a, b) =>
        (a.client || "").localeCompare(b.client || "")
      );
    } else if (sortOption === "Nombre Z-A") {
      filtered = [...filtered].sort((a, b) =>
        (b.client || "").localeCompare(a.client || "")
      );
    } else if (sortOption === "Room # A-Z") {
      filtered = [...filtered].sort((a, b) =>
        (a.roomNumber || "").toString().localeCompare((b.roomNumber || "").toString())
      );
    } else if (sortOption === "Room # Z-A") {
      filtered = [...filtered].sort((a, b) =>
        (b.roomNumber || "").toString().localeCompare((a.roomNumber || "").toString())
      );
    }

    return filtered;
  }, [rows, query, sortOption]);

  const handleSearch = (term) => {
    setQuery(term);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
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
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
    search: true,
    filter: true,
    print: false,
    download: true,
    viewColumns: true,
  };

  // Detectar si estamos en el contexto de EmployeePage
  const isEmployeeContext = window.location.pathname.includes('/employee') || 
                            sessionStorage.getItem('role') === 'EMPLOYEE';

  if (isEmployeeContext) {
    return (
      <div className="w-full">
        {/* Header con texto descriptivo y botones */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-6">
          <p className="text-gray-600 text-sm md:text-base">
            View all active reservations in real time
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/employee/check-in")}
              className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] px-6 py-2 rounded-full font-medium transition-colors"
            >
              Check-In
            </button>
            <button
              onClick={() => navigate("/employee/check-out")}
              className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] px-6 py-2 rounded-full font-medium transition-colors"
            >
              Check-Out
            </button>
          </div>
        </div>

        {/* Tabla de reservas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Reservations</h2>
          <MUIDataTable
            data={rows}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }

  // Versión original para otros contextos
  return (
    <div className="min-h-screen bg-[#D6ECF7] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-6">
          <h1 className="text-3xl font-bold">Active Reservations</h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/employee/check-in")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              Check-In
            </button>
            <button
              onClick={() => navigate("/employee/check-out")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full"
            >
              Check-Out
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SearchSortBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              onSortChange={handleSortChange}
              initialSort="Sort By"
              options={["Nombre A-Z", "Nombre Z-A", "Room # A-Z", "Room # Z-A"]}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl">
          <MUIDataTable
            title={"Reservations"}
            data={filteredAndSortedRows}
            columns={columns}
            options={options}
          />
        </div>

        <div className="flex justify-center mt-10">
          <button
            className="bg-[#d4bf92] hover:bg-[#c6ae7b] text-[#1a1a1a] px-8 py-3 rounded-full"
            onClick={() => (window.location.href = "/admin")}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
