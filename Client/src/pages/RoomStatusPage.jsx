import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchSortBar from "../components/SearchSortBar";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import DetailPanel from "../components/RoomStatus/DetailPanel";
import ReportIssueModal from "../components/RoomStatus/ReportIssueModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import {
  getAllRoomServices,
  getAllRooms,
  PostRoomCleaningRecord,
  updateRoomService,
  getAllBookings,
  GetUserDetails,
  deleteRoomService,
} from "../service/api.services";

const iconForType = {
  cleaned: <FaCheckCircle className="text-green-500" />,
  inProgress: <FaClock className="text-gray-500" />,
  overdue: <FaExclamationCircle className="text-red-500" />,
  canceled: <FaTimesCircle className="text-yellow-500" />,
};

const statusToType = {
  COMPLETED: "cleaned",
  IN_PROGRESS: "inProgress",
  PENDING: "overdue",
  CANCELED: "canceled",
};

const displayToStatus = {
  Pending: "PENDING",
  "In progress": "IN_PROGRESS",
  Completed: "COMPLETED",
  Canceled: "CANCELED",
};

const RoomStatusPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("All");
  const [selected, setSelected] = useState(null);
  const [userId, setUserId] = useState(null);
  const [markLoadingId, setMarkLoadingId] = useState(null);
  const [inProgressLoadingId, setInProgressLoadingId] = useState(null);
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await GetUserDetails();
        if (!isMounted) return;
        setUserId(res.data.data.userId);
      } catch (err) {
        console.error("Error fetching user details:", err);
        if (isMounted) setError("No se pudo cargar los datos de usuario");
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const [svcResp, roomsResp, bookingsResp] = await Promise.all([
          getAllRoomServices(),
          getAllRooms(),
          getAllBookings(),
        ]);
        if (!isMounted) return;

        const services = svcResp.data.data;
        const rooms = roomsResp.data.data;
        const bookings = bookingsResp.data.data;

        const roomMap = rooms.reduce((map, r) => {
          map[r.roomId] = r.roomNumber;
          return map;
        }, {});

        const bookingMap = bookings.reduce((m, b) => {
          m[b.id] = b.roomId;
          return m;
        }, {});

        const mapped = services.map((s) => {
          const roomId = bookingMap[s.bookingId];
          const roomNum = roomMap[roomId];

          return {
            id: s.roomServiceId,
            roomId,
            bookingId: s.bookingId,
            room: roomNum ? `Room ${roomNum}` : `#${roomId}`,
            description: s.roomServiceDescription,
            status: s.roomServiceStatus,
            type: statusToType[s.roomServiceStatus] || "inProgress",
            time: s.requestedAt
              ? new Date(s.requestedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          };
        });

        setTasks(mapped);
        setSelected(mapped[0] ?? null);
      } catch (err) {
        console.error("Error fetching tasks or rooms:", err);
        if (isMounted) setError("Error cargando servicios o habitaciones");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const bySearch = tasks.filter((t) =>
      t.room.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "All") return bySearch;
    const desired = displayToStatus[sortBy];
    return bySearch.filter((t) => t.status === desired);
  }, [tasks, search, sortBy]);

  const completedCount = tasks.filter((t) => t.type === "cleaned").length;

  const handleMarkClean = useCallback(
    async (item) => {
      if (!userId) {
        toast.error("Debes iniciar sesión");
        return;
      }
      const cleaningPayload = {
        roomId: item.roomId,
        userId: userId,
        status: "COMPLETED",
        cleanedAt: new Date().toISOString(),
        comments: "",
      };
      try {
        setMarkLoadingId(item.id);

        await PostRoomCleaningRecord(cleaningPayload);

        await updateRoomService(item.id, {
          roomServiceStatus: "COMPLETED",
          serviceTypeIds: item.serviceTypeIds || [],
        });

        const updated = { ...item, status: "COMPLETED", type: "cleaned" };
        setTasks((ts) => ts.map((t) => (t.id === item.id ? updated : t)));
        setSelected(updated);

        toast.success("Marcado como limpio");
      } catch (err) {
        console.error("handleMarkClean error:", err);
        toast.error("No se pudo marcar como limpio");
      } finally {
        setMarkLoadingId(null);
      }
    },
    [userId]
  );

  const handleMarkInProgress = useCallback(
    async (item) => {
      if (!userId) {
        toast.error("Debes iniciar sesión");
        return;
      }

      const cleaningPayload = {
        roomId: item.roomId,
        userId: userId,
        status: "IN_PROGRESS",
        cleanedAt: new Date().toISOString(),
        comments: "",
      };

      try {
        setInProgressLoadingId(item.id);

        await PostRoomCleaningRecord(cleaningPayload);

        await updateRoomService(item.id, {
          roomServiceStatus: "IN_PROGRESS",
          serviceTypeIds: item.serviceTypeIds || [],
        });

        const updated = { ...item, status: "IN_PROGRESS", type: "inProgress" };
        setTasks((ts) => ts.map((t) => (t.id === item.id ? updated : t)));
        setSelected(updated);

        toast.success("Marcado como In Progress");
      } catch (err) {
        console.error("handleMarkInProgress error:", err);
        toast.error("No se pudo marcar como In Progress");
      } finally {
        setInProgressLoadingId(null);
      }
    },
    [userId]
  );

  const handleDelete = async (item) => {
    if (!window.confirm("¿Seguro que quieres borrar este servicio?")) return;
    try {
      await deleteRoomService(item.id);
      setTasks((ts) => ts.filter((t) => t.id !== item.id));
      setSelected(null);
      toast.success("Servicio eliminado");
    } catch (err) {
      console.error("Error al borrar serviceId", item.id, err.response || err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "No se pudo eliminar el servicio";
      toast.error(`Error al eliminar: ${msg}`);
    }
  };

  const handleViewMore = useCallback(
    (item) => {
      navigate(`/services/${item.id}`);
    },
    [navigate]
  );

  if (loading) return <div>Cargando…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center px-6 pt-3 pb-1">
          <div className="flex justify-center w-full">
            <h4
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
              className="rounded-b-2xl bg-white font-zain-extrabold p-4 w-1/3 text-3xl text-center"
            >
              Estado de habitaciones
            </h4>
          </div>
          <div className="ml-auto"></div>
        </header>

        <div className="w-full px-8 pb-6 mt-4 flex justify-center">
          <div className="w-full max-w-3xl">
            <SearchSortBar
              query={query}
              setQuery={setQuery}
              onSearch={(term) => setSearch(term)}
              onSortChange={setSortBy}
              initialSort="All"
            />
          </div>
        </div>

        <main className="flex-1 px-8 pb-8 overflow-hidden">
          <div className="flex bg-white rounded-2xl shadow-lg h-full">
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-200">
              <li className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-serif text-gray-800">
                    Today’s Tasks
                  </h2>
                  <p className="text-sm text-gray-600">
                    {completedCount} of {tasks.length} completed
                  </p>
                </div>
              </li>

              {filtered.map((t) => (
                <li
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer
                    ${selected?.id === t.id ? "bg-gray-50" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    {iconForType[t.type]}
                    <span className="font-medium text-gray-800">{t.room}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      {t.status.replace("_", " ").charAt(0).toUpperCase() +
                        t.status.replace("_", " ").slice(1).toLowerCase()}
                    </span>
                    {t.time && <span className="font-mono">{t.time}</span>}
                  </div>
                </li>
              ))}
            </ul>

            <DetailPanel
              item={selected}
              onMarkClean={handleMarkClean}
              onMarkInProgress={handleMarkInProgress}
              markLoading={markLoadingId === selected?.id}
              inProgressLoading={inProgressLoadingId === selected?.id}
              onReportIssue={() => setIsReportOpen(true)}
              onViewMore={handleViewMore}
              onDelete={handleDelete}
              isAdmin={isAdmin}
              role={role}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoomStatusPage;
