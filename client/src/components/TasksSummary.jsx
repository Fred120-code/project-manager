import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useSelector } from "react-redux";

const TasksSummary = () => {
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const user = { id: "user_1" };
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (currentWorkspace) {
      setTasks(currentWorkspace.projects.flatMap((project) => project.tasks));
    }
  }, [currentWorkspace]);

  const myTasks = tasks.filter((t) => t.assigneeId === user.id);
  const overdueTasks = tasks.filter(
    (t) =>
      t.due_date && new Date(t.due_date) < new Date() && t.status !== "DONE",
  );
  const inProgressIssues = tasks.filter((i) => i.status === "IN_PROGRESS");

  const summaryCards = [
    {
      title: "My Tasks",
      count: myTasks.length,
      icon: User,
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
      items: myTasks.slice(0, 3),
    },
    {
      title: "Overdue",
      count: overdueTasks.length,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
      items: overdueTasks.slice(0, 3),
    },
    {
      title: "In Progress",
      count: inProgressIssues.length,
      icon: Clock,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
      items: inProgressIssues.slice(0, 3),
    },
  ];

  return <div>TasksSummary</div>;
};

export default TasksSummary;
