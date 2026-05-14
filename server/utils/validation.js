import joi from "joi";

export const taskSchema = joi.object({
  projectId: joi.string().required(),
  title: joi.string().required().trim().min(2).max(100),
  description: joi.string().allow("").trim().max(500),
  status: joi.string().valid("TODO", "IN_PROGRESS", "DONE").default("TODO"),
  type: joi
    .string()
    .valid("BUG", "FEATURE", "TASK", "IMPROVEMENT", "OTHER")
    .default("TASK"),
  priority: joi.string().valid("LOW", "MEDIUM", "HIGH").default("MEDIUM"),
  assigneeId: joi.string().allow(null),
  due_date: joi.date().iso().allow(null),
});

export const projectSchema = joi
  .object({
    workspaceId: joi.string().required().messages({
      "string.empty": "L'ID du workspace est requis",
      "any.required": "L'ID du workspace est requis",
    }),
    name: joi.string().required().trim().min(2).max(100).messages({
      "string.empty": "Le nom du projet est requis",
      "string.min": "Le nom du projet doit contenir au moins 2 caractères",
      "string.max": "Le nom du projet ne peut pas dépasser 100 caractères",
      "any.required": "Le nom du projet est requis",
    }),
    description: joi.string().allow("").trim().max(500).messages({
      "string.max": "La description ne peut pas dépasser 500 caractères",
    }),
    priority: joi
      .string()
      .valid("LOW", "MEDIUM", "HIGH")
      .default("MEDIUM")
      .messages({
        "any.only": "La priorité doit être LOW, MEDIUM ou HIGH",
      }),
    status: joi
      .string()
      .valid("ACTIVE", "PLANNING", "COMPLETED", "ON_HOLD", "CANCELLED")
      .default("ACTIVE")
      .messages({
        "any.only": "Le statut doit être valide",
      }),
    start_date: joi.date().iso().allow(null).messages({
      "date.base": "La date de début doit être une date valide",
    }),
    end_date: joi.date().iso().allow(null).messages({
      "date.base": "La date de fin doit être une date valide",
    }),
    team_members: joi
      .array()
      .items(joi.string().email().lowercase().trim())
      .optional()
      .default([])
      .messages({
        "array.base": "Les membres de l'équipe doivent être un tableau",
        "string.email": "Tous les membres doivent avoir des emails valides",
      }),
    team_lead: joi.string().email().lowercase().trim().optional().messages({
      "string.email": "Le responsable du projet doit avoir un email valide",
    }),
    progress: joi.number().min(0).max(100).default(0).messages({
      "number.min": "La progression doit être au minimum 0",
      "number.max": "La progression ne peut pas dépasser 100",
      "number.base": "La progression doit être un nombre",
    }),
  })
  .unknown(false);
