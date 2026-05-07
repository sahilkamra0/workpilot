
import {Request, Response} from "express";

import prisma from "../prisma";

export const addComment = async (req: any, res: Response) => {
     
    try {

        const {content, taskId} = req.body;

        // 1. Check task exists

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        });

        if(!task) {
            return res.status(403).json({
                message: "task not found"
            });
        }

        // 2. Check workspace access

        const project = await prisma.project.findUnique({
            where: {
                id: task.projectId
            }
        });

        const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userId,
                workspaceId: project?.workspaceId

            }
        });

        if(!membership) {
            return res.status(403).json({
                message: "access denied"
            });
        }

         // 3. Create comment

         const comment = await prisma.comment.craete({
            data: {
                content,
                taskId,
                userId: req.userId
            }
         });

         await prisma.activityLog.create({
  data: {
    action: "ADD_COMMENT",
    description: "Comment added",
    userId: req.userId,
    taskId
  }
});

         res.json({
            message: "comment added"
         });

    } catch(error) {
          res.status(403).json({
            message: "server error"
          });
    }
}

export const getTaskComments = async (req: any, res: Response)=> {

    try {

        const {taskId} = req.params;

        const comments = await prisma.comment.findmany({
            where: {taskId},

            include: {
                user: true
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        res.json({
            comments
        });


    } catch(error) {
          
        res.status(500).json({
            message: "server error"
        });
    }
};

