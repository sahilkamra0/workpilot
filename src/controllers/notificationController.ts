

import {Request, Response} from "express";

import prisma from "../prisma";

export const getNotifications = async (req:any, res: Response)=> {
      
    try {
        const notification = await prisma.notification.findMany({
           
            where: {
                userId: req.userId
            },

            orderBy: {
                createdAt: "desc"
            }
        })

        res.json({
            notification
        });

    } catch(error) {
         
        res.status(500).json({
            message: "server error"
        });
    }
}


export const markNotificationRead = async (req: any, res: Response)=> {

    try {

        const {notificationId} = req.params;

        const notification = await prisma.notification.update({
            where: {
                id: notificationId
            },

            data: {
                isRead: true
            }
        });

        res.json({
            message: "Notification mark as read"
        })


    } catch(error) {
         
        res.status(500).json({
            message: "server error"
        })
    }
}