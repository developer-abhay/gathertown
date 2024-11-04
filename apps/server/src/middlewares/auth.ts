import { NextFunction, Request, Response } from "express"
import bcrypt from 'bcrypt'
import { findUserByUsername } from "../utils/helper"
import { CustomRequest } from "../interfaces/types"

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

    const user = await findUserByUsername(username)

    if (url == 'singup' && user) {
        res.status(409).json({ "error": "User Already Exists" })
        return;
    }
    if (url == 'singin' && !user) {
        res.status(404).json({ "error": "User not found" })
        return;
    }

    if (url == 'singin' && user) {
        req.user = user
    }

    next()
}