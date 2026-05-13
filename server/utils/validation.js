import joi from "joi";

export const taskSchema = joi.object({
  projectId: joi.required(),
  title: joi.string().required(),
  description: joi.string().allow(""),
  status: joi.string().valid("TODO", "IN_PROGRESS", "DONE").default("TODO"),
  type: joi
    .string()
    .valid("BUG", "FEATURE", "TASK", "IMPROVEMENT", "OTHER")
    .default("TASK"),
  priority: joi.string().valid("LOW", "MEDIUM", "HIGH").default("MEDIUM"),
  assigneeId: joi.string().allow(null),
  due_date: joi.date().iso().allow(null),
});
