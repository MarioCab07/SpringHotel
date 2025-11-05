import BookNowButton from "../components/Buttons/BookNowButtom";
import UserMenu from "../components/UserMenu";
import RoomBookingCard from "../components/Booking/RoomBookingCard";
import logo from "../assets/Logo.png";

const RoomBookingDetail = () => {
  return (
    <div className="min-h-screen bg-[#d7f0fc] flex flex-col">
      {}
      <header className="flex justify-between items-center px-8 py-4">
        <img src={logo} alt="Hotel Logo" className="w-40 h-auto" />
        <UserMenu />
      </header>

      {}
      <main className="flex justify-center px-4 mt-4">
        <RoomBookingCard />
      </main>
    </div>
  );
};

export default RoomBookingDetail;
