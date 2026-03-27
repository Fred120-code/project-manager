import { UsersIcon, Search, UserPlus, Shield, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InviteMemberDialog from "../components/InviteMemberDialog";

const Team = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, serSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const currentWorspace = useSelector(
    (state) => state?.workspace?.currentWorkspace || null,
  );

  const projects = currentWorspace?.projects || [];
  const filteredUsers = users.filter(
    (user) =>
      user?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setUsers(currentWorspace?.members || []);
    setTasks(
      currentWorspace?.projects?.reduce(
        (acc, project) => [...acc, ...project.tasks],
        [],
      ) || [],
    );
  }, [currentWorspace]);
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div
        className="flex flex-col lg:flex-row justify-between items-start
       lg:items-center gap-6"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white mb-1">
            Team
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Manage team members and their contributions
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-5 py-2 rounded text-sm bg-gradient-to-br from-blue-500
          to-blue-600 hover:opacity-90 text-white transition"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </button>

        {/* <InviteMemberDialog /> */}
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4">
        {/* Total Members */}
        <div
          className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50
        border border-gray-300 dark:border-zinc-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between gap-8 md:gap-22">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Total Members
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/10">
              <UsersIcon className="size-4 text-blue-500 dark:text-blue-200" />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div
          className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50
        border border-gray-300 dark:border-zinc-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between gap-8 md:gap-22">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Active Projects
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {
                  projects.filter(
                    (p) => p.status !== "CANCELLED" && p.status !== "COMPLETED",
                  ).length
                }
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
              <Activity className="size-4 text-emerald-500 dark:text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div
          className="max-sm:w-full dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50
        border border-gray-300 dark:border-zinc-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between gap-8 md:gap-22">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Total Tasks
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {tasks.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-500/10">
              <Shield className="size-4 text-purple-500 dark:text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
