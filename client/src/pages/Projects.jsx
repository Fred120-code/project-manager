import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Search, FolderOpen } from "lucide-react";

const Projects = () => {
  const projects = useSelector(
    (state) => state?.workspace?.currentWorspace || [],
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

    if (filter.priorIty !== "ALL") {
      filtered = filtered.filter(
        (project) => project.priority === filter.priority,
      );
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [projects, filter, searchTerm]);

  return <div></div>;
};

export default Projects;
