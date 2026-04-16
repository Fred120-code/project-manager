import { Inngest } from "inngest";
import { prisma } from "../configs/db.js";
import sendEmail from "../configs/nodemalier.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

//Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [
      {
        event: "clerk/user.created",
      },
    ],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

//Inngest function to deleted user from database
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [
      {
        event: "clerk/user.deleted",
      },
    ],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  },
);

//Inngest function to updated user from database
const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-with-clerk",
    triggers: [
      {
        event: "clerk/user.updated",
      },
    ],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

//Inngest function to save workspace data to a database
const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: [
      {
        event: "clerk/organization.created",
      },
    ],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });

    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  },
);

//Inngest function to update workspace data in database
const syncWorkspaceUpdate = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
    triggers: [
      {
        event: "clerk/organization.updated",
      },
    ],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });
  },
);

//Inngest function to deleted workspace data in database
const syncWorkspacedeleted = inngest.createFunction(
  {
    id: "deleted-workspace-from-clerk",
    triggers: [
      {
        event: "clerk/organization.deleted",
      },
    ],
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.delete({
      where: {
        id: data.id,
      },
    });
  },
);

//Inngest function to save workspace member data to a database
const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: [
      {
        event: "clerk/organizationInvitation.accepted",
      },
    ],
  },
  async ({ event }) => {
    const { data } = event;

    console.log(
      "Organization invitation accepted webhook:",
      JSON.stringify(data, null, 2),
    );

    // Map Clerk role format to Prisma enum
    const roleMap: Record<string, "ADMIN" | "MEMBER"> = {
      "org:admin": "ADMIN",
      "org:member": "MEMBER",
    };

    const mappedRole = roleMap[data.role_name] || "MEMBER";

    try {
      await prisma.workspaceMember.create({
        data: {
          userId: data.user_id,
          workspaceId: data.organization_id,
          role: mappedRole,
        },
      });
      console.log(
        `Successfully created workspace member: userId=${data.user_id}, workspaceId=${data.organization_id}, role=${mappedRole}`,
      );
    } catch (error) {
      console.error("Error creating workspace member:", error);
      throw error;
    }
  },
);

//Inngest function to send email on task creation
const sendTaskAssignmentEmail = inngest.createFunction(
  {
    id: "send-task-assignment-mail",
    triggers: [
      {
        event: "app/task.assigned",
      },
    ],
  },
  async ({ event, step }) => {
    const { taskId, origin } = event.data;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        assignee: true,
        project: true,
      },
    });

    const dueDate = task?.due_date
      ? new Date(task.due_date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Non défini";

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .content {
              padding: 30px 20px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #333;
            }
            .task-info {
              background-color: #f9f9f9;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .task-title {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .task-detail {
              font-size: 14px;
              color: #666;
              margin: 8px 0;
            }
            .label {
              font-weight: 600;
              color: #667eea;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
            }
            .cta-button:hover {
              opacity: 0.9;
            }
            .footer {
              background-color: #f5f5f5;
              color: #999;
              font-size: 12px;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #eee;
            }
            .project-name {
              color: #667eea;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Nouvelle tâche assignée</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Bonjour <strong>${task?.assignee.name}</strong>,
              </div>
              
              <p>Vous avez été assigné à une nouvelle tâche dans le projet <span class="project-name">${task?.project.name}</span>.</p>
              
              <div class="task-info">
                <div class="task-title">📋 ${task?.title}</div>
                <div class="task-detail">
                  <span class="label">Date limite :</span> ${dueDate}
                </div>
                ${
                  task?.description
                    ? `<div class="task-detail">
                  <span class="label">Description :</span><br> ${task.description}
                </div>`
                    : ""
                }
              </div>
              
              <p>Veuillez cliquer sur le bouton ci-dessous pour consulter les détails de la tâche et commencer à travailler dessus.</p>
              
              <center>
                <a href="${origin}" class="cta-button">Voir la tâche</a>
              </center>
              
              <p style="color: #999; font-size: 14px;">
                Si vous avez des questions concernant cette tâche, veuillez contacter le gestionnaire de projet.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 Project Manager. Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: task?.assignee.email,
      subject: `Nouvelle tâche assignée : ${task?.title} - ${task?.project.name}`,
      body: htmlBody,
    });

    if (
      task?.due_date &&
      new Date(task.due_date).toLocaleDateString() !== new Date().toDateString()
    ) {
      await step.sleepUntil("wait-for-the-due-date", new Date(task.due_date));

      await step.run("ckeck-if-task-is-completed", async () => {
        const task = await prisma.task.findUnique({
          where: { id: taskId },
          include: {
            assignee: true,
            project: true,
          },
        });

        if (!task) return;

        if (task.status !== "DONE") {
          await step.run("send-task-reminder-mail", async () => {
            const reminderHtmlBody = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                      line-height: 1.6;
                      color: #333;
                      background-color: #f5f5f5;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      border-radius: 8px;
                      overflow: hidden;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                      color: white;
                      padding: 30px 20px;
                      text-align: center;
                    }
                    .content {
                      padding: 30px 20px;
                    }
                    .greeting {
                      font-size: 18px;
                      margin-bottom: 20px;
                      color: #333;
                    }
                    .alert-box {
                      background-color: #fff3e0;
                      border-left: 4px solid #f97316;
                      padding: 15px;
                      margin: 20px 0;
                      border-radius: 4px;
                    }
                    .alert-title {
                      font-size: 16px;
                      font-weight: bold;
                      color: #d97706;
                      margin-bottom: 10px;
                    }
                    .task-info {
                      background-color: #f9f9f9;
                      border-left: 4px solid #f97316;
                      padding: 15px;
                      margin: 20px 0;
                      border-radius: 4px;
                    }
                    .task-title {
                      font-size: 16px;
                      font-weight: bold;
                      color: #333;
                      margin-bottom: 10px;
                    }
                    .task-detail {
                      font-size: 14px;
                      color: #666;
                      margin: 8px 0;
                    }
                    .label {
                      font-weight: 600;
                      color: #f97316;
                    }
                    .cta-button {
                      display: inline-block;
                      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                      color: white;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 6px;
                      margin: 20px 0;
                      font-weight: bold;
                      text-align: center;
                    }
                    .cta-button:hover {
                      opacity: 0.9;
                    }
                    .footer {
                      background-color: #f5f5f5;
                      color: #999;
                      font-size: 12px;
                      padding: 20px;
                      text-align: center;
                      border-top: 1px solid #eee;
                    }
                    .project-name {
                      color: #f97316;
                      font-weight: 600;
                    }
                    .warning-icon {
                      font-size: 24px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1 style="margin: 0;">⏰ Rappel : Tâche à compléter</h1>
                    </div>
                    
                    <div class="content">
                      <div class="greeting">
                        Bonjour <strong>${task.assignee.name}</strong>,
                      </div>
                      
                      <div class="alert-box">
                        <div class="alert-title">⚠️ Attention</div>
                        <p>La date limite de votre tâche a été atteinte ou dépassée. Veuillez finaliser cette tâche dès que possible.</p>
                      </div>
                      
                      <p>Voici les détails de la tâche en attente dans le projet <span class="project-name">${task.project.name}</span> :</p>
                      
                      <div class="task-info">
                        <div class="task-title">📋 ${task.title}</div>
                        <div class="task-detail">
                          <span class="label">Date limite :</span> ${new Date(task.due_date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                        <div class="task-detail">
                          <span class="label">Statut actuel :</span> ${task.status}
                        </div>
                        ${
                          task?.description
                            ? `<div class="task-detail">
                          <span class="label">Description :</span><br> ${task.description}
                        </div>`
                            : ""
                        }
                      </div>
                      
                      <p style="color: #d97706; font-weight: 600;">
                        Merci de compléter cette tâche dès que possible pour maintenir la progression du projet.
                      </p>
                      
                      <center>
                        <a href="${origin || "#"}" class="cta-button">Compléter la tâche maintenant</a>
                      </center>
                      
                      <p style="color: #999; font-size: 14px;">
                        Si vous rencontrez des obstacles pour compléter cette tâche, veuillez contacter le gestionnaire de projet.
                      </p>
                    </div>
                    
                    <div class="footer">
                      <p>© 2026 Project Manager. Tous droits réservés.</p>
                    </div>
                  </div>
                </body>
              </html>
            `;

            await sendEmail({
              to: task.assignee.email,
              subject: `⏰ Rappel : Complétez votre tâche - ${task.title}`,
              body: reminderHtmlBody,
            });
          });
        }
      });
    }
  },
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
  syncWorkspaceCreation,
  syncWorkspaceUpdate,
  syncWorkspacedeleted,
  syncWorkspaceMemberCreation,
  sendTaskAssignmentEmail,
];
inngest;
