import SideBar from "../components/SideBar";
import { useState } from "react";
import RoomList from "../components/Admin/RoomList";
import ReservationPage from "./ReservationPage";
import ServiceList from "../components/Admin/ServiceList";
import InventoryPage from "./InventoryPage";
import RoomStatusPage from "./RoomStatusPage";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminBanner from "../components/Admin/AdminBanner";

const EmployeePage = () => {
  const [option, setOption] = useState("Dashboard");

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const getSectionTitle = () => {
    const titles = {
      Dashboard: "Dashboard",
      Rooms: "Room Management",
      Reservations: "Hotel Reservations",
      Services: "Services Management",
      Inventory: "Inventory Management",
      "Room Status": "Room Status",
    };
    return titles[option] || option;
  };

  return (
    <div className="min-h-screen bg-white">
      
      {}
      <AdminHeader />

      {}
      <div className="w-full px-4 md:px-6 lg:px-8 py-4">

        {}
        <AdminBanner 
          title={getSectionTitle()}
          showButton={false}
        />

        <div className="flex flex-col lg:flex-row gap-4">
          
          {}
          <div className="w-full lg:w-auto">
            <SideBar option={option} setOption={setOption} />
          </div>

          {}
          <section className="flex-1 w-full">
            <div className="flex justify-end mb-4">
            </div>

            {option === "Rooms" && <RoomList />}
            {option === "Reservations" && <ReservationPage />}
            {option === "Services" && <ServiceList />}
            {option === "Inventory" && <InventoryPage />}
            {option === "Room Status" && <RoomStatusPage />}
          </section>

        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
