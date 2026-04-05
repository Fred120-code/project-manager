import { format } from "date-fns";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";

const ProjectSettings = ({ project }) => {
  const [formData, setFormData] = useState({
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
    if (project) setFormData(project);
  }, [project]);

  const inputClasses =
    "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

  const cardClasses =
    "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

  const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Project Details */}
      <div className={cardClasses}>
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
          Project Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className={labelClasses}>Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClasses}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className={labelClasses}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClasses + " h-24"}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClasses}>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={inputClasses}
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSettings;
