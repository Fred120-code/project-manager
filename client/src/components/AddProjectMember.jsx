import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const currentWorkspace = useSelector(
    (state) => state.workspace?.currentWorkspace || null,
  );

  const project = currentWorkspace?.projects.find((p) => p.id === id);
  const projectMembersEmails = project?.members.map(
    (member) => member.user.email,
  );

  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if (!isDialogOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center
     justify-center z-50"
    >
      <div
        className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800
         rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200"
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Add
            Member to Project
          </h2>
          {currentWorkspace && (
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              Adding to Project:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {project.name}
              </span>
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4"></form>
      </div>
    </div>
  );
};

export default AddProjectMember;
