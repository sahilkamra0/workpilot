
import express from "express";

import { createProject } from "../controllers/projectController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getWorkspaceProjects } from "../controllers/projectController";
import { getProjectDetails } from "../controllers/workspacecontroller";

const router = express.Router();

router.post("/:workspaceId", authMiddleware, createProject);

router.get("/:workspaceId", authMiddleware, getWorkspaceProjects);

router.get("/:projectId/details", authMiddleware, getProjectDetails)
export default router;
