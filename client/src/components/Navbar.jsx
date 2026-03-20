import { SearchIcon, PanelLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { MoonIcon, SunIcon } from "lucide-react";

const Navbar = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  return <div>Navbar</div>;
};

export default Navbar;
