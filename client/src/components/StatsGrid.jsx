import { FolderOpen, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StatsGrid = () => {
  const currentWorkspace = useSelector(
    (state) => state?.workspace?.currentWorkspace || null,
  );

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    myTasks: 0,
    overdueIssues: 0,
  });
  return <div>StatsGrid</div>;
};

export default StatsGrid;
