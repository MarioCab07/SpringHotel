import SideBar from "../components/SideBar";
import { useState } from "react";
import ClientsList from "../components/Admin/ClientsList";
import EmployeeList from "../components/Admin/EmployeeList";
import RoomList from "../components/Admin/RoomList";
import BookingList from "../components/Admin/BookingList";
import ServiceList from "../components/Admin/ServiceList";
import RoomStatusPage from "./RoomStatusPage";
import InventoryPage from "./InventoryPage";

const AdminPage = () => {
  const [option, setOption] = useState("Customers");

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <div className="flex h-screen w-full bg-[#D6ECF7]">
        <SideBar option={option} setOption={setOption} />
        <section className="relative flex flex-col w-full h-full p-4">
          <div className="flex justify-end mb-4">
            <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Sign Out
            </button>
          </div>
          {option === "Customers" && <ClientsList />}
          {option === "Employees" && <EmployeeList />}
          {option === "Rooms" && <RoomList />}
          {option === "Reservations" && <BookingList />}
          {option === "Services" && <ServiceList />}
          {option === "Room Status" && <RoomStatusPage />}
          {option === "Inventory" && <InventoryPage />}
        </section>
      </div>
    </>
  );
};

export default AdminPage;
