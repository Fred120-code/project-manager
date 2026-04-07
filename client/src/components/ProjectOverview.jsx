import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, UsersIcon, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";

const ProjectOverview = () => {
  const statusColors = {
    PLANNING: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
    ACTIVE:
      "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
    ON_HOLD:
      "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
    COMPLETED: "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
    CANCELLED: "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900",
  };

  const priorityColors = {
    LOW: "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-400",
    MEDIUM:
      "border-amber-300 text-amber-700 dark:border-amber-500 dark:text-amber-400",
    HIGH: "border-green-300 text-green-700 dark:border-green-500 dark:text-green-400",
  };

  const currentWorkspace = useSelector(
    (state) => state?.workspace?.currentWorkspace || null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(currentWorkspace?.projects || []);
  }, [currentWorkspace]);
  
  return <div>ProjectOverview</div>;
};

export default ProjectOverview;
