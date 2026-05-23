import { Plus } from "lucide-react";
import { useState } from "react";
import CreateProjectDialog from "../components/CreateProjectDialog";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import { useUser } from "@clerk/react";

const Dashboard = () => {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Welcome back, {user?.fullName || "User"}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-xs sm:text-sm">
            Here's what's happening with your projects today
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 
        to-blue-600 text-white hover:opacity-90 transition whitespace-nowrap"
        >
          <Plus size={16} /> New Project
        </button>

        <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          <ProjectOverview />
          <RecentActivity />
        </div>
        <div>
          <TasksSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
