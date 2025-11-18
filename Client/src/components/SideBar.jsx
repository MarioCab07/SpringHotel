import { sidebarItems } from "./SideBarItems";

const SideBar = ({ option, setOption }) => {
  const role = sessionStorage.getItem("role");

  const itemsToShow = sidebarItems.filter((item) => {
    return item.roles.includes(role);
  });

  return (
    <aside className="w-full md:w-[240px] lg:w-[260px] bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
      <nav className="flex flex-col w-full">
        {itemsToShow.map((item, index) => (
          <div key={index} className="w-full">
            <div
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                option === item.label
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setOption(item.label)}
            >
              <div className="text-lg">{item.icon}</div>
              <span className="text-sm">{item.label}</span>
            </div>
            {index < itemsToShow.length - 1 && (
              <hr className="my-1 border-gray-200" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
