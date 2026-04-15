import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import workspaceRouter from "./routes/workspaceRoute.js";
import projectRouter from "./routes/projectRoute.js";
import { protect } from "./middlewares/authMiddleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

//Routes
app.use("/api/workspaces", protect, workspaceRouter);
app.use("/api/projects", protect, projectRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
