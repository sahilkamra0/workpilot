import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};