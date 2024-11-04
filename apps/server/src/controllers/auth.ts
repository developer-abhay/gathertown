import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findUserByUsername } from "../utils/helper";
import { CustomRequest } from "../interfaces/types";

export const signup = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, process.env.BCRYPT_SALT || 10)

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role
            },
            select: {
                id: true
            }
        })

        res.status(200).json({ id: newUser.id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}

export const signin = async (req: CustomRequest, res: Response) => {
    const { password } = req.body;

    try {
        const user = req.user; // From middleware

        const comparePassword = await bcrypt.compare(password, user!.password)

        if (!comparePassword) {
            res.status(401).json({ "error": "Invalid Credentials" })
            return
        }

        const token = jwt.sign({ id: user!.id }, process.env.JWT_SECRET || '123xyz123')

        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server error" })
    }
}