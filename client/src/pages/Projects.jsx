import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Search, FolderOpen } from "lucide-react";
import CreateProjectDialog from "../components/CreateProjectDialog";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const projects = useSelector(
    (state) => state?.workspace?.currentWorkspace?.projects || [],
  );
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState({
    status: "ALL",
    priority: "ALL",
  });

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (filter.status !== "ALL") {
      filtered = filtered.filter((project) => project.status === filter.status);
    }

    if (filter.priority !== "ALL") {
      filtered = filtered.filter(
        (project) => project.priority === filter.priority,
      );
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [projects, filter, searchTerm]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className=" flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1
            className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white
          mb-1"
          >
            Projects
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Manage and track your projects
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600
          text-white hover:opacity-90 transition"
        >
          <Plus className="size-4 mr-2" />
          New Project
        </button>
        <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className=" relative w-full max-w-sm">
          <Search
            className=" absolute left-3 top-1/2 transform -translate-y-1/2
           text-gray-400 dark:text-zinc-400 w-4 h-4"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 text-sm pr-4 py-2 rounded-lg border border-gray-300
              dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 
               dark:placeholder-zinc-400 focus:border-blue-500 outline-none"
            placeholder="Search projects..."
          />
        </div>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className=" px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700
           text-gray-900 dark:text-white text-sm"
        >
          <option value="ALL" className="dark:text-black">
            All Status
          </option>
          <option value="ACTIVE" className="dark:text-black">
            Active
          </option>
          <option value="PLANNING" className="dark:text-black">
            Planning
          </option>
          <option value="COMPLETED" className="dark:text-black">
            Completed
          </option>
          <option value="ON_HOLD" className="dark:text-black">
            On Hold
          </option>
          <option value="CANCELLED" className="dark:text-black">
            Cancelled
          </option>
        </select>

        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className=" px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700
           text-gray-900 dark:text-white text-sm"
        >
          <option value="ALL" className="dark:text-black">
            All Priority
          </option>
          <option value="HIGH" className="dark:text-black">
            High
          </option>
          <option value="MEDIUM" className="dark:text-black">
            Medium
          </option>
          <option value="LOW" className="dark:text-black">
            Low
          </option>
        </select>
      </div>

      {/* Create Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div
              className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full
              flex items-center justify-center"
            >
              <FolderOpen className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No projects found
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-6 text-sm">
              Create your first project to get started
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2
                rounded mx-auto text-sm"
            >
              <Plus className="size-4" />
              Create Project
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
