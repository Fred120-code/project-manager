import { useState } from "react";
import { XIcon } from "lucide-react";
import { useSelector } from "react-redux";

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    start_date: "",
    end_date: "",
    team_members: [],
    team_lead: "",
    progress: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const removeTeamMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((m) => m !== email),
    }));
  };

  if (!isDialogOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex
     items-center justify-center text-left z-50"
    >
      <div
        className="bg-white dark:bg-zinc-950 border border-zinc-200
      dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900
      dark:text-zinc-200 relative"
      >
        <button
          className=" absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 
          hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => setIsDialogOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-medium mb-1">Create New Project</h2>
        {currentWorkspace && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            In workspace:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {currentWorkspace.name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateProjectDialog;
