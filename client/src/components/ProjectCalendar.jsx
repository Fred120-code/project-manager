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
  return <div>ProjectCalendar</div>;
};

export default ProjectCalendar;
