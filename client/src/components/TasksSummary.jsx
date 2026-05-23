import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/react";

const TasksSummary = () => {
  const user = useUser();
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (currentWorkspace) {
      setTasks(currentWorkspace.projects.flatMap((project) => project.tasks));
    }
  }, [currentWorkspace]);

  const myTasks = tasks.filter((t) => t.assigneeId === user.user.id);
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

  return (
    <div className="space-y-3 sm:space-y-6">
      {summaryCards.map((card) => (
        <div
          className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50
           border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700
            transition-all duration-200 rounded-lg overflow-hidden"
          key={card.title}
        >
          <div className="border-b border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 pb-2 sm:pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex-shrink-0">
                <card.icon className="size-4 text-gray-500 dark:text-zinc-400" />
              </div>
              <div className="flex items-center justify-between flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">
                  {card.title}
                </h3>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${card.color}`}
                >
                  {card.count}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            {card.items.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">
                No {card.title.toLocaleLowerCase()}
              </p>
            ) : (
              <div className="space-y-3">
                {card.items.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-2 sm:p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800
                         transition-colors cursor-pointer"
                  >
                    <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white truncate">
                      {issue.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-zinc-400 capitalize mt-1">
                      {issue.type} • {issue.priority} priority
                    </p>
                  </div>
                ))}
                {card.count > 3 && (
                  <button
                    className="flex items-center justify-center w-full text-sm text-gray-500 dark:text-zinc-400
                     hover:text-gray-800 dark:hover:text-white mt-2"
                  >
                    View {card.count - 3} more{" "}
                    <ArrowRight className="size-3 ml-2" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksSummary;
