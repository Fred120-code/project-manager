import { format } from "date-fns";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";

const ProjectSettings = ({ project }) => {
  const [formaData, setFormData] = useState({
    name: "New Website Launch",
    description: "Initial launch for new web platform.",
    status: "PLANNING",
    priority: "MEDIUM",
    start_date: "2025-09-10",
    end_date: "2025-10-15",
    progress: 30,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    if (project) formaData(project);
  }, [project]);

   const inputClasses =
     "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

   const cardClasses =
     "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

   const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";


  return <div>ProjectSettings</div>;
};

export default ProjectSettings;
