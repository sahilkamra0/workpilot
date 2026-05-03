
import express from "express";


import { createWorkspace } from "../controllers/workspacecontroller";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUserWorkspaces } from "../controllers/workspacecontroller";
import { inviteUser } from "../controllers/workspacecontroller";
import { getWorkspaceDetails } from "../controllers/workspacecontroller";
import { removeUser } from "../controllers/workspacecontroller";
import { leaveWorkspace } from "../controllers/workspacecontroller";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);

router.get("/", authMiddleware, getUserWorkspaces);

router.post("/:workspaceId/invite", authMiddleware, inviteUser);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails)

router.delete("/:workspaceId/members/:userId", authMiddleware, removeUser);

router.delete("/:workspaceId/leave", authMiddleware, leaveWorkspace)

export default router;




