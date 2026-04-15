import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
} from "../contollers/taskController.js";

const taskRouter = express.Router()

taskRouter.post("/", createTask)
taskRouter.put("/:id", updateTask)
taskRouter.post("/deleted", deleteTask);

export default taskRouter