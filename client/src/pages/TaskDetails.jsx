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

  console.log(taskId);
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

  return (
    <div
      className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-gray-900
    dark:text-zinc-100 max-w-6xl mx-auto"
    >
      {/* Left: Comment/Chatbox */}
      <div className="w-full lg:w-2/3">
        <div
          className="p-5 rounded-md border border-gray-300 dark:border-zinc-800
        flex flex-col lg:h-[80vh]"
        >
          <h2
            className="text-base font-semibold flex items-center gap-2 
              mb-4 text-gray-900 dark:text-white"
          >
            <MessageCircle className="size-5" /> Task Discussion (
            {comments.length})
          </h2>

          <div className="flex-1 md:overflow-y-scroll no-scrollbar">
            {comments.length > 0 ? (
              <div className="flex flex-col gap-4 mb-6 mr-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`sm:max-w-4/5 dark:bg-gradient-to-br dark:from-zinc-800
                 dark:to-zinc-900 border border-gray-300 dark:border-zinc-700 p-3 rounded-md
                 ${comment.user.id === user?.id ? "mr-auto" : "ml-auto"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-zinc-500">
                      <img
                        src={comment.user.image}
                        alt="avatar"
                        className="size-5 rounded-full"
                      />
                      <span className="font-medium text-gray-400 dark:text-white">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-zinc-600">
                        •{" "}
                        {format(
                          new Date(comment.createdAt),
                          "dd MMM yyy, HH:mm",
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-zinc-200">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-zinc-500 mb-4 text-sm">
                No comments yet. Be the first!
              </p>
            )}
          </div>

          {/* Add Comment */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700
               rounded-md p-2 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none
                focus:ring-1 focus:ring-blue-600"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="bg-gradient-to-l from-blue-500 to-blue-600
             transition-colors text-white text-sm px-5 py-2 rounded-b-md"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
