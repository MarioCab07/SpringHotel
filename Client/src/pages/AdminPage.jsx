import SideBar from "../components/SideBar";
import { useState, useRef } from "react";
import ClientsList from "../components/Admin/ClientsList";
import EmployeeList from "../components/Admin/EmployeeList";
import RoomList from "../components/Admin/RoomList";
import BookingList from "../components/Admin/BookingList";
import ServiceList from "../components/Admin/ServiceList";
import RoomStatusPage from "./RoomStatusPage";
import InventoryPage from "./InventoryPage";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminBanner from "../components/Admin/AdminBanner";

const AdminPage = () => {
  const [option, setOption] = useState("Customers");
  const roomListRef = useRef(null);

  const getSectionTitle = () => {
    const titles = {
      Customers: "Registered Clients",
      Employees: "Registered Employees",
      Rooms: "Room Management",
      Reservations: "Hotel Reservations",
      Services: "Services Management",
      Inventory: "Inventory Management",
      "Room Status": "Room Status",
    };
    return titles[option] || option;
  };

  const handleAddRoom = () => {
    if (roomListRef.current && roomListRef.current.openCreateModal) {
      roomListRef.current.openCreateModal();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <div className="w-full px-4 md:px-6 lg:px-8 py-4">
        <AdminBanner
          title={getSectionTitle()}
          showButton={option === "Rooms"}
          buttonText="Add Room"
          onButtonClick={handleAddRoom}
        />
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-auto">
            <SideBar option={option} setOption={setOption} />
          </div>
          <section className="flex-1 w-full">
            {option === "Customers" && <ClientsList />}
            {option === "Employees" && <EmployeeList />}
            {option === "Rooms" && <RoomList ref={roomListRef} />}
            {option === "Reservations" && <BookingList />}
            {option === "Services" && <ServiceList />}
            {option === "Room Status" && <RoomStatusPage />}
            {option === "Inventory" && <InventoryPage />}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
