import { NextFunction, Request, Response } from "express"
import { findUserByUsername } from "../utils/helper"
import { CustomRequest } from "../interfaces/types"
import jwt from "jsonwebtoken"

// Validate middleware while signin and signup
export const validateAuthInputs = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, role } = req.body
    const url = req.originalUrl.split('/v1/')[1]

    if (!username || typeof username !== 'string') {
        res.status(400).json({ "error": "Please provide valid username" })
        return;
    }

    if (!password || typeof password !== 'string') {
        res.status(400).json({ "error": "Please provide valid password" })
        return;
    }

    if (url == 'signup' && role != "Admin" && role != "User") {
        res.status(400).json({ "error": "Invalid Role" })
        return
    }

    next()
}

// Duplicate user check while signup
export const checkIfUserExists = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const url = req.originalUrl.split('/v1/')[1]

    try {
        const user = await findUserByUsername(username)

        if (url == 'signup' && user) {
            res.status(409).json({ "error": "User Already Exists" })
            return;
        }
        if (url == 'signin' && !user) {
            res.status(404).json({ "error": "User not found" })
            return;
        }

        if (url == 'signin' && user) {
            req.user = user
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}


export const authenticateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (token && process.env.JWT_SECRET) {
        const user = jwt.verify(token, process.env.JWT_SECRET) as { id: string, role: 'Admin' | "User" }
        req.user = { id: user.id, role: user.role }
        next()
    } else {
        res.status(401).json({ "error": "Unauthorized" })
    }
}