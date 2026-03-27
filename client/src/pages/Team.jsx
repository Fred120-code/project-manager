import { UsersIcon, Search, UserPlus, Shield, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
          onClick={()=> setIsDialogOpen(true)}
          className="flex items-center px-5 py-2 rounded text-sm bg-gradient-to-br from-blue-500
          to-blue-600 hover:opacity-90 text-white transition"
        >
          <UserPlus className="w-4 h-4 mr-2"/> Invite Member
        </button>
      </div>
    </div>
  );
};

export default Team;
