import express from "express";
import {
  addMember,
  getUserWorkspace,
} from "../contollers/workspaceController.js";

const workspaceRouter = express.Router();

workspaceRouter.get("/", getUserWorkspace);
workspaceRouter.post("/add-member", addMember);

export default workspaceRouter;
