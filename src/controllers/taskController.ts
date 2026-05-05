
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

export const getProjectTasks = async (req: any, res:Response)=> {
      
    try {

        const {projectId} = req.params;

        // 1. Find project

        const project = await prisma.project.findUnique({
            where: {id: projectId}
        });

        if(!project) {
            return res.status(404).json({
                message: "project not found"
            });
        }

        // 2. Check workspace membership

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

         // 3. Get tasks

         const tasks = await prisma.task.findMany({
            where: {
                projectId
            },

            orderBy: {
                createdAt: "desc"
            }
         });

         res.json({
            tasks
         });



    } catch(error) {
         
        res.status(500).json({
            message: "server error"
        });
    }
};

export const updateTask = async (req:any, res: Response)=> {
    try {

        const {taskId} = req.params;
        const {title, description, status, assignedToId} = req.body;

        // 1. Find task

        const task = await prisma.task.findUnique({
            where: {
                Id: taskId
            }
        });

        if(!task) {
            return res.status(404).json({
                message: "task not found"
            });
        }

        // 2. Find project

        const project = await prisma.project.findUnique({
            where: {
                Id: task.projectId
            }
        });

        // 3. Check membership

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

        // 4. Update task

        const updatedTask = await prisma.task.update({
            where: {id: taskId},
            data: {
                title,
                description,
                status,
                assignedToId
            }
        });

        res.json({
            message: "task updated",
            task: updatedTask
        });


    } catch(error) {
         res.status(500).json({
            message: "server error"
         });
    }
};

export const deleteTask = async (req: any, res: Response)=> {

    try {
       
        const { taskId } = req.params;

        // 1. Find task

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        });

        if(!task) {
            return res.status(404).json({
                message: "task not found"
            });
        }

         // 2. Find project

         const project = await prisma.project.findUnique({
            where: {
                id: task.projectId
            }
         });

         // 3. Check membership

         const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userId,
                workspaceId: project?.workpspaceId
            }
         });


         if (!membership) {
            return res.status(403).json({
                message: "access denied"
            });
         }

         // 4. Delete task

         await prisma.task.delete({
            where: {
                id: taskId
            }
         });


         res.json({
            message: "task deleted successfully"
         });

    } catch(error) {
        res.status(500).json({
            message: "server error"
        });
    }
}

