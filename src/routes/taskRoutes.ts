

import express from "express";

import { createTask } from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getProjectTasks } from "../controllers/taskController";
import { updateTask } from "../controllers/taskController";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/:projectId", authMiddleware, getProjectTasks);

router.put("/:taskId", authMiddleware, updateTask);

export default router;
