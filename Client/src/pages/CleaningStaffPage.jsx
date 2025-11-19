import SideBar from "../components/SideBar";
import { useState } from "react";
import RoomStatusPage from "./RoomStatusPage";
import InventoryPage from "./InventoryPage";
import RoomList from "../components/Admin/RoomList";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminBanner from "../components/Admin/AdminBanner";

const CleaningStaff = () => {
  const [option, setOption] = useState("Rooms");

  const getSectionTitle = () => {
    const titles = {
      Rooms: "Room Management",
      Inventory: "Inventory Management",
      "Room Status": "Room Status",
    };
    return titles[option] || option;
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <div className="w-full px-4 md:px-6 lg:px-8 py-4">
        <AdminBanner
          title={getSectionTitle()}
          showButton={false}
        />
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-auto">
            <SideBar option={option} setOption={setOption} />
          </div>
          <section className="flex-1 w-full">
            {option === "Room Status" && <RoomStatusPage />}
            {option === "Inventory" && <InventoryPage />}
            {option === "Rooms" && <RoomList />}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CleaningStaff;
