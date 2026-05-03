
import { Request, Response} from "express";
import prisma from "../prisma";

export const createProject = async (req:any, res:Response)=> {
    try {

        const {name} = req.body;
        const {workspaceId} = req.params;

        // 1. Check user is member of workspace

        const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userid,
                workspaceId
            }
        });

        if(!membership) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // 2. Create project

        const project = await prisma.project.create({
            data: {
                name,
                workspaceId
            }
        });

        res.json({
            message: "project created"
        });

    } catch(error) {
           res.status(500).json({
            message: "server error"
           });
    }
} ;

 export const getWorkspaceProjects = async (req:any, res:Response) => {

    try {
          const workspaceId = req.params;
           

     // 1. Check user is member of workspace

     const membership = await prisma.membership.findFirst({
        where: {
            userId: req.userId,
            workspaceId
        }
     });

     if(!membership) {
        return res.status(403).json({
            message: "access denied"
        });
     }

     // 2. Get all projects

     const projects = await prisma.project.findMany({
        where: {
            workspaceId
        },
        orderBy: {
            createdAt: "desc"
        }
     });

     res.json({
        projects
     });

    } catch(error) {
           
        res.status(500).json({
            message: "server error"
        });
    }
 };

 export const updateProject = async (req:any, res: Response) => {

    try {

        const {projectId} = req.params;
        const {name} = req.body;

         // 1. Find project

         const project = await prisma.projectfindUnique({
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
                message: "Access denied"
            });
          }

          // 3. Update project

          const updateProject = await prisma.project.update({
            where: {id: projectId} , 
              data: {
                name
              }
          });

          res.json({
            message: "project updated",
            project: updateProject
          });

    } catch(error) {
         res.status(500).json({
            message: "server error"
         });
    }
 };

 export const deleteProject = async (req: any, res:Response)=> {

    try {

        const {projectId} = req.params;

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

           // 3. Delete project

           await prisma.project.delete({
            where: {
                id: projectId
            }
           });

           res.json({
            message: "project deleted successfully"
           });



    } catch(error) {
          res.status(500).json({
            message: "server error" 
          });
    }
 }

 






