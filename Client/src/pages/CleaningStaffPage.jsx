import SideBar from "../components/SideBar";
import { useState } from "react";
import RoomStatusPage from "./RoomStatusPage";
import InventoryPage from "./InventoryPage";
import RoomList from "../components/Admin/RoomList";

const CleaningStaff = () => {
  const [option, setOption] = useState("Rooms");

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
          {option === "Room Status" && <RoomStatusPage />}
          {option === "Inventory" && <InventoryPage />}
          {option === "Rooms" && <RoomList />}
        </section>
      </div>
    </>
  );
};

export default CleaningStaff;
