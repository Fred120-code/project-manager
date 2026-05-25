import express from "express";
import "dotenv/config";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { protect } from "./middlewares/authMiddleware.js";
import workspaceRouter from "./routes/workspaceRoute.js";
import projectRouter from "./routes/projectRoute.js";
import taskRouter from "./routes/taskRoute.js";
import commentRouter from "./routes/comentRoute.js";

const app = express();

// Helper function to create user-based limiters
const createUserLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use userId for authenticated requests, fallback to IP with proper IPv6 handling
      if (req.userId) {
        return req.userId;
      }
      return ipKeyGenerator(req);
    },
    skip: (req) => {
      // Don't limit unauthenticated requests (they're blocked by protect middleware anyway)
      return !req.userId;
    },
  });
};

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Per-user API limiter: 30 requests per minute per user
const apiLimiter = createUserLimiter(
  60 * 1000,
  30,
  "Trop de requêtes, veuillez réessayer plus tard.",
);
 
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(clerkMiddleware());
app.use(helmet());

app.use(generalLimiter);

app.use("/api/inngest", serve({ client: inngest, functions }));

//Routes
app.use("/api/workspaces", protect, apiLimiter, workspaceRouter);
app.use("/api/projects", protect, apiLimiter, projectRouter);
app.use("/api/tasks", protect, apiLimiter, taskRouter);
app.use("/api/comments", protect, apiLimiter, commentRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
("mern project manager");
