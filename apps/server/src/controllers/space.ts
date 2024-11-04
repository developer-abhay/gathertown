import { Request, Response } from "express"
import prisma from "../db/prisma"
import { CustomRequest } from "../interfaces/types";

export const getAllSpace = async (req: CustomRequest, res: Response) => {
    const user = req.user;

    try {
        const spaces = await prisma.user.findUnique({
            where: {
                id: user?.id
            },
            include: {
                spaces: {
                    select: {
                        id: true,
                        name: true,
                        thumbnail: true,
                        height: true,
                        width: true
                    }
                }
            }
        });

        // if (!spaces.length == 0) {
        //     res.status(404).json({ "message": 'No Spaces found' })
        //     return;
        // }
        res.status(200).json({ spaces })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getSpaceById = async (req: Request, res: Response) => {
    const spaceId = req.query.spaceId as string;

    try {
        const space = await prisma.space.findUnique({
            where: {
                id: spaceId
            },
            include: {
                spaceElements: true
            }
        })

        if (!space) {
            res.status(404).json({ 'error': 'No space found' })
            return;
        }

        res.status(200).json({ space })

    } catch (error) {
        console.log(error)
        res.status(500).json({ 'message': "Internal Server Error" })
    }
}

export const createSpace = async (req: Request, res: Response) => {
    try {
        const { name, height, width, mapId } = req.body;

        if (!name || !height || !width || !mapId) {
            res.status(400).json({ error: "Enter Valid inputs" })
        }

        const space = await prisma.space.create({
            data: {
                name,
                width,
                height
            }
        })

        res.status(200).json({ spaceId: space.id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'message': "Internal Server Error" })

    }
}

export const deleteSpaceById = async (req: Request, res: Response) => {
    const spaceId = req.query.spaceId as string;

    try {
        await prisma.space.delete({
            where: {
                id: spaceId
            }
        })

        res.status(200).json({ "message": "Space deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'message': "Internal Server Error" })
    }
}

export const addElementToSpace = async (req: Request, res: Response) => {
    const { elementId, spaceId, x, y } = req.body();
    try {
        await prisma.spaceElements.create({
            data: {
                elementId,
                spaceId,
                x,
                y,
            }
        })
        res.status(200).json({ "message": "Element added successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}

export const deleteSpaceElements = async (req: Request, res: Response) => {
    const { id } = req.body();
    try {
        await prisma.spaceElements.delete({
            where: {
                id
            }
        })
        res.status(200).json({ "message": "Element deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}