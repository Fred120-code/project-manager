import {
  Bug,
  CalendarIcon,
  GitCommit,
  MessageSquare,
  Square,
  Trash,
  X,
  XIcon,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/workspaceSlice";

const typeIcons = {
  BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
  FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
  TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
  IMPROVEMENT: {
    icon: GitCommit,
    color: "text-purple-600 dark:text-purple-400",
  },
  OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts = {
  LOW: {
    background: "bg-red-100 dark:bg-red-950",
    prioritycolor: "text-red-600 dark:text-red-400",
  },
  MEDIUM: {
    background: "bg-blue-100 dark:bg-blue-950",
    prioritycolor: "text-blue-600 dark:text-blue-400",
  },
  HIGH: {
    background: "bg-emerald-100 dark:bg-emerald-950",
    prioritycolor: "text-emerald-600 dark:text-emerald-400",
  },
};

const ProjectTasks = ({ tasks }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    type: "",
    priority: "",
    assignee: "",
  });

  const assigneeList = useMemo(
    () =>
      Array.from(new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const { status, type, priority, assignee } = filters;
      return (
        (!status || task.status === status) &&
        (!type || task.type === type) &&
        (!priority || task.priority === priority) &&
        (!assignee || task.assignee?.name === assignee)
      );
    });
  }, [filters, tasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      toast.loading("Updating status...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      let updatedTask = structuredClone(tasks.find((t) => t.id === taskId));
      updatedTask.status = newStatus;
      dispatch(updateTask(updatedTask));

      toast.dismissAll();
      toast.success("Task status updated successfully");
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const confrim = window.confirm(
        "Are you sure you want to delete the selected tasks?",
      );

      if (!confrim) return;
      toast.loading("Deleting tasks...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      dispatch(deleteTask(selectedTasks));
      toast.dismissAll();
      toast.success("Tasks deleted successfully");
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        {["status", "type", "priority", "assignee"].map((name) => {
          const options = {
            status: [
              { label: "All Statuses", value: "" },
              { label: "To Do", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
            ],
            type: [
              { label: "All Types", value: "" },
              { label: "Task", value: "TASK" },
              { label: "Bug", value: "BUG" },
              { label: "Feature", value: "FEATURE" },
              { label: "Improvement", value: "IMPROVEMENT" },
              { label: "Other", value: "OTHER" },
            ],
            priority: [
              { label: "All Priorities", value: "" },
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ],
            assignee: [
              { label: "All Assignees", value: "" },
              ...assigneeList.map((n) => ({ label: n, value: n })),
            ],
          };

          return (
            <select
              name={name}
              id={name}
              onChange={handleFilterChange}
              className="border not-dark:bg-white border-zinc-300 dark:border-zinc-800
                 outline-none px-3 py-1 rounded text-sm text-zinc-900 dark:text-zinc-300"
            >
              {options[name].map((opt, idx) => (
                <option key={idx} className="dark:text-zinc-700">
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })}

        {/* Reset filters */}
        {(filters.status ||
          filters.type ||
          filters.priority ||
          filters.assignee) && (
          <button
            type="button"
            onClick={() =>
              setFilters({
                status: "",
                type: "",
                priority: "",
                assignee: "",
              })
            }
            className="px-3 py-1 flex items-center gap-2 rounded bg-gradient-to-br 
              from-purple-400 to-purple-500 text-zinc-100 dark:text-zinc-200 text-sm
               transition-colors"
          >
            <XIcon className="size-3" /> Reset
          </button>
        )}
        {selectedTasks.length > 0 && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1 flex items-center gap-2 rounded bg-gradient-to-br 
              from-indigo-400 to-indigo-500 text-zinc-100 dark:text-zinc-200 text-sm
               transition-colors"
          >
            <Trash className="size-3" /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectTasks;
