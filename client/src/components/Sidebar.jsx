import {
  FolderOpenIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
    { name: "Projets", href: "/projects", icon: FolderOpenIcon },
    { name: "Team", href: "/team", icon: UsersIcon },
  ];

  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  return (
    <div className="">

    </div>
  )
};

export default Sidebar;
