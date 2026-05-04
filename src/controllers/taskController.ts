
import {Request, Response} from "express";

import prisma from "../prisma";

export const createTask = async (req:any, res: Response)=> {
    try {

     const {title, description, projectId} = req.body;

     // 1. Find project

     const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
     });

     if(!project) {
        return res.status(404).json({
            message: "project not found"
        });
     }

          // 2. Check user belongs to workspace

          const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userId,
                workspaceId: project.workspaceId
            }
          });

          if(!membership) {
            return res.status(403).json({
                message: "access denied"
            });
          }

          // 3. Create task


          const task = await prisma.task.create({
            data: {
                title,
                description,
                status: "todo",
                projectId
            }
          });

          res.json({
            message: "task created",
            task
          });

    } catch(error) {
          
        res.status(500).json({
            message: "server error"
        });
    }
};

