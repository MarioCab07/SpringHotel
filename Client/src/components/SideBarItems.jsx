import {
  FaTachometerAlt,
  FaDoorOpen,
  FaBed,
  FaConciergeBell,
  FaUser,
  FaUsers,
  FaClipboardList,
  FaBoxes,
} from "react-icons/fa";
export const sidebarItems = [
  {
    label: "Customers",
    icon: <FaUser size={20} />,
    roles: ["ADMIN"],
  },
  {
    label: "Employees",
    icon: <FaUsers size={20} />,
    roles: ["ADMIN"],
  },
  {
    label: "Rooms",
    icon: <FaDoorOpen size={20} />,
    roles: ["ADMIN", "EMPLOYEE", "CLEANING_STAFF"],
  },
  {
    label: "Reservations",
    icon: <FaBed size={20} />,
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    label: "Services",
    icon: <FaConciergeBell size={20} />,
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    label: "Inventory",
    icon: <FaClipboardList size={20} />,
    roles: ["ADMIN", "EMPLOYEE", "CLEANING_STAFF"],
  },
  {
    label: "Room Status",
    icon: <FaDoorOpen size={20} />,
    roles: ["ADMIN", "EMPLOYEE", "CLEANING_STAFF"],
  },
];
