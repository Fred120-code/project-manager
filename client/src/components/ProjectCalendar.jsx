import { useState } from "react";
import {
  format,
  isSameDay,
  isBefore,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ProjectCalendar = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const getTasksForDate = (date) =>
    tasks.filter((task) => isSameDay(task.due_date, date));

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.due_date &&
        !isBefore(task.due_date, today) &&
        task.status !== "DONE",
    )
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const overdueTaks = tasks.filter(
    (task) =>
      task.due_date && isBefore(task.due_date, today) && task.status !== "DONE",
  );

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleMonthChange = (direction) => {
    setCurrentMonth((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1),
    );
  };
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar View */}
      <div className="lg:col-span-2">
        <div
          className="not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70
         dark:to-zinc-900/50 border border-zinc-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-zinc-900 dark:text-white text-md flex gap-2 items-center max-sm:hidden">
              <CalendarIcon className="size-5" /> Task Calendar
            </h2>
            <div className="flex gap-2 items-center">
              <button onClick={() => handleMonthChange("prev")}>
                <ChevronLeft className="size-5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" />
              </button>
              <span className="text-zinc-900 dark:text-white">
                {format(currentMonth, "MMM yyyy")}
              </span>
              <button onClick={() => handleMonthChange("next")}>
                <ChevronRight className="size-5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" />
              </button>
            </div>
          </div>

          <div
            className="grid grid-cols-7 text-xs text-zinc-600 dark:text-zinc-400
           mb-2 text-center"
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const hasOverdue = dayTasks.some(
                (t) => t.status !== "DONE" && isBefore(t.due_date, today),
              );

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`sm:h-14 rounded-md flex flex-col items-center justify-center text-sm
                      ${isSelected ? "bg-blue-200 text-blue-900 dark:bg-blue-600 dark:text-white" : "bg-zinc-50 text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"}
                      ${hasOverdue ? "border border-red-300 dark:border-red-500" : ""}`}
                >
                  <span>{format(day, "d")}</span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-blue-700 dark:text-blue-400">
                      {dayTasks.length} tasks
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks for selected day */}
    </div>
  );
};

export default ProjectCalendar;
