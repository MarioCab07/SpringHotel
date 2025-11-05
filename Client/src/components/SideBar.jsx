import logo from "../assets/Logo.png";
import { sidebarItems } from "./SideBarItems";

const SideBar = ({ option, setOption }) => {
  const role = sessionStorage.getItem("role");

  const itemsToShow = sidebarItems.filter((item) => {
    return item.roles.includes(role);
  });

  return (
    <>
      <aside className="w-[355px] h-screen bg-blue-100 p-4 flex flex-col items-center shadow-md">
  <div className="mb-10">
    <img src={logo} alt="Logo" className="w-24 h-auto" />
  </div>
  <nav className="flex flex-col gap-3 text-black text-lg">
    {itemsToShow.map((item, index) => (
      <div
        key={index}
        className={`flex items-center gap-4 cursor-pointer px-3 pb-4 rounded 
          ${option === item.label ? "bg-white text-black" : "hover:text-blue-600"}
          transition-all duration-300 ease-in-out`}
        onClick={() => setOption(item.label)}
      >
        <div className="text-2xl">{item.icon}</div>
        <span className="font-medium">{item.label}</span>
      </div>
    ))}
  </nav>
</aside>

    </>
  );
};

export default SideBar;
