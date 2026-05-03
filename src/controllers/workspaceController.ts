
import { Request, Response } from "express";
import prisma from "../prisma";
import { MembershipScalarFieldEnum } from "../generated/prisma/internal/prismaNamespace";

export const createWorkspace = async (req: any, res: Response) => {
  try {
    const { name } = req.body;

    const workspace = await prisma.workspace.create({
      data: {
        name,
        ownerId: req.userId,

        memberships: {
          create: {
            userId: req.userId,
            role: "ADMIN"
          }
        }
      }
    });

    res.status(201).json({
      message: "Workspace created",
      workspace
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


export const getUserWorkspaces = async (req:any, res: Response)=> {

    try {

        const workspaces = await prisma.workspace.findmany({
            where: {
                memberships: {
                    some: {
                        userId: req.uderId
                    }
                }
            },
            include: {
                memberships: true
            }
        });

        res.json({
            workspaces
        });


    } catch(error) {
        
        res.status(500).json({
            message: "server error"
        });
    }
};  


 export const inviteUser = async (req: any, res: Response)=> {

    try {

        const {email} = req.body;
        const {workspaceId} = req.params;

        if(!email) {
            return res.status(400).json({
                message: "email is required"
            });
        }

        if(!workspaceId) {
            return res.status(400).json({
                message: "worksapce id is required"
            });
        }

        // 🔐 1. Check if current user is ADMIN

        const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userId,
                workspaceId
            }
        });

        if (!membership || membership.role !== "ADMIN") {
            return res.status(403).json({
                message: "only admins can invite users"
            });
        }

         // 2. Find user to invite

         const user = await prisma.user.findUnique({
            where: {email}
         });

         if(!user) {
            return res.status(404).json({
                message: "user not found"
            });
         }

          // 3. Check if already member

          const existingMember = await prisma.membership.findFirst({
            where: {
                userId: user.id,
                workspaceId
            }
          });

          if(!existingMember) {
                return res.status(400).json({
                    message: "user already in workspace"
                });
          }

          // 4. Add to workspace

          const newMember = await prisma.membership.create({
            data: {
                     userId: user.id,
                     workspaceId,
                     role: "MEMBER"

            }
          });

          res.json({
            message: "user invited successfully",
            membership: newMember
          });

    } catch(error) {
          
        res.status(500).json({
            message: "server error"
        });
    }
 };


 export const getWorkspaceDetails = async (req:any, res:Response)=> {

    try {
          const {workspaceId} = req.params;

          // 1. Check if user is part of workspace

          const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userId,
                workspaceId
            }
          });

          if(!membership) {
            return res.status(403).json({
                message: "Access denied"
            });
          }

          // 2. Get workspace + members

          const workspace = await prisma.workspace.findUnique({
            where: {id: workspaceId},
            include: {
                membership: {
                    include: {
                        user: true
                    }
                }
            }
          });

          if(!workspace) {
            return res.status(404).json({
                message: "workspace not found"
            });
          }

          res.json({
            workspace
          });



    } catch(error) {
         res.status(500).json({
            message: "server error"
         });
    }
 };

 export const removeUser = async (req:any, res: Response)=> {

    try {

        const {workspaceId, userId} = req.params;

        // 🔐 1. Check if current user is ADMIN

        const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userId,
                workspaceId
            }
        });

        if(!membership || membership.role !== "ADMIN") {
            return res.status(403).json({
                message: "only admins can remove users"
            });
        }

        // 2. Prevent removing yourself (optional but good)

        if (userId ===req.userId) {
            return res.status(400).json({
                message: "you cannot remove yourself"
            });
        }

          // 3. Check if target user exists in workspace

          const existingMember = await prisma.membership.findFirst({
            where: {
                userId,
                workspaceId
            }
          });

          if(!existingMember) {
            return res.status(404).json({
                message: "user not found in workspace"
            });
          }

          // 4. Remove user

          await prisma.membership.delete({
            where: {
                id: existingMember.id
            }
          });

          res.json({
            message: "user removed successfully"
          });

    } catch(error) {
        res.status(500).json({
            message: "server error"
        });
    }
 }

 export const leaveWorkspace = async (req:any, res: Response)=> {

    try {
        
        const {workspaceId} = req.params;

          // 1. Check if user is part of workspace

          const membership = await prisma.membership.findFirst({
            where: {
                userId: req.userid,
                workspaceId
            }
          });

          if(!membership) {
            return res.status(404).json({
                message: "you are not part of this workspace"
            });
          }

          // 2. Optional: Prevent owner from leaving (advanced rule)
    // (skip for now if you don't have owner logic)

           // 3. Remove membership

           await prisma.membership.delete({
            where: {
                id: membership.id
            }
           });

           res.json({
            message: "you left the workspace"
           });

    } catch (error) {
        res.status(500).json({
            message: "server error"
        });
    }
 };

 export const getProjectDetails = async (req:any, res: Response) => {

    try {
        const {projectId} = req.params;

         // 1. Find project

         const project = await prisma.project.findUnique({
            where: {id: projectId}
         });

         if(!project) {
            return res.status(404).json({
                message: "Project not found"
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

          res.json({
            project
          });

    } catch(error) {
         res.status(500).json({
            message: "server error"
         });
    }
 };
     