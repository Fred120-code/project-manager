import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { loadTheme } from "../features/themeSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useUser, SignIn, useAuth, CreateOrganization } from "@clerk/react";
import { fetchWorspaces } from "../features/workspaceSlice";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { loading, workspaces } = useSelector((state) => state.workspace);
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  //Initial load of theme
  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  //Initial laod of workspaces - only once when user is ready
  useEffect(() => {
    if (isLoaded && user && !hasInitialized) {
      setHasInitialized(true);
      dispatch(fetchWorspaces({ getToken }));
    }
  }, [isLoaded, user, hasInitialized, dispatch, getToken]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn />
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    );

  if (user && workspaces.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CreateOrganization />
      </div>
    );
  }

  return (
    <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col h-screen">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 h-full p-4 sm:p-6 lg:p-10 lg:px-16 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
