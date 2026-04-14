import { prisma } from "../db.js";

//Created project
export const createProject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress,
      priority,
    } = req.body;

    //check if user has admin role for workspace
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (
      !workspace.members.some(
        (member) => member.userId === userId && member.role === "ADMIN",
      )
    ) {
      return res.status(403).json({
        message:
          "You don't have permission to create projects in this workspace ",
      });
    }

    //Get team lead using email
    const teamLead = await prisma.user.findUnique({
      where: { email: team_lead },
      select: {
        id: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        workspaceId,
        description,
        name,
        status,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        team_lead: teamLead?.id,
        progress,
        priority,
      },
    });

    //Add members to project if they are in the workspace
    if (team_members?.length > 0) {
      const membersToAdd = [];
      workspace.members.forEach((member) => {
        if (team_members.include(member.user.email)) {
          membersToAdd.push(member.user.id);
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.code || error.message });
  }
};

//Update project
export const updateProject = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.code || error.message });
  }
};

//Add member to project
export const addMember = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.code || error.message });
  }
};
