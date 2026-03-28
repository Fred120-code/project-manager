import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon } from "lucide-react";
import { assets } from "../assets/assets";

const TaskDetails = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const taskId = searchParams.get("taskId");

  console.log(taskId)
  const user = {
    id: "user_1",
  };
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const { currentWorkspace } = useSelector((state) => state.workspace);
  const fetchComments = async () => {};

  const fetchTaskDetails = async () => {
    setLoading(true);
    if (!projectId || !taskId) return;

    const proj = currentWorkspace.projects.find((p) => p.id === projectId);
    if (!proj) return;

    const tsk = proj.tasks.find((t) => t.id === taskId);
    if (!tsk) return;

    setTask(tsk);
    setProject(proj);
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      toast.loading("Adding comment...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const dummyComment = {
        id: Date.now(),
        user: {
          id: 1,
          name: "User",
          image: assets.profile_img_a,
        },
        content: newComment,
        createdAt: new Date(),
      };

      setComments((prev) => [...prev, dummyComment]);
      setNewComment("");
      toast.dismissAll();
      toast.success("Comment added");
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  useEffect(() => {
    if (taskId && task) {
      fetchComments();
      const interval = setInterval(() => {
        fetchComments();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task, taskId]);

  if (loading)
    return (
      <div className="text-gray-500 dark:text-zinc-400 px-4 py-6">
        Loading task details...
      </div>
    );

  if (!task)
    return <div className="text-red-500 px-4 py-6">Task not found.</div>;

  return <div>TaskDetails</div>;
};

export default TaskDetails;
