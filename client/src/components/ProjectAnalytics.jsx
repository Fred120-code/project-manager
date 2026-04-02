import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  ArrowRightIcon,
} from "lucide-react";

// Colors for charts and priorities
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const PRIORITY_COLORS = {
  LOW: "text-red-600 bg-red-200 dark:text-red-500 dark:bg-red-600",
  MEDIUM: "text-blue-600 bg-blue-200 dark:text-blue-500 dark:bg-blue-600",
  HIGH: "text-emerald-600 bg-emerald-200 dark:text-emerald-500 dark:bg-emerald-600",
};

const ProjectAnalytics = ({ tasks, project }) => {
  const { stats, statusData, typeData, priorityData } = useMemo(() => {
    const now = new Date();
    const total = tasks.length;

    const stats = {
      total,
      completed: 0,
      inProgress: 0,
      todo: 0,
      overdue: 0,
    };

    const statusMap = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    const typeMap = { TASK: 0, BUG: 0, FEATURE: 0, IMPROVEMENT: 0, OTHER: 0 };
    const priorityMap = { LOW: 0, MEDIUM: 0, HIGH: 0 };

    tasks.forEach((t) => {
      if (t.status === "DONE") stats.completed++;
      if (t.status === "IN_PROGRESS") stats.inProgress++;
      if (t.status === "TODO") stats.todo++;
      if (new Date(t.due_date) < now && t.status !== "DONE") stats.overdue++;

      if (statusMap[t.status] !== undefined) statusMap[t.status]++;
      if (typeMap[t.type] !== undefined) statusMap[t.type]++;
      if (priorityMap[t.priority] !== undefined) statusMap[t.priority]++;
    });

    return {
      stats,
      statusData: Object.entries(statusMap).map(([k, v]) => ({
        name: k.replace("_", " "),
        value: v,
      })),
      typeData: Object.entries(typeMap)
        .filter(([_, v]) => v > 0)
        .map(([k, v]) => ({ name: k, value: v })),
      priorityData: Object.entries(priorityMap).map(([k, v]) => ({
        name: k,
        value: v,
        percentage: total > 0 ? Math.round((v / total) * 100) : 0,
      })),
    };
  }, [tasks]);
  return <div>ProjectAnalytics</div>;
};

export default ProjectAnalytics;
