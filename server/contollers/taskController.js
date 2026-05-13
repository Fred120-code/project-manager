import { prisma } from "../configs/db.js";
import { inngest } from "../inngest/index.js";

//create task
export const createTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      projectId,
      title,
      description,
      status,
      type,
      priority,
      assigneeId,
      due_date,
    } = req.body;

    const origin = req.get("origin");

    // Check if user has admin role for project
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    } else if (project.team_lead !== userId) {
      return res
        .status(500)
        .json({ message: "You don't have admin privileges for this project" });
    } else if (
      assigneeId &&
      !project.members.find((member) => member.user.id === assigneeId)
    ) {
      return res.status(403).json({
        message: "assignee is not a member of the project / workspace",
      });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        status,
        type,
        priority,
        assigneeId,
        due_date: new Date(due_date),
      },
    });

    const taskWithAssignee = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
      include: {
        assignee: true,
      },
    });

    await inngest.send({
      name: "app/task.assigned",
      data: {
        taskId: task.id,
        origin,
      },
    });

    return res
      .status(200)
      .json({ task: taskWithAssignee, message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.code || error.message });
  }
};

//Update task
export const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const { userId } = await req.auth();

    // Check if user has admin role for project
    const project = await prisma.project.findUnique({
      where: {
        id: task.projectId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    } else if (project.team_lead !== userId) {
      return res
        .status(500)
        .json({ message: "You don't have admin privileges for this project" });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    return res
      .status(200)
      .json({ task: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.code || error.message });
  }
};

//Deleted task
export const deleteTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { tasksId } = req.body;

    const tasks = await prisma.task.findMany({
      where: { id: { in: tasksId } },
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has admin role for project
    const projects = await prisma.project.findMany({
      where: {
        id: { in: tasks.map((task) => task.projectId) },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    } else if (!projects.every((project) => project.team_lead === userId)) {
      return res
        .status(403)
        .json({ message: "You don't have admin privileges for this project" });
    }

    await prisma.task.deleteMany({
      where: {
        id: { in: tasksId },
      },
    });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.code || error.message });
  }
};
