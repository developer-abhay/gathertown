import { Request, Response } from "express"
import { CustomRequest } from "../interfaces/types"
import prisma from "../db/prisma";

export const updateUserMetadata = async (req: CustomRequest, res: Response) => {
    const { avatarId } = req.body;
    const { id: userId } = req.user!;

    if (!avatarId) {
        res.status(400).json({ "error": "Enter a valid avatarId" })
        return
    }

    try {
        const avatar = await prisma.avatar.findUnique({
            where: {
                id: avatarId
            },
            select: {
                id: true
            }
        })

        if (!avatar) {
            res.status(440).json({ "error": "Avatar does not exist" })
            return;
        }

        // Update User metadata
        await prisma.user.update({
            where: { id: userId },
            data: { avatarId }
        })

        res.status(200).json({ "message": "Avatar updated Successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })

    }
}

export const getAllUsersMetadata = async (req: Request, res: Response) => {
    let arrayOfIds = req.query.ids

    if (!arrayOfIds || typeof arrayOfIds !== 'string') {
        res.status(400).json({ "error": "Please enter valid IDs" });
        return;
    }

    try {
        arrayOfIds = JSON.parse(arrayOfIds) as string[];
    } catch (error) {
        res.status(400).json({ "error": "Invalid Id Format" });
        return;
    }

    if (arrayOfIds.length === 0) {
        res.status(400).json({ "error": "ID array cannot be empty" });
        return;
    }

    try {
        // Find all users with provided ID
        const usersArray = await prisma.user.findMany({
            where: {
                id: {
                    in: arrayOfIds
                }
            }, select: {
                id: true,
                avatarId: true
            }
        })

        // Find corresponding image urls of all users
        const avatars = await Promise.all(
            usersArray.map(async ({ id, avatarId }) => {
                if (avatarId) {
                    const avatar = await prisma.avatar.findUnique({
                        where: {
                            id: avatarId
                        },
                        select: {
                            imageUrl: true
                        }
                    })
                    return { userId: id, imageUrl: avatar?.imageUrl }
                }
                return { userId: id, imageUrl: null }

            })
        );

        res.status(200).json({ avatars })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}


export const getAllAvatars = async (req: Request, res: Response) => {
    try {
        const avatars = await prisma.avatar.findMany()
        res.status(200).json({ avatars })
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'error': "Internal Server Error" })
    }
}


export const getAllElements = async (req: Request, res: Response) => {
    try {
        const elements = await prisma.element.findMany()
        res.status(200).json({ elements })
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'error': "Internal Server Error" })
    }
}

