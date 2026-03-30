import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileStackIcon,
  ZapIcon,
} from "lucide-react";
import ProjectAnalytics from "../components/ProjectAnalytics";
import ProjectSettings from "../components/ProjectSettings";
import CreateTaskDialog from "../components/CreateTaskDialog";
import ProjectCalendar from "../components/ProjectCalendar";
import ProjectTasks from "../components/ProjectTasks";

const ProjectDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const id = searchParams.get("id");

  const navigate = useNavigate();
  const projects = useSelector(
    (state) => state?.workspace?.currentWorkspace?.projects || [],
  );

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeTab, setActiveTab] = useState(tab || "tasks");

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const proj = projects.find((p) => p.id === id);
      setProject(proj);
      setTasks(proj?.tasks || []);
    }
  }, [id, projects]);

  const statusColors = {
    PLANNING: "bg-zinc-200 text-zinc-900 dark:bg-zinc-600 dark:text-zinc-200",
    ACTIVE:
      "bg-emerald-200 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-900",
    ON_HOLD:
      "bg-amber-200 text-amber-900 dark:bg-amber-500 dark:text-amber-900",
    COMPLETED: "bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-blue-900",
    CANCELLED: "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-900",
  };

  if (!project) {
    return (
      <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
        <p className="text-3xl md:text-5xl mt-40 mb-10">Project not found</p>
        <button
          className="mt-4 px-4 py-2 rounded bg-zinc-200 text-zinc-900
         hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
          onClick={() => navigate("/projects")}
        >
          Back to Project
        </button>
      </div>
    );
  }
  return <div>ProjectDetails</div>;
};

export default ProjectDetails;
