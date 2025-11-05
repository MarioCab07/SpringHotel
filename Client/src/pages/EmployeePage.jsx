import SideBar from "../components/SideBar";
import { useState } from "react";
import RoomList from "../components/Admin/RoomList";
import ReservationPage from "./ReservationPage";
import ServiceList from "../components/Admin/ServiceList";
import InventoryPage from "./InventoryPage";
import RoomStatusPage from "./RoomStatusPage";

const EmployeePage = () => {
  const [option, setOption] = useState("Dashboard");

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen w-full bg-[#D6ECF7] overflow-hidden">
      <SideBar option={option} setOption={setOption} />
      <section className="relative flex flex-col w-full h-full overflow-auto p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          {option === "Rooms" && <RoomList />}
          {option === "Reservations" && <ReservationPage />}
          {option === "Services" && <ServiceList />}
          {option === "Inventory" && <InventoryPage />}
          {option === "Room Status" && <RoomStatusPage />}
        </div>
      </section>
    </div>
  );
};

export default EmployeePage;
